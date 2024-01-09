import {View, Animated, ScrollView, Text, TouchableOpacity } from 'react-native'
import React, {useState, useRef} from 'react';

/* --------------------------------------------------------------------------------------------------------------------------------------------------- |
> GLAD PICKER:
La proprietà data del component deve contenere oggetti con la seguente struttura:
[{"name": "item1"}, {"name": "item2"}, ..., {"name": "itemN"}]
------------------------------------------------------------------------------------------------------------------------------------------------------ */

export default function GladPicker(props){
    // -------------------------|
    // FUNCTION STATE VARIABLES
    // -------------------------|
    const [selectedItem, SetSelectedItem] = useState(props.placeholder);
    const [menuVisible, SetMenuVisibility] = useState(false);

    // -------------------------|
    // ANIMATION VARIABLES
    // -------------------------|
    var heightAnim = useRef(new Animated.Value(0)).current;
    var textHeightAnim = useRef(new Animated.Value(0)).current;

    // -------------------------|
    // UTILITY VARIABLES
    // -------------------------|
    var data = props.data;
    const COMPONENT_WIDTH= props.width;
    const POPUP_MAXHEIGHT= props.menuMaxHeight;

    // -------------------------|
    // EVENT FUNCTIONS
    // -------------------------|

    /* menuPop viene chiamata ogni volta che viene triggerato onPress sulla barra di selezione statica
    La funzione funge come sorta di switch per far comparire e scomparire il menu a comparsa:
        > Se il menu è disabilitato (menuVisible = false), allora si imposta l'height opportuna e si mette menuVisible = true
        > Se il menu è abilitato (menuVisible = true), allora si imposta l'height a 0 e si mette menuVisible = false */
    const menuPop = () => {
        var nextHeight;
        var nextTextHeight;
        if(menuVisible){
            nextHeight=0;
            nextTextHeight=0;
            SetMenuVisibility(false);
        }else{
            nextHeight=POPUP_MAXHEIGHT;
            nextTextHeight=40;
            SetMenuVisibility(true);
        }

        // Funzione di animazione che interpola i valori di heightAnim nel tempo
        Animated.timing(heightAnim, {
            toValue: nextHeight,
            duration: 200,
            useNativeDriver: true,
        }).start();

        // Funzione di animazione che interpola i valori di textHeightAnim nel tempo
        Animated.timing(textHeightAnim, {
        toValue: nextTextHeight,
        duration: 200,
        useNativeDriver: true,
        }).start();
    };

    /* Funzione triggerata all'onPress di un'elemento della lista nel menu a comparsa
    Ogni elemento del menu imposta il proprio valore come argomento alla chiamata itemIndex */
    const onSelection = (itemIndex) => {
        SetSelectedItem(data[itemIndex].name);
        props.onSelection(data[itemIndex].name);
        SetMenuVisibility(false);

        // Funzione di animazione che interpola i valori di heightAnim nel tempo
        Animated.timing(heightAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();

        // Funzione di animazione che interpola i valori di textHeightAnim nel tempo
        Animated.timing(textHeightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        }).start();
        
    }

    // -------------------------|
    // PRE-RENDERING
    // -------------------------|

    // Costruisco la lista di entries del menu a comparsa
    var menuItems = [];
    if(menuVisible){
        for(var i = 0; i < data.length; i ++){
            /* Devo utilizzare un valore const da bindare alla chiamata di onSelection di ciascun elemento; se passo un valore variabile viene passato un riferimento
            ad una stessa variabile PER CIASCUN elemento della lista */
            const itemIndex = i;
            menuItems.push(
                <TouchableOpacity key={i} onPress={() => {onSelection(itemIndex)}}>
                    <Animated.View style={{height: textHeightAnim, justifyContent: 'center', borderBottomWidth: 1}}>
                        <Animated.Text style={{height: textHeightAnim*0.5, textAlign:'center', fontWeight: 'bold', fontSize: 14}} > {data[i].name} </Animated.Text>
                    </Animated.View>
                </TouchableOpacity>
            )
        }
    }

    // -------------------------|
    // RENDERING
    // -------------------------|
    return(

        <View style={{ height: 40, maxWidth: props.maxWidth, width: COMPONENT_WIDTH, }} >

            {/* ------------------------------------------------------|
               BARRA DI SELEZIONE STATICA 
            |------------------------------------------------------ */}
            <TouchableOpacity style={{height:40, backgroundColor: "#258ef7"}} onPress={menuPop}>

                <View style={{height: '100%', justifyContent: 'center'}}>

                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 18}}> {selectedItem} </Text>

                </View> 

            </TouchableOpacity>

            {/* ------------------------------------------------------|
               MENU A COMPARSA
            |------------------------------------------------------ */}
            <Animated.View style={{ marginTop: 40, position: 'absolute', width: '100%', maxHeight: heightAnim, backgroundColor: "#dcecfc", overflow: 'visible'}}>

                <ScrollView decelerationRate={'normal'} >

                    {menuItems}

                </ScrollView>

            </Animated.View>   
            
       </View>

    )
}
