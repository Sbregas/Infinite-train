# Verifica del prototipo

Verifica locale del 12 novembre 2026, Windows, Node 24.18 e Playwright 1.65.

- 5 test del modello: storage malformato/bloccato, toggle voto, classifica con parità, conteggi pubblici non configurati, risposte pubbliche non valide.
- 24 test browser: 12 scenari eseguiti a 1440 × 1000 e con profilo iPhone 13 in Chromium. Coprono navigazione, tastiera, touch, cambio alba, voti persistenti, separazione pubblico/demo, errori API e retry, dialogo, JavaScript disattivato, storage bloccato, canvas fermo con movimento ridotto, densità dei pixel, selezione durante lo zoom, caricamento delle illustrazioni, errore/retry e vista ravvicinata con zoom, scorrimento e ripristino del focus.
- Schermate reali e assenza di overflow orizzontale controllate a 320, 390, 1440 e 1920 pixel.
- Percorsi verificati sotto `/Infinite-train/`, come su GitHub Pages.
- Aggiornamento grafico: cinque PNG RGBA da 1774 × 887 pixel, circa 16,3 MB in totale. Resa e vista ravvicinata controllate a densità 1×/2×/3×, senza overflow della pagina, alle larghezze 320, 390, 1440 e 1920. Ingrandimento oltre il 100% senza nuovi dettagli inventati. Il pannello dei dettagli scorre indipendentemente dalla pagina.
- Nessuna dipendenza runtime. Audit npm senza vulnerabilità note al momento della verifica.
- Controllo statico stile: 0 FAIL, 0 REFLEX, 0 WARN. La fase render del linter non è disponibile (manca puppeteer-core); il controllo visuale effettivo usa Playwright e le schermate sopra.

## Limiti espliciti

Le illustrazioni generate sono statiche: personaggi e ruote non hanno animazioni individuali. Il riferimento Floor796 riguarda la densità e la ricchezza degli ambienti; non si dichiara equivalenza con il suo intero mondo animato. I PNG richiedono circa 16,3 MB al primo caricamento; su connessioni lente rimane visibile il disegno procedurale di riserva.

Non è stata verificata una pubblicazione GitHub Pages. I test mobile sono emulazione Chromium, non Safari su un iPhone fisico. I conteggi pubblici sono stati verificati con risposte API controllate: le quattro associazioni alle Issue sono intenzionalmente vuote. Non esiste un backend per upload automatici: il modulo apre una proposta GitHub che l'utente deve inviare. La classifica cambia ordine, il convoglio mantiene il proprio ordine per evitare salti durante l'esplorazione.

## Revisione

La revisione indipendente ha confermato preliminarmente la sanificazione dei voti, la separazione delle modalità, i percorsi relativi e l'isolamento della tastiera nel dialogo. Il revisore ha raggiunto il limite di utilizzo prima di completare il verdetto; non si dichiara quindi una revisione indipendente completa. La verifica finale è stata completata dall'autore con ispezione delle schermate e la suite sopra. Il pulsante di ripresa è disabilitato quando il dispositivo richiede movimento ridotto, per non offrire un'azione senza effetto.
