import { View, Animated, StyleSheet, Image} from "react-native";
import { settings, media_items_path, CITIES_CARDS, SCREEN_WIDTH, SCREEN_HEIGHT } from '../configs/configurations'
import Component_Map_Ui_Manager from './Component_Map_Ui_Manager'

const area_card_frame_size = 96 // perchentage

// ------------------------------------------------------------------------------------------------------------------------- |
                                                 /* NOTES */
// ------------------------------------------------------------------------------------------------------------------------- | 

/*  INTERACTION FLOW: 

    > INITIAL STATE: 
    All'inizio viene renderizzata l'area 0, con relativi markers e freccie di movimento; si hanno le seguenti interazioni a
    disposizione:
    
        > Al Click di un marker si passa nello stato: MARKER SELECTED STATE
        In questo stato l'UI svanisce e rimane visibile solo il marker selezionato e una immagine di overview di un POI
        
        > Al Click di un arrow:
        Al click di un'arrow il componente UI viene rirenderizzato mentre nella mappa viene triggerata la funzione translateCanvas
        la quale fa traslare la visuale su un'altra area attraverso un'animazione (che non fa partire nessun rerender)
        Siamo quindi nuovamente nello stato iniziale ma con un'altra area visualizzata, con relativi markers e freccie di movimento

    > MARKER SELECTED STATE:
    Quando si è nella selezione di un marker si ha le seguenti interazioni a disposizione:

        > Click sull'immagine comparsa: -> si passa ad un'altro screen, Shot Selection Screen, passando il valore del POI selezionato
        
        > Click fuori dall'immagine:
        Torno all'area visualizzata precedentemente, con relativi markers e freccie di movimento

*/

/*  CANVAS POSITION: ( Riassunto del meccanismo per visualizzare le aree )
    Tutte le aree specificano una posizione; questa posizione, da interpretare in pixel, specifica la posizione di una View che 
    contiene un'immagine dell'area; tutte le carte, tranne quella selezionata, hanno posizioni che le collocano FUORI dal display
    e non sono quindi visibili.
    Le variabili canvas_x/y_offset specificano un'offset che viene APPLICATO a tutte le posizioni delle VIEWs contenenti
    le aree; quando si preme una freccia dell'UI questa triggera un'animazione che fa variare i valori di canvas_x/y_offset facendo
    di conseguenza muovere tutte le VIEWs; impostando valori opportuni sulle variabili di offset canvas_x/y_offset, si riesce
    a traslare la visuale sulle varie VIEWs contenenti le immagini delle aree. 

*/

// ------------------------------------------------------------------------------------------------------------------------- |
                                        /* COMPONENT STATIC CONFIGURATIONS */
// ------------------------------------------------------------------------------------------------------------------------- | 

//  AREAS CONFIGURATIONS:

let AREA_CARDS = [];

//  VARIABLES INITIALIZATION:
/*  canvas_offset specifica di quanto è spostato il canvas rispetto ad una origine iniziale; la prima card dell'array delle carte deve
    avere posizione (0,0) */

let canvas_x_offset = new Animated.Value(0);
let canvas_y_offset = new Animated.Value(0);
let curr_area = 0;

// ------------------------------------------------------------------------------------------------------------------------- |
                                                /* FUNCTIONS */
// ------------------------------------------------------------------------------------------------------------------------- | 

// Definisce la funzione che gestisce gli eventi triggerati dai componenti UI della mappa:
const HandleUiEvent = (event, props) =>{
    if(event.title=="ARROW_SELECTION") 
    {
        translateCanvas(event.selected_area);
    }
    if(event.title=="POI_SELECTION")
    {
        props.onPoiSelection(event.selected_poi_name);
    }
}

/* Muove il canvas sulla card dell'area selezionata; NON triggera rerendering */
const translateCanvas = (area) => {
        
    Animated.timing(canvas_x_offset, {
        toValue: -AREA_CARDS[area].canvas_position.x * SCREEN_WIDTH,
        duration: 1000,
        useNativeDriver: false
    }).start()
    Animated.timing(canvas_y_offset, {
        toValue: -AREA_CARDS[area].canvas_position.y * SCREEN_HEIGHT,
        duration: 1000,
        useNativeDriver: false
    }).start()

    curr_area = area; 
}

// ------------------------------------------------------------------------------------------------------------------------- |
                                        /* THE ACTUAL MAP COMPONENT */
// ------------------------------------------------------------------------------------------------------------------------- | 

export default function Component_Map(props){

    let tileable_trees_img = require('../resources/icons/trees.jpg')

    canvas_x_offset.setValue(0)
    canvas_y_offset.setValue(0)
    curr_area = 0;

    // AREA CARDS SELECTION
    AREA_CARDS = global.CITIES_CARDS[props.city_name]

    // AREA CARDS DEFINITION
    /* Consuma i dati delle AREA_CARDS per costruire le views contenenti le aree da mostrare */

    let rendered_areas = []
    for(let i = 0; i < AREA_CARDS.length; i++)
    {
        let position = {x: AREA_CARDS[i].canvas_position.x * SCREEN_WIDTH, y: AREA_CARDS[i].canvas_position.y * SCREEN_HEIGHT }

        rendered_areas.push([

            /* Animated.View: Ogni card è posizionata all'interno di un'animated view che si muove in relazione all'offset del canvas */
            <Animated.View  key={i} style = {[  styles.area_card_container , { left: position.x, top: position.y, }]}>
                
                {/* View: questa view contiene il frame che mostra l'immagine della mappa e il quale verrà utilizzato come base per renderizzare l'ui */}
                <View style={ styles.area_card_frame }>

                    <Image source={{uri: AREA_CARDS[i].background_image }} resizeMode="cover" style={ styles.area_card_image } />
                    <View style={ styles.area_card_frame_border }></View>   
                                       
                </View>
                
            </Animated.View>
            
        ])
    }

    // RENDERING

    return(

        <View style={{ width: props.width, height: props.height }}>

            {/* REPEATING BACKGROUND IMAGE */}

                <Image 
                    source={tileable_trees_img} resizeMode="repeat" 
                    style={ styles.screen_background_image } />
            
            {/* RENDERING ALL AREAS: */}

                {rendered_areas}

            {/* RENDERING UI OVER THE PRECEDING AREAS: Renderizzo l'ui in relazione all'area selezionata */}

                <View style={ styles.screen_container }>

                    <View style={ styles.area_card_frame }>
                        
                        <Component_Map_Ui_Manager 
                            width={(props.width/100)*area_card_frame_size}
                            height={(props.height/100)*area_card_frame_size} 
                            card_side_margin={(100-area_card_frame_size)/2}

                            init_area={curr_area}
                            AREA_CARDS={AREA_CARDS}
                            uiEventCallBack={(event) => {HandleUiEvent(event, props)}}
                        />
                            
                    </View>   

                </View>

        </View>
    )

}

// ------------------------------------------------------------------------------------------------------------------------- |
                                                /* STYLESHEET */
// ------------------------------------------------------------------------------------------------------------------------- | 


const styles = StyleSheet.create({

    screen_background_image:
    {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    screen_container:
    {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    // CARD STYLES:

    area_card_container: 
    {        
        position: 'absolute', 
        width: '100%', 
        height: '100%', 

        alignItems: 'center',
        justifyContent: 'center',

        transform: [{translateX: canvas_x_offset}, {translateY: canvas_y_offset}]
    },
    area_card_frame: 
    {
        width: '' + area_card_frame_size + '%', 
        height: '' + area_card_frame_size + '%'
    },
    area_card_frame_border: 
    {
        positon:'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        borderStyle:'solid',
        borderWidth: 5
    },
    area_card_image:
    {
        position:'absolute',
        width: '100%',
        height: '100%', 
        borderRadius: 20
    },
})

