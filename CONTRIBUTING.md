# Porta un mondo sul treno

Per proporre un vagone, usa **Crea un vagone** sul sito oppure apri una Issue con il modello “Proponi un vagone”. Il sito prepara un testo: l'invio avviene soltanto quando lo confermi su GitHub. Non salva né carica immagini da solo.

Includi nome, descrizione, bozza e attribuzione. Condividi solo immagini e codice che hai creato o puoi riutilizzare, indicando la licenza. Le proposte vengono revisionate prima di entrare nel convoglio; una proposta non è un caricamento automatico.

## Proporzioni grafiche

I vagoni occupano 154 × 94 unità nel mondo, ma vengono disegnati su una griglia di **616 × 376 pixel** (4× per lato). Le coordinate artistiche sono quindi quattro volte quelle del mondo: agganci intorno a y=324, ruote intorno a y=345. Tieni 64 pixel artistici liberi fra vagoni. Per una bozza usa un PNG trasparente a 616 × 376 o un multiplo intero. `src/artwork.js` contiene gli interni dettagliati e una cache delle parti statiche; `src/scene.js` gestisce scena, densità dello schermo e zoom. Importare uno sprite richiede una modifica del renderer.

## Sviluppo

1. Crea una branch, installa le dipendenze di sviluppo con `npm ci` e avvia `npm start`.
2. Aggiungi la scheda a `src/catalog.js` e il disegno a `src/artwork.js`. I quattro vagoni iniziali e i loro punteggi sono dimostrativi.
3. Esegui `npm test` e `npm run test:browser` (prima installa Chromium con `npx playwright install chromium`).
4. Apri una PR con schermate mobile/desktop e descrizione del cambiamento. Non inserire token, credenziali o dati personali nei file pubblici.

Non assegnare una licenza a contributi di altri senza il loro consenso. La licenza generale del repository è una scelta del proprietario, ancora da definire.
