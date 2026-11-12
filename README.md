# Infinite-train

Un viaggio pixel art condiviso, con una locomotiva in rame e quattro piccoli mondi: una serra, una biblioteca, un giardino con koi e un osservatorio. Il prototipo è stato ricostruito da zero; non utilizza il precedente archivio.

## Cosa funziona

- Scena originale Canvas con montagne in parallasse, stelle, ruote, fumo e cambio notte/alba.
- Illustrazioni dei vagoni a 616 × 376 pixel, resa alla densità del dispositivo (fino a 3×) e lente per una vista dettagliata a 1,8×. Le parti statiche sono memorizzate per non ridisegnare ogni foglia e ogni libro a ogni fotogramma.
- Selezione dei vagoni tramite swipe, trascinamento, pulsanti, schede e frecce della tastiera; Home/End sul canvas.
- Pausa, preferenze di movimento ridotto, controlli HTML accessibili, dialogo nativo con Escape e contenuto alternativo senza JavaScript.
- Storie dei vagoni e classifica. I voti demo sono locali; i voti pubblici usano esclusivamente GitHub.
- Modulo che prepara una proposta di vagone su GitHub, senza invii o caricamenti nascosti.

## Avvio e verifiche

Richiede Node.js 22 o successivo per gli strumenti di sviluppo. Il sito pubblicato non richiede Node né dipendenze esterne.

```sh
npm ci
npm start
```

Apri http://127.0.0.1:4173/Infinite-train/ (il prefisso riproduce GitHub Pages). Servi i file via HTTP: aprire direttamente `index.html` con `file://` non supporta correttamente i moduli JavaScript.

```sh
npm test
npx playwright install chromium
npm run test:browser
```

`npm test` copre voti, persistenza e risposte pubbliche. I test browser coprono viewport desktop e iPhone in Chromium, navigazione touch/tastiera, dialogo, rete indisponibile, storage bloccato e movimento ridotto. Non equivalgono a un test su iPhone fisico/Safari. Nessun passaggio di build è necessario. Con il server avviato, `node scripts/capture.js` salva anteprime in `test-results/previews`.

## Voti demo e voti pubblici

**Demo:** i punteggi iniziali 128, 96, 84 e 112 sono campioni inventati, etichettati come tali. Il cuore aggiunge o rimuove un solo voto per vagone in questo browser, nella chiave `infinite-train.demo-votes.v1` di localStorage. Se lo storage non è disponibile, il voto vale solo per la sessione. Non è un sistema antifrode e non invia voti al server.

**Pubblici:** inizialmente ogni `issue` in `src/catalog.js` è `null`: l'interfaccia mostra “Da attivare” senza simulare utenti o conteggi. Per attivarli:

1. Abilita le Issues del repository e crea una Issue di votazione per ciascun vagone.
2. Inserisci il relativo numero positivo in `issue` nella scheda del vagone e pubblica la modifica.
3. Il sito legge `reactions["+1"]` dall'API pubblica GitHub. “Vota su GitHub” apre la Issue: gli utenti autenticati aggiungono una reazione +1 al messaggio iniziale.
4. “Aggiorna” rilegge i conteggi. In caso di errore o limite API compare “Non disponibile”; i voti demo non vengono mai usati come ripiego.

Non servono token nel browser. Le richieste non autenticate sono soggette ai limiti GitHub. Ogni account può aggiungere una reazione +1 per Issue; questo non garantisce una persona unica per voto. L'ordine del convoglio rimane editoriale; la classifica ordina i punteggi senza spostare i vagoni durante l'esplorazione.

## Pubblicazione su GitHub Pages

La PR non pubblica il sito. Dopo la revisione e il merge in `main`:

1. In **Settings → Pages**, seleziona **Deploy from a branch**.
2. Scegli **main** e **/(root)**, poi salva.
3. Attendi il completamento del deployment GitHub Pages e visita https://sbregas.github.io/Infinite-train/.

Tutti i percorsi dell'app sono relativi e vengono verificati sotto `/Infinite-train/`. `.nojekyll` evita elaborazioni Jekyll non necessarie. Non è richiesto alcun segreto o workflow di deploy personalizzato.

## Struttura

- `index.html`, `app.css`, `tokens.css`: interfaccia responsive e contenuto alternativo.
- `src/catalog.js`: vagoni, campioni demo e associazioni alle Issue.
- `src/model.js`: persistenza, classifica e lettura dei voti pubblici.
- `src/artwork.js`: illustrazioni dettagliate originali, cache e ruote animate.
- `src/scene.js`: paesaggio, densità dello schermo, zoom e interazioni del canvas.
- `src/app.js`: controlli, stato condivisibile nell'URL e dialogo contributi.
- `tests/`: verifiche automatiche; `docs/`: scelte progettuali e verifica.

Per aggiungere il tuo vagone leggi [CONTRIBUTING.md](CONTRIBUTING.md). La licenza generale è ancora da definire dal proprietario; questo prototipo non attribuisce licenze a materiale altrui.
