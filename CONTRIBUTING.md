# Porta un mondo sul treno

Per proporre un vagone, usa **Crea un vagone** sul sito oppure apri una Issue con il modello “Proponi un vagone”. Il sito prepara un testo: l'invio avviene soltanto quando lo confermi su GitHub. Non salva né carica immagini da solo.

Includi nome, descrizione, bozza e attribuzione. Condividi solo immagini e codice che hai creato o puoi riutilizzare, indicando la licenza. Le proposte vengono revisionate prima di entrare nel convoglio; una proposta non è un caricamento automatico.

## Proporzioni grafiche

I vagoni attuali occupano 154 × 94 pixel logici, con agganci a y=81 e ruote con asse a y=86. Tieni 16 pixel liberi fra vagoni. Per una bozza puoi usare un PNG trasparente a queste dimensioni o un multiplo intero. La versione attuale disegna gli interni con Canvas in `src/scene.js`; importare uno sprite richiede una modifica del renderer.

## Sviluppo

1. Crea una branch, installa le dipendenze di sviluppo con `npm ci` e avvia `npm start`.
2. Aggiungi la scheda a `src/catalog.js` e il disegno a `src/scene.js`. I quattro vagoni iniziali e i loro punteggi sono dimostrativi.
3. Esegui `npm test` e `npm run test:browser` (prima installa Chromium con `npx playwright install chromium`).
4. Apri una PR con schermate mobile/desktop e descrizione del cambiamento. Non inserire token, credenziali o dati personali nei file pubblici.

Non assegnare una licenza a contributi di altri senza il loro consenso. La licenza generale del repository è una scelta del proprietario, ancora da definire.
