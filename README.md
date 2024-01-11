## Content

1. Meccanismo per la selezione del POI
  1. Idea del Canvas
  2. Posizionamento dei Markers
  3. Posizionamento delle Arrows di navigazione

## MECCANISMO PER LA SELEZIONE DEL POI

### IDEA DEL CANVAS

L'idea dietro al positioning delle cards è di specificarne una posizione (rispetto al loro centro) in un canvas virtuale del seguente tipo:

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/5a10f627-5df3-48d6-a338-1a4743acd637" height="600">
</p>

La prima card ha sempre posizione 0,0.

A ciascuna card è applicato uno stesso offset (canvas_x_offset, canvas_y_offset) inizialmente posto a (0 , 0). Quando si seleziona di traslare su un'altra card, tale offset è impostato alla posizione della card selezionata; si fanno quindi spostare TUTTE le card dell'opposto di tale offset (tramite il meccanismo di animazione di React Native) e di conseguenza quella selezionata finirà con la posizione sullo (0 , 0), ovvero al centro dello schermo.

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/6e923034-19cc-4588-897c-0e076cb01309" height="600"> | <img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/4077eb65-dfba-4e56-a816-484f55935104" height="600">
</p>

(nota: Le immagini utilizzate per le Cards sono catturate tramite google-earth e sono memorizzate lato back-end)
(nota: il canvas è solo virtuale e lo sfondo è fermo sull'applicazione)

L'idea dell'utilizzo di questo meccanismo è per semplificare l'interazione dell'utente nella scelta del POI, dando un'impatto visivo e geografico del luogo in cui si sceglie di generare la foto.

### POSIZIONAMENTO DEI MARKERS:

Per il posizionamento dei Markers ( i bottono arancioni che indicano i vari POI ) si vuole creare un mapping di questo tipo tra il display del telefono e l'immagine della mappa:

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/8ca0d324-8c48-4178-b248-00f11da3123e" width="350" height="350">
</p>

Ovvero si vuole far si che i 1000 pixel verticali dell'immagine vadano a rientrare in qualsiasi sia il numero di pixel verticali del frame (FRAME_HEIGHT), mentre si adegua la quantità orizzontale di pixel mostrati in relazione al ratio del display del dispositivo (FRAME_WIDTH/FRAME_HEIGHT).

I markers sono posizionati sulla mappa specificando una posizione, in pixel, sull'immagine del POI; in particolare utilizzano il seguente sistema di coordinate:

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/fd055ffc-4934-4d0a-8097-225ff505a303" width="350" height="350">
</p>

Tali coordinate devono quindi essere riportate a delle coordinate sul display del telefono; per fare ciò si utilizza il seguente meccanismo:

Come prima cosa si proietta il ratio del telefono sul canvas: nell'altezza del telefono (FRAME_HEIGHT) entrerà verticalmente l'intera immagine; nella larghezza del telefono (FRAME_WIDTH) dovranno entrare i pixel dell'immagine contenuti nella linea gialla orizzontale (che dipenderà dal ratio del telefono):

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/2e5aa314-f470-453c-8715-18d6a23c5c3a" width="350" height="350">
</p>

Il numero di pixel dell'immagine che corrispondono a tale linea gialla orizzontale si trovano con: 

&emsp;&emsp;&emsp;ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT

Mantenendo tutti i markers relativamente vicini al centro, questi vengono proiettati sullo schermo del telefono ragionando nel seguente modo (si fa riferimento al posizionamento orizzontale; quello verticale si ottiene allo stesso modo):

La posizione orizzontale del marker nell'immagine markers[i].position.x può essere sia positiva che negativa; in relazione alla sua posizione rispetto al centro avrà un valore nel range: 

&emsp;&emsp;&emsp;[ - (ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT)/2 , + (ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT)/2 ]

Markers posizionati fuori da questo range non compariranno sul display.

Si utilizza quindi il seguente calcolo per interpolare il precedente range sul range [-0.5, 0.5]: 

&emsp;&emsp;&emsp;markers[i].position.x/( ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT )

Moltiplicando il precedente range per FRAME_WIDTH si va a proiettare la coordinata del marker nel range: 

&emsp;&emsp;&emsp;[ - FRAME_WIDTH/2 , + FRAME_WIDTH/2 ]

E si può usare proprio quest'ultimo valore della coordinata (MARKER_SCREEN_POS) per posizionare il marker sullo schermo nel seguente modo:

&emsp;&emsp;&emsp;FRAME_WIDTH/2 + MARKER_SCREEN_POS - MARKER_SIZE/2

NB: accomodando le posizioni dei markers in modo tale da rientrare nel ratio più piccolo possibile, si ha garanzia che non fuoriescano dallo schermo per tutti i ratio più grandi. 

### POSIZIONAMENTO DELLE ARROWS DI NAVIGAZIONE:

Le arrows per swappare di schermo sono posizionate con la seguente idea riassuntiva; prendendo in considerazione una singola arrow:

- Si prende una delle card associate alla card corrente e si trova il vettore d che ne congiunge le posizioni
- Si normalizza d; equivale a proiettare d sul cerchio unitario nel vettore n
- Si proietta n su un'ellisse moltiplicando gli assi del cerchio per dei fattori:
  - x = n.x * ELIPPSE_X_AXIS_LENGTH
  - y = n.y * ELLIPSE_Y_AXIS_LENGTH

Si effettua un'interpolazione agli estremi dell'ellisse per allargarla; il risultato finale è il seguente:

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/2a6a38a9-3e34-480c-a12d-6abc6608dc4b" height="500">
</p>

Scegliendo opportuni valori per i fattori utilizzati nelle trasformazioni si garantisce che le arrows compaiono nello schermo utilizzato dall'utente.

## FLOW DELL'APPLICAZIONE

Nel menù principale è possibile scegliere 3 opzioni: Generazione di un'immagine, Training LoRA, Check di un lora code.

### Generazione di una immagine:

Si inizia selezionando la città desiderata; quindi viene mostrato la mappa per la selezione del POI di tale città. Alla selezione di un marker compare un popup del POI selezionato; cliccandoci sopra si conferma la selezione, cliccando da un'altra parte dello schermo si torna alla scelta del POI.

Dopo la scelta del POI si passa alla selezione della foto nel relativo POI e a come inquadrare il soggetto da inserire.

Successivamente si passa alla specifica dei dettagli del soggetto.

Infine si arriva all'eventuale inserimento del "LoRA code" e al bottone che avvia la generazione.

Avviata la generazione si rimane in attesa del completamento.

Al completamento viene mostrata l'immagine generata e la possibilità di tornare alla home page.

### LoRA Training:

Selezionando il Lora Training si passa inizialmente a delle istruzioni dove è spiegato come scegliere le foto per il training; proseguendo si arriva alla pagina per la cattura delle foto.

In questa pagina l'utente deve selezionare uno dei bottoni contenenti le teste; ciascuno dei bottono è relativo ad una differente foto da catturare. \
Selezionato il bottone, cliccando il frame centrale si accede alla camera del dispositivo e si può scattare la foto associata al bottonoe selezionato.

Fatto ciò il relativo bottone diventa verde; quanto tutti i e 5 i bottoni delle foto sono verdi, allora premendo il bottone Confirm verrà avviato il training e si procede verso l'ultimo screen.

Nell'ultimo screen si comunica all'utente il codice LoRA che potrà utilizzare durante la compilazione del form per la generazione dell'immagine.

### Check Lora

Questa screen fornisce ad un'utente la possibilità di controllare la validità del proprio codice LoRA; inserendo il codice e premendo Check si ottiene in output una delle seguenti opzioni:

- Ready to use: il lora code è valido e il modello associato è pronto
- Not ready yet: il lora code è valido ma il modello associato è ancora in training
- Does not exists: il lora code non è un codice valido

## TECHNICAL NOTES

Nota: All'interno del file configurations.js, dentro la folder configs, è possibile:

- Configurare l'indirizzo del server django a cui connettersi
- Impostare un'offset rispetto al bordo inferiore dello schermo per ciascuno screen dell'applicazione (bottomSafeArea)

Nota: Il repository contiene la directory del progetto expo esclusa la folder node_moules per via della dimensione e la quantità di files.

Nota: Le dependencies utilizzate nel progetto react, e che compaiono con il comando "npm list" all'interno della folder del progetto, sono specificate nel file installed-dependencies.txt

## TO-DO:

- Migliorare la qualità (risoluzione) della foto catturate con la camera di expo: migliore è la qualità meglio viene il LoRA
- Migliorare le istruzioni per la cattura delle foto di training (?)
