import { Image, TouchableWithoutFeedback, View } from "react-native";
import { interpolate } from 'react-native-reanimated'
import {useState} from 'react';

export default function Component_Map_Arrows_Manager(props){
    /*--------------------------------------------------------------------------------------------------- */
    /* SETUP BUTTONS POSITIONS ON SCREEN */
    /* 
        I bottoni "arrow" vengono distribuiti sullo schermo in relazione alle posizioni delle differenti aree cards;
        per una singola arrow ad esempio si prende la posizione della card attuale e la posizione della card verso quale navigare, quindi si
        determina un vettore direzione.

        Tale vettore direzione è poi proiettato su un cerchio di raggio unitario semplicemente normalizzandolo; quindi si procede
        a trasformare il cerchio unitario in un'ellisse (con un successivo step di interpolazione) per distribuire le arrow in modo
        più conforme allo schermo. 
    
    */

    const arrow_img = require('../resources/icons/arrow_btn.png')
    
    const [curr_area, setCurrArea] = useState(props.curr_area);

    AREA_CARDS = props.AREA_CARDS;

    const FRAME_WIDTH = props.width;
    const FRAME_HEIGHT = props.height;

    const top_margin = 120
    const ARROW_SIZE = 40;

    let ELIPPSE_X_AXIS_LENGTH = FRAME_WIDTH/2-40;
    let ELLIPSE_Y_AXIS_LENGTH = FRAME_HEIGHT/2-top_margin;

    const ELLIPSE_Y_AXIS_SQUISH = 0;
    const ELLIPSE_X_AXIS_SQUISH = 20;
    const ELLIPSE_TRANSLATE_Y = -top_margin/2+ARROW_SIZE;
    const ELLIPSE_TRANSLATE_X = 20;
    

    let navigation_buttons = []

    /* DRAW THE ARROW BUTTONS */
    /*  
        Prendi la posizione del'area corrente (point_A) e in relazione alla posizione di ogni altra area (point_B) determina 
        dove disegnare il bottone freccia
    */
    let point_A = {x: AREA_CARDS[curr_area].canvas_position.x, y: AREA_CARDS[curr_area].canvas_position.y}

    let connected_areas = AREA_CARDS[curr_area].connected_areas;

    for(let i = 0; i < connected_areas.length; i++){ 
        area_index = connected_areas[i];
        if(area_index!=curr_area){
            // poit_A e poit_B sono i centri delle due cards
            
            let point_B = {x: AREA_CARDS[area_index].canvas_position.x, y: AREA_CARDS[area_index].canvas_position.y}
            
            // Trovo il vettore che congiunge i due punti 
            let x = (point_B.x-point_A.x);
            let y = (point_B.y-point_A.y);

            // Normalizzo il precedente vettore così da trovarmi la coordinata dell'arrow sul cerchio unitario
            let norm = 1 / Math.sqrt(x*x + y*y);
            x = x*norm;
            y = y*norm;

            // In relazione alla direzione dell'arrow, calcolo di quanto devo roteare l'immagine della freccia
            var angle = Math.atan2(y, x);   
            var degrees = 180*angle/Math.PI-270;  
            degrees = (360+Math.round(degrees))%360; 
            var strDegrees= degrees+'deg';

            // Proietto la coordinata del cerchio sulla coordinata dell'ellisse:
            x = x * ELIPPSE_X_AXIS_LENGTH 
            y = y * ELLIPSE_Y_AXIS_LENGTH 

            // Traslo l'ellisse così che abba il centro nel centro dello schermo (invece che in alto a sinistra)
            x = x + FRAME_WIDTH/2;
            y = y + FRAME_HEIGHT/2; 
            
            // Faccio dell'interpolazione per provare a smussare un pò l'ellisse negli angoli
            x = interpolate(x, [0, FRAME_WIDTH/4, FRAME_WIDTH*3/4, FRAME_WIDTH], [ELLIPSE_X_AXIS_SQUISH, FRAME_WIDTH/20, FRAME_WIDTH*19/20, FRAME_WIDTH-ELLIPSE_X_AXIS_SQUISH])
            y = interpolate(y, [0, FRAME_HEIGHT/4, FRAME_HEIGHT*3/4, FRAME_HEIGHT], [ELLIPSE_Y_AXIS_SQUISH, FRAME_HEIGHT/8, FRAME_HEIGHT*7/8, FRAME_HEIGHT-ELLIPSE_Y_AXIS_SQUISH])

            const val = area_index;
            
            // CIRCLE ARROW BUTTONS
            navigation_buttons.push(

                <TouchableWithoutFeedback key={i} onPress={() => { props.onArrowSelection(val); setCurrArea(val); }} >

                    <View   style={{  
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                borderStyle: 'solid', 
                                borderRadius: 20, 
                                borderWidth: 4, 
                                borderColor: 'white', 
                                backgroundColor: '#4492eb',
                                position: 'absolute',
                                width: ARROW_SIZE, 
                                height: ARROW_SIZE, 
                                left: x-ELLIPSE_TRANSLATE_X, 
                                top: y-ELLIPSE_TRANSLATE_Y, 
                                transform: [{rotate: strDegrees}] 
                            }}
                    >
                        
                        <Image source={arrow_img} style={{ width: ARROW_SIZE, height: ARROW_SIZE }}/>

                    </View>

                </TouchableWithoutFeedback  >
            )
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* RENDERING */
    // ------------------------------------------------------------------------------------------------------------------------- | 
    
    return (

        <View style={{position: 'absolute'}}>

            {navigation_buttons}

        </View>
    
    )
}

// ------------------------------------------------------------------------------------------------------------------------- |
                                                /* DEBUG ELLIPSE POINTS RENDERING */
// ------------------------------------------------------------------------------------------------------------------------- | 
/*  DEBUG POINTS: SOSTITUIRE QUESTO SNIPPET AL PRECEDENTE (sotto DRAW THE ARROW BUTTONS) PER VEDERE LA FORMA DELL'ELLISSE SU 
    CUI VENGONO DISTRIBUITI I MARKERS */ 
/*  Questo pezzo di codice disegna 60 arrows distribuite uniformemente sull'ellisse definita dalla configurazione

    //DEBUG
    let points = []
    for(let i = 0; i < 60; i++){
        let x = Math.sin( 2 * Math.PI * i/60 ) * 2;
        let y = Math.cos( 2 * Math.PI * i/60 ) * 2;
        points.push({x: x, y: y});
    }

    for(let i = 0; i < 60; i++){ //AREAS_ARRAY.length
        if(i!=curr_area){
            // poit_A e poit_B sono i centri delle due cards
            let point_A = {x: 0, y: 0}
            let point_B = points[i]
            
            // Trovo il vettore che congiunge i due punti 
            let x = (point_B.x-point_A.x);
            let y = (point_B.y-point_A.y);

            // Normalizzo il precedente vettore così da trovarmi la coordinata dell'arrow sul cerchio unitario
            let norm = 1 / Math.sqrt(x*x + y*y);
            x = x*norm;
            y = y*norm;

            // In relazione alla direzione dell'arrow, calcolo di quanto devo roteare l'immagine della freccia
            var angle = Math.atan2(y, x);   
            var degrees = 180*angle/Math.PI-270;  
            degrees = (360+Math.round(degrees))%360; 
            var strDegrees= degrees+'deg';

            // Proietto la coordinata del cerchio sulla coordinata dell'ellisse:
            x = x * ELIPPSE_X_AXIS_LENGTH 
            y = y * ELLIPSE_Y_AXIS_LENGTH 

            // Traslo l'ellisse così che abba il centro nel centro dello schermo (invece che in alto a sinistra)
            x = x + FRAME_WIDTH/2;
            y = y + FRAME_HEIGHT/2; 
            
            // Faccio dell'interpolazione per provare a smussare un pò l'ellisse negli angoli
            x = interpolate(x, [0, FRAME_WIDTH/4, FRAME_WIDTH*3/4, FRAME_WIDTH], [ELLIPSE_X_AXIS_SQUISH, FRAME_WIDTH/20, FRAME_WIDTH*19/20, FRAME_WIDTH-ELLIPSE_X_AXIS_SQUISH])
            y = interpolate(y, [0, FRAME_HEIGHT/4, FRAME_HEIGHT*3/4, FRAME_HEIGHT], [ELLIPSE_Y_AXIS_SQUISH, FRAME_HEIGHT/8, FRAME_HEIGHT*7/8, FRAME_HEIGHT-ELLIPSE_Y_AXIS_SQUISH])

            const val = i;
            
            // CIRCLE ARROW BUTTONS
            navigation_buttons.push(
                <TouchableWithoutFeedback   
                        key={i} 
                        onPress={() => {  
                            props.onArrowSelection(val); 
                            setCurrArea(val);    
                        }}
                >
                    <View 
                            style={{  
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                borderStyle: 'solid', 
                                borderRadius: 20, 
                                borderWidth: 4, 
                                borderColor: 'white', 
                                backgroundColor: '#4492eb',
                                position: 'absolute',
                                width: ARROW_SIZE, 
                                height: ARROW_SIZE, 
                                left: x-ELLIPSE_TRANSLATE_X, 
                                top: y-ELLIPSE_TRANSLATE_Y, 
                                transform: [{rotate: strDegrees}] 
                            }}
                    >
                        
                        <Image 
                            source={arrow_img} 
                            style={{
                                width: ARROW_SIZE, 
                                height: ARROW_SIZE
                            }}
                        />

                    </View>
                </TouchableWithoutFeedback  >
            )
        }
    }*/