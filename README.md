Nota: Il repository contiene la directory del progetto expo esclus la folder node_moules per via della dimensione e la quantità di files.

MARKER POSITIONING:

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

FRAME_WIDTH/2 + SCREEN_POS - MARKER_SIZE/2




