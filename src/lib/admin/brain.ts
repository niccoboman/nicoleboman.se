import type { SupabaseClient } from '@supabase/supabase-js';

export type QueuedAttachment = {
	name: string;
	path: string;
	size: number;
	type: string;
};

type QueueCaptureInput = {
	client: SupabaseClient;
	userId: string;
	text: string;
	files: File[];
};

function safeFilename(name: string) {
	const extension = name.includes('.') ? `.${name.split('.').pop()}` : '';
	const base = name.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
	const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'bilaga';
	return `${slug}${extension.toLowerCase()}`;
}

export async function queueBrainCapture({ client, userId, text, files }: QueueCaptureInput) {
	const id = crypto.randomUUID();
	const createdAt = new Date().toISOString();
	const initialAttachments = files.map((file) => ({
		name: file.name,
		path: `${userId}/${id}/${safeFilename(file.name)}`,
		size: file.size,
		type: file.type || 'application/octet-stream',
		state: 'pending'
	}));

	const { error: insertError } = await client.from('brain_captures').insert({
		id,
		user_id: userId,
		content: text || 'Bilaga utan text',
		source: 'admin',
		state: 'processing',
		attachments: initialAttachments,
		created_at: createdAt
	});
	if (insertError) throw insertError;

	const uploaded: QueuedAttachment[] = [];
	let attachmentError: Error | null = null;
	for (let index = 0; index < files.length; index += 1) {
		const file = files[index];
		const metadata = initialAttachments[index];
		const { error } = await client.storage.from('brain-private').upload(metadata.path, file, {
			contentType: metadata.type,
			upsert: false
		});
		if (error) {
			attachmentError = new Error(error.message);
			break;
		}
		uploaded.push({ name: metadata.name, path: metadata.path, size: metadata.size, type: metadata.type });
	}

	const { error: updateError } = await client
		.from('brain_captures')
		.update({
			state: 'pending',
			attachments: uploaded,
			error: attachmentError ? `Bilaga väntar: ${attachmentError.message}` : null
		})
		.eq('id', id)
		.eq('user_id', userId);
	if (updateError && !attachmentError) attachmentError = new Error(updateError.message);

	return { id, createdAt, attachments: uploaded, attachmentError };
}
