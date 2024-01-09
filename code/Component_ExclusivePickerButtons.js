
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState} from 'react'
import { SCREEN_WIDTH, colors, text_size } from "../configs/configurations";

let dark_color = colors['dark']
let light_color = colors['text_color']

export default function Component_ExclusivePickerButtons(props){
    const [selectedButton, setSelectedButton] = useState(0);

    let options = props.options;
    let element_width = props.width/options.length;
    
    const onButtonPress = (btn_index) => {
        props.onButtonPress(btn_index);
        setSelectedButton(btn_index);
    }

    let render = [];
    for(var i = 0; i < options.length; i++ ){
        
        let txt_color = light_color;
        let back_color = dark_color;

        // Se il bottone è associato all'opzione selezionata, inverti i colori:
        if(i==selectedButton){
            txt_color = dark_color;
            back_color = light_color;
        }
            
        const btn_index = i;

        render.push(
            
            // OPTION BUTTON 
            <TouchableOpacity onPress={() => {onButtonPress(btn_index)}} key={btn_index} style={[styles.button_container, {width: element_width}]}>
                
                <View style={[ styles.button_frame, { backgroundColor: back_color }]}>
                    
                    <Text style={[ styles.button_text, { color: txt_color}]}> {options[i]} </Text>
                
                </View>

            </TouchableOpacity>

        )
    }

    return(

        <View style={styles.buttons_container} >

            {render}    

        </View>
    )
}

const styles = StyleSheet.create({
    buttons_container:
    {
        flex: 1, 
        flexDirection: 'row',
        backgroundColor: colors['dark']
    },
    button_container:
    {
        height:'100%',
        alignItems:'center',
        justifyContent: 'center'
    },
    button_frame:
    {
        width: '86%',
        height:'84%', 
        justifyContent: 'center' ,
        marginBottom: '8%',
        marginTop: '8%',
    },
    button_text:
    {
        fontWeight: 'bold', 
        textAlign: 'center', 
        fontSize: text_size['medium']
    }

})


