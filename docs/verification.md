# Verifica del prototipo

Verifica locale del 12 novembre 2026, Windows, Node 24.18 e Playwright 1.65.

- 5 test del modello: storage malformato/bloccato, toggle voto, classifica con parità, conteggi pubblici non configurati, risposte pubbliche non valide.
- 20 test browser: 10 scenari eseguiti a 1440 × 1000 e con profilo iPhone 13 in Chromium. Coprono navigazione, tastiera, touch, cambio alba, voti persistenti, separazione pubblico/demo, errori API e retry, dialogo, JavaScript disattivato, storage bloccato, canvas fermo con movimento ridotto, densità dei pixel e selezione durante lo zoom.
- Schermate reali e assenza di overflow orizzontale controllate a 320, 390, 1440 e 1920 pixel.
- Percorsi verificati sotto `/Infinite-train/`, come su GitHub Pages.
- Aggiornamento grafico: artwork 616 × 376, anteprime 720 × 408, screenshot a densità 1×/2×/3×. Esempi del canvas in vista dettagli: desktop 1326 × 520, Retina 2652 × 1040, mobile 1044 × 1260 su area CSS 348 × 420. Dettagli ridisegnati, non semplice ingrandimento dei vecchi pixel.
- Nessuna dipendenza runtime. Audit npm senza vulnerabilità note al momento della verifica.
- Controllo statico stile: 0 FAIL, 0 REFLEX, 0 WARN. La fase render del linter non è disponibile (manca puppeteer-core); il controllo visuale effettivo usa Playwright e le schermate sopra.

## Limiti espliciti

Non è stata verificata una pubblicazione GitHub Pages. I test mobile sono emulazione Chromium, non Safari su un iPhone fisico. I conteggi pubblici sono stati verificati con risposte API controllate: le quattro associazioni alle Issue sono intenzionalmente vuote. Non esiste un backend per upload automatici: il modulo apre una proposta GitHub che l'utente deve inviare. La classifica cambia ordine, il convoglio mantiene il proprio ordine per evitare salti durante l'esplorazione.

## Revisione

La revisione indipendente ha confermato preliminarmente la sanificazione dei voti, la separazione delle modalità, i percorsi relativi e l'isolamento della tastiera nel dialogo. Il revisore ha raggiunto il limite di utilizzo prima di completare il verdetto; non si dichiara quindi una revisione indipendente completa. La verifica finale è stata completata dall'autore con ispezione delle schermate e la suite sopra. Il pulsante di ripresa è disabilitato quando il dispositivo richiede movimento ridotto, per non offrire un'azione senza effetto.
