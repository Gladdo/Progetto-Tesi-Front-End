Nota: Il repository contiene la directory del progetto expo esclus la folder node_moules per via della dimensione e la quantità di files.

## CANVAS

L'idea dietro al positioning delle cards è di specificarne una posizione (rispetto al loro centro) in un canvas virtuale del seguente tipo:

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/5a10f627-5df3-48d6-a338-1a4743acd637" height="600">
</p>

La prima card ha sempre posizione 0,0.

A ciascuna card è applicato uno stesso offset (canvas_x_offset, canvas_y_offset) inizialmente posto a (0 , 0). Quando si seleziona di traslare su un'altra card, tale offset è impostato alla posizione della card selezionata; si fanno quindi spostare TUTTE le card dell'opposto tale offset (tramite il meccanismo di animazione di React Native) e di conseguenza quella selezionata finirà con la posizione sullo (0 , 0), ovvero al centro dello schermo.

<p align="center">
<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/6e923034-19cc-4588-897c-0e076cb01309" height="600"> | <img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/4077eb65-dfba-4e56-a816-484f55935104" height="600">
</p>

## MARKER POSITIONING:

Si vuole creare un mapping di questo tipo:

<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/8ca0d324-8c48-4178-b248-00f11da3123e" width="350" height="350">

Le coordinate dei markers specificano in pixel una posizione nell'immagine con il seguente sistema di coordinate:

<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/fd055ffc-4934-4d0a-8097-225ff505a303" width="350" height="350">

Come prima cosa si proietta il ratio del telefono sul canvas: nell'altezza del telefono (FRAME_HEIGHT) entrerà verticalmente l'intera immagine; nella larghezza del telefono (FRAME_WIDTH) dovranno entrare i pixel dell'immagine contenuti nella linea gialla orizzontale (che dipenderà dal ratio del telefono):

<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/2e5aa314-f470-453c-8715-18d6a23c5c3a" width="350" height="350">

Il numero di pixel dell'immagine che corrispondono a tale linea gialla orizzontale si trovano con: 

&emsp;&emsp;&emsp;ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT

Mantenendo tutti i markers relativamente vicini al centro, questi vengono proiettati sullo schermo del telefono nel seguente modo (facendo riferimento al posizionamento orizzontale, per il verticale si ragiona allo stesso modo):

markers[i].position.x, potendo essere sia positivo che negativo in relazione alla sua posizione rispetto al centro, sarà nel range: 

&emsp;&emsp;&emsp;[ - (ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT)/2 , + (ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT)/2 ]

Dunque il calcolo: 

&emsp;&emsp;&emsp;markers[i].position.x/( ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT )

Interpola tale range su [ -0.5 , 0.5 ]

A questo punto si prende il precedente range e lo si moltiplica per FRAME_WIDTH; questo proietta la posizione originale in un range pari a 

&emsp;&emsp;&emsp;[ - FRAME_WIDTH/2 , + FRAME_WIDTH/2 ]

Si può usare la quantità SCREEN_POS ottenuta per posizionare orizzontalmente il marker nello schermo con:

&emsp;&emsp;&emsp;FRAME_WIDTH/2 + SCREEN_POS - MARKER_SIZE/2

NB: accomodando le posizioni dei markers in modo tale da rientrare nel ratio più piccolo possibile, si ha garanzia che non fuoriescano dallo schermo per tutti i ratio più grandi. 

## ARROWS POSITIONING:

Le arrows per swappare di schermo sono posizionate con la seguente idea riassuntiva, prendendo in considerazione una singola arrow:

&emsp;&emsp;&emsp;* Si prende una delle card associate alla card corrente e si trova il vettore d che ne congiunge le posizioni

&emsp;&emsp;&emsp;* Si normalizza d; equivale a proiettare d sul cerchio unitario nel vettore n

&emsp;&emsp;&emsp;* Si proietta n su un'ellisse moltiplicando gli assi del cerchio per dei fattori:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;x = n.x * ELIPPSE_X_AXIS_LENGTH

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;y = n.y * ELLIPSE_Y_AXIS_LENGTH

Si effettua un'interpolazione agli estremi dell'ellisse per allargarla; il risultato finale è il seguente:

<img src="https://github.com/Gladdo/Progetto-Tesi-Front-End/assets/94845303/2a6a38a9-3e34-480c-a12d-6abc6608dc4b" height="500">


Scegliendo opportuni valori per i fattori utilizzati nelle trasformazioni si garantisce che le arrows compaiono nello schermo utilizzato dall'utente.

