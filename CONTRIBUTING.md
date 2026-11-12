# Porta un mondo sul treno

Per proporre un vagone, usa **Crea un vagone** sul sito oppure apri una Issue con il modello “Proponi un vagone”. Il sito prepara un testo: l'invio avviene soltanto quando lo confermi su GitHub. Non salva né carica immagini da solo.

Includi nome, descrizione, bozza e attribuzione. Condividi solo immagini e codice che hai creato o puoi riutilizzare, indicando la licenza. Le proposte vengono revisionate prima di entrare nel convoglio; una proposta non è un caricamento automatico.

## Proporzioni grafiche

I vagoni occupano 154 unità in larghezza nel mondo, distanziati di 170 unità. Le nuove illustrazioni sono PNG trasparenti a **1774 × 887 pixel**, disegnati in sezione laterale con una lieve profondità interna. Mantieni proporzioni, telaio, ruote e agganci coerenti con gli esempi in `assets/carriages/`. Il renderer elimina visivamente i margini trasparenti e allinea il fondo delle ruote al binario senza modificare i file originali.

Usa una risoluzione almeno equivalente, evitando semplici ingrandimenti di immagini piccole. Inserisci persone, attività e oggetti riconoscibili. Ogni illustrazione attuale è statica: animare singoli personaggi richiede livelli o sprite separati. `assets/README.md` documenta origine e brief; il disegno procedurale in `src/artwork.js` resta una riserva in caso di caricamento fallito.
## Sviluppo

1. Crea una branch, installa le dipendenze di sviluppo con `npm ci` e avvia `npm start`.
2. Aggiungi la scheda a `src/catalog.js`, il PNG in `assets/carriages/` e il relativo identificatore in `src/illustrations.js`. I quattro vagoni iniziali e i loro punteggi sono dimostrativi.
3. Esegui `npm test` e `npm run test:browser` (prima installa Chromium con `npx playwright install chromium`).
4. Apri una PR con schermate mobile/desktop e descrizione del cambiamento. Non inserire token, credenziali o dati personali nei file pubblici.

Non assegnare una licenza a contributi di altri senza il loro consenso. La licenza generale del repository è una scelta del proprietario, ancora da definire.
