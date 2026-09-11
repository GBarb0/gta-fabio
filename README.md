# Rockstar Fabio · 21 anni di storia

Biglietto di auguri animato in HTML, CSS e JavaScript. Apri `index.html` oppure avvia `python3 -m http.server 8080` e visita http://localhost:8080.

Una schermata iniziale neutra nasconde il tema del regalo: Play avvia insieme musica e racconto. Prima del clic le scene restano ferme. Tre scene da 14 secondi raccontano il regalo. Dopo la terza appare la copertina `gtaps5.webp` con il messaggio di auguri animato. Il finale resta visibile fino a «Riguarda dall’inizio».

- Testi, immagini e rotazioni delle scene: `SCENES` in `app.js`.
- Messaggio finale e copertina: sezione `gift` in `index.html`.
- Titoli: font locale `pricedown/Pricedown Bl.otf`. Paragrafi: sans-serif Helvetica Neue/Arial, con Chalet se installato.
- Musica: `song.mp3`, riprodotta in ciclo dopo un clic sul pulsante audio.
- Frecce destra/sinistra: navigazione. Barra spaziatrice: pausa delle scene. Il pulsante freccia permette di proseguire anche con movimento ridotto.
- La preferenza di sistema per movimento ridotto disattiva le animazioni e l’avanzamento automatico.

Nessuna compilazione richiesta. Immagini, copertina, Pricedown e audio sono locali; i font Google del layout originale hanno fallback di sistema.

## Deploy su Coolify

Il progetto include un `Dockerfile` pronto per Coolify. Crea una nuova applicazione Dockerfile collegata a questo repository, lascia vuoto il campo del comando di avvio e imposta la porta pubblica su `80`. Coolify costruirà l’immagine con Nginx e servirà il biglietto come sito statico.

Per provarlo localmente:

```bash
docker build -t fabio-birthday .
docker run --rm -p 8080:80 fabio-birthday
```

Apri quindi http://localhost:8080.

La schermata regalo prosegue con «Da parte di tutti noi» alla pagina delle firme. Il pulsante per ricominciare si trova lì. Le cinque firme SVG originali sono in `firme/`; i tracciati sono incorporati in `index.html` con maschere animate, bianco e bordo rosa. Funzionano anche aprendo il file senza server. Con movimento ridotto tutte le firme sono visibili subito.
