import Component_Map_Arrows_Manager from "./Component_Map_Arrows_Manager";
import Component_Map_Markers_Manager from "./Component_Map_Markers_Manager";
import {Image, View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

let ui_opacity_value = new Animated.Value(0);
let image_popup_size = new Animated.Value(0);
let image_popup_opacity = new Animated.Value(0);

let card_side_margin;

let FRAME_HEIGHT;
let FRAME_WIDTH; 

export default function Component_Map_Ui_Manager(props){
    const [curr_area, setCurrArea] = useState(props.init_area);
    const [selected_marker, setSelectedMarker] = useState();
    const [is_marker_selected, setIsMarkerSelected] = useState(false);

    card_side_margin = props.card_side_margin
    let AREA_CARDS = props.AREA_CARDS;

    FRAME_HEIGHT = props.height;
    FRAME_WIDTH = props.width;

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* UI INTERACTIONS EVENTS */
    // ------------------------------------------------------------------------------------------------------------------------- | 
 
    let onArrowSelection = (area) => {
        props.uiEventCallBack( { 'title' : "ARROW_SELECTION", selected_area: area });
        setCurrArea(area);
    }

    let onMarkerSelection = (marker) => {
        setSelectedMarker(marker);
        setIsMarkerSelected(true);
    }

    let onPopupImageSelection = () => {
        props.uiEventCallBack( { 'title' : "POI_SELECTION", selected_poi_name: selected_marker.value });
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                  /* RENDERING SE NON E' STATO SELEZIONATO NESSUN MARKER */
    // ------------------------------------------------------------------------------------------------------------------------- | 
    
    if(!is_marker_selected){

        // UI Opacity Animation
        
        ui_opacity_value.setValue(0)
        Animated.timing(ui_opacity_value, {
            toValue: 1.0,
            delay: 1000,
            duration: 500,
            useNativeDriver: false
        }).start();

        // Rendering
        
        return(

            <View>

                <Animated.View style={{opacity: ui_opacity_value}}>
                    
                    <Component_Map_Arrows_Manager  width={FRAME_WIDTH} height={FRAME_HEIGHT} onArrowSelection={onArrowSelection} AREA_CARDS={AREA_CARDS} curr_area={curr_area}/>
                    <Component_Map_Markers_Manager width={FRAME_WIDTH} height={FRAME_HEIGHT} onMarkerSelection={onMarkerSelection} magnified_markers={false} markers={AREA_CARDS[curr_area].markers}/>
                    
                </Animated.View>

            </View>

        )
    
    }
    
    // ------------------------------------------------------------------------------------------------------------------------- |
                                            /* RENDERING QUANDO SELEZIONO UN MARKER */
    // ------------------------------------------------------------------------------------------------------------------------- | 
    
    else{

        // Image popup animation

        image_popup_opacity.setValue(0);
        image_popup_size.setValue(0.8);
        Animated.timing(image_popup_opacity,{
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start();
        Animated.timing(image_popup_size,{
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start();

        // Rendering

        return(

            <View>

                {/* -----------------------------------------------------------------------------------------------------------------| */}
                                                        {/* HIDDEN TOUCHABLE BACKGROUND */}
                {/* Questo TouchableOpacity è steso su tutto il background all'infuori dell'immagine di popup e serve per eventualmente
                    deselezionare il marker selezionato */}

                <TouchableOpacity onPress={()=>{ setIsMarkerSelected(false)}}>

                    <View style={{ position: 'absolute', elevation: 200 , height: SCREEN_HEIGHT,width: FRAME_WIDTH, flex: 1}}>

                    </View>

                </TouchableOpacity>   

                {/* -----------------------------------------------------------------------------------------------------------------| */}
                                                        {/* SELECTED MARKER RENDERING */}
                
                <Component_Map_Markers_Manager width={FRAME_WIDTH} height={FRAME_HEIGHT} onMarkerSelection={onMarkerSelection} magnified_markers={true} markers={[selected_marker]}/>    
                
                {/* -----------------------------------------------------------------------------------------------------------------| */}
                                                            {/* POI IMAGE POPUP */}

                {/* Animated.View: Container dell'immagine di popup */}
                <Animated.View  
                        style={[ 
                            
                            styles.popup_image_container, 
                            
                            {  
                                /* LEFT: Per spostare il popup image fuori dal frame della card e fare in modo che combaci con lo screen del display: 

                                    > card_side_margin: è la percentuale di SCREEN_WIDTH che fa da margine alla card; con il seguente calcolo si trova 
                                    i pixel associati al margine applicato alla card per poi spostare la popup image in modo che combaci col bordo del display
                                    
                                */
                                left:-SCREEN_WIDTH/100*card_side_margin , 
                                
                                /* TOP: Per impostare il popup all'altezza del marker a cui è associato combino i seguenti termini:
                                        
                                        > FRAME_HEIGHT/2: offset per impostare l'altezza a partire dal centro
                                        
                                        > (selected_marker.position.y/500)*FRAME_HEIGHT/2: mappa la posizione del marker nell'immagine originale ai pixel del frame attuale

                                        > -140: fattore correttivo che sposta il frame verso l'alto
                                
                                */
                                top: FRAME_HEIGHT/2 + (selected_marker.position.y/1000) * FRAME_HEIGHT - 140,       
                            }
                        ]}
                >
                    
                    {/* TouchableOpacity: Bottone che rende l'immagine di popup cliccabile */}
                    <TouchableOpacity style={ styles.popup_image_frame } onPress={() => {onPopupImageSelection()}}>
            
                        <Image style={{width: '100%', height: '100%' }} source={{ uri: selected_marker.popup_image }}/>     
                        
                        {/* View: Overlay sull'immagine che contiene una scritta */}
                        <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>

                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white'}}> Tap here to select </Text>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white'}}> {selected_marker.value } </Text>

                        </View>  

                    </TouchableOpacity>

                    

                </Animated.View> 

            </View>
        )
    }
    
}

// ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* STYLESHEET */
// ------------------------------------------------------------------------------------------------------------------------- | 


const styles = StyleSheet.create({

    popup_image_container:
    {
        zIndex: 10,
        elevation: 80, 
        height:200,  
        width:SCREEN_WIDTH, 
        opacity: image_popup_opacity, transform: [{scaleX: image_popup_size},{scaleY: image_popup_size}],

    },

    popup_image_frame:
    {
        borderColor: 'white',
        borderLeftWidth: 0, 
        borderRightWidth: 0, 
        borderTopWidth: 4, 
        borderBottomWidth: 4, 
        elevation: 250
    },

})