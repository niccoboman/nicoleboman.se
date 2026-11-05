// Jordpaletter som Nicole valt (5 nov 2026): 1, 5 och 7. Används av designförslaget på /alt2.
// Används av alla designskisser via ?p=1 | ?p=5 | ?p=7. Utan p visas skissens ursprungliga färger.
// Alla par nedan är uträknade till WCAG AA (minst 4,5:1):
//   ink på bas, mutad på bas, kort som textfärg på bas, korttext på kort, acctext på acc.
// acc (den oväntade färgen) mot bas klarar INTE 4,5 i 5 och 7 – använd den till ytor, former och knappar
// (med acctext), aldrig som textfärg direkt på bas.
// Bilder visas alltid utan färgfilter.

export type Palett = {
	id: '1' | '5' | '7';
	titel: string;
	bas: string; // sidans bakgrund
	papper: string; // ljusare yta (kortens framsidor, rutor)
	ink: string; // brödtext och rubriker
	mutad: string; // sekundär text
	linje: string; // hårlinjer
	kort: string; // huvudfärg för stora ytor/kort (mörk jordton); text på den = korttext
	kortMork: string; // mörkare variant av kort (skuggor, hover)
	korttext: string;
	acc: string; // den oväntade färgen; text på den = acctext
	acctext: string;
	display: string; // rubriktypsnitt (Fontshare)
	brod: string; // brödtypsnitt (Fontshare)
	fontshare: string[]; // ladda ett per <link>: https://api.fontshare.com/v2/css?f[]=<x>&display=swap
};

export const paletter: Record<string, Palett> = {
	'1': {
		id: '1', titel: 'Lera och kobolt',
		bas: '#efe6dc', papper: '#f6f0e8', ink: '#2b211b', mutad: '#5f4a3a', linje: 'rgb(43 33 27 / 0.14)',
		kort: '#8a5a3f', kortMork: '#6e4630', korttext: '#ffffff', acc: '#2f45ff', acctext: '#ffffff',
		display: 'Satoshi', brod: 'Satoshi', fontshare: ['satoshi@400,500,700,900']
	},
	'5': {
		id: '5', titel: 'Oliv och rosa',
		bas: '#ecebe1', papper: '#f4f3eb', ink: '#23251c', mutad: '#53553f', linje: 'rgb(35 37 28 / 0.14)',
		kort: '#5f5e37', kortMork: '#4a4929', korttext: '#ffffff', acc: '#ff7eb9', acctext: '#2a1020',
		display: 'Switzer', brod: 'Switzer', fontshare: ['switzer@400,500,600,800']
	},
	'7': {
		id: '7', titel: 'Kakao och himmel',
		bas: '#efe8e2', papper: '#f6f1ec', ink: '#2a1e18', mutad: '#5f4c40', linje: 'rgb(42 30 24 / 0.14)',
		kort: '#6b4b3a', kortMork: '#55392b', korttext: '#ffffff', acc: '#8ec9ff', acctext: '#16222e',
		display: 'Cabinet Grotesk', brod: 'General Sans', fontshare: ['cabinet-grotesk@500,700,800', 'general-sans@400,500,600']
	}
};

export function valjPalett(p: string | null): Palett | null {
	return (p && paletter[p]) || null;
}
