<!-- Planen i kort form: det som inte ändras från vecka till vecka. -->
<div class="guide">
	<section>
		<h2 class="rubrik">En vanlig vecka</h2>
		<div class="vecka">
			<div class="f"><b>Mån</b>Filmblock 2 h</div>
			<div class="p"><b>Tis</b>17:00 Omdöme</div>
			<div class="p"><b>Ons</b>17:00 Jobbet</div>
			<div class="p"><b>Tor</b>17:00 Agenter / Skärm</div>
			<div><b>Fre</b>07:30 LinkedIn</div>
		</div>
		<ul>
			<li><b>Golvet är en film i veckan.</b> En missad vecka är bara en missad vecka.</li>
			<li><b>Hellre för mycket material.</b> Filma mer än som behövs. Resten hamnar i banken.</li>
			<li><b>Efter varje kursdag:</b> ett rått samtal i bilen. <i>"Frågan alla ställde idag."</i></li>
			<li><b>Dagarna är en hjälp, inte en regel.</b> Blanda fritt när något roligt händer.</li>
			<li><b>Är måndagen bokad</b> flyttar filmblocket. Nu-vyn visar vart.</li>
		</ul>
	</section>

	<details>
		<summary>Fyra pelare</summary>
		<dl>
			<dt>Omdöme</dt><dd>Dina åsikter om AI på jobbet. Serien <i>Frågan före verktyget</i>.</dd>
			<dt>Jobbet</dt><dd>Ett jobb som inte fanns för tre år sen: kursdagar, scener, resor.</dd>
			<dt>Mina agenter</dt><dd>Hur du själv jobbar med AI. "Den här filmen klipptes av min AI-anställda."</dd>
			<dt>Skärm till samtal</dt><dd>Promenader, fokus, tempo, språken. Får växa i sin egen takt.</dd>
		</dl>
	</details>

	<details>
		<summary>Tre format</summary>
		<dl>
			<dt>Rått</dt><dd>En tagning, 1–3 min, du pratar fritt. Huvudformatet på TikTok.</dd>
			<dt>Klippt</dt><dd>Din röst över bilder från en kursdag, 25–45 s. Reels och LinkedIn först.</dd>
			<dt>Följ med</dt><dd>Korta selfieklipp och bilder från platsen, i tidsordning, 30–60 s.</dd>
		</dl>
	</details>

	<details>
		<summary>Krokar</summary>
		<p>Säg sökordet (AI, ChatGPT, AI-agent) i första meningen.</p>
		<dl>
			<dt>Påstående</dt><dd>"Det mest missförstådda med AI på jobbet är att det handlar om verktyg."</dd>
			<dt>Tvärtom</dt><dd>"Sluta köpa AI-licenser om ni vill att folk ska använda AI."</dd>
			<dt>Fråga</dt><dd>"Har din chef också sagt att ni ska 'börja med AI'?"</dd>
			<dt>Igenkänning</dt><dd>"När ledningsgruppen frågar vilket verktyg ni ska välja, och ingen vet vilket problem ni ska lösa."</dd>
			<dt>Siffra</dt><dd>Bara med en siffra du faktiskt har.</dd>
		</dl>
	</details>

	<details>
		<summary>Gränser</summary>
		<ul>
			<li>Filma ryggar, händer och skärmar. Ansikten bara med skriftligt samtycke.</li>
			<li>Inga kundnamn, logotyper eller dokument i bild. Säg "en ledningsgrupp".</li>
			<li>Hos kunder och på Bonnier: fråga arrangören innan du filmar.</li>
			<li>På konferenser: ryggar och scenen på avstånd.</li>
		</ul>
	</details>

	<details>
		<summary>Säg till Claude</summary>
		<dl>
			<dt>"ge mig krokar"</dt><dd>Tre krokar inför filmblocket, från idéerna här.</dd>
			<dt>"klipp, jag har filmat"</dt><dd>Klipper, lägger filmen i pipelinen och resten i banken.</dd>
			<dt>"tiktok"</dt><dd>Caption, schemaläggning, flyttar filmen till Schemalagd.</dd>
			<dt>"sortera inkorgen"</dt><dd>Ger varje lös tanke en pelare och en krok.</dd>
		</dl>
	</details>
</div>

<style>
	.guide {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}
	h2 {
		font-size: 28px;
	}
	.vecka {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 6px;
	}
	.vecka div {
		border: 1px solid var(--color-linje);
		background: var(--kort);
		padding: 10px 8px;
		font-size: 15px;
		line-height: 1.3;
	}
	.vecka b {
		display: block;
		text-transform: uppercase;
		font-size: 14px;
	}
	.vecka .f {
		border: 2px solid var(--color-svart);
	}
	.vecka .p {
		background: var(--smor);
		border-color: var(--smor);
		color: var(--smor-text);
	}
	ul {
		margin: 0;
		padding-left: 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	details {
		border-top: 1px solid var(--color-linje);
		padding: 0 0 4px;
	}
	details:last-of-type {
		border-bottom: 1px solid var(--color-linje);
	}
	summary {
		cursor: pointer;
		padding: 14px 0;
		font-weight: 800;
		text-transform: uppercase;
		font-size: 18px;
		list-style: none;
		display: flex;
		justify-content: space-between;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: '+';
	}
	details[open] summary::after {
		content: '–';
	}
	details > p {
		margin: 0 0 10px;
	}
	dl {
		display: grid;
		grid-template-columns: 10em minmax(0, 1fr);
		gap: 6px 14px;
		margin: 0 0 16px;
	}
	dt {
		font-weight: 700;
	}
	dd {
		margin: 0;
	}
	details ul {
		margin-bottom: 16px;
	}
	@media (max-width: 600px) {
		.vecka {
			grid-template-columns: 1fr;
		}
		dl {
			grid-template-columns: 1fr;
			gap: 0;
		}
		dd {
			margin-bottom: 8px;
		}
	}
</style>
