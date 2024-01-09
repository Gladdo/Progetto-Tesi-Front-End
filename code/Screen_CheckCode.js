import {View, Text} from 'react-native'
import { useState, useRef } from 'react'
import { server_queries, settings, bottomSafeArea, SCREEN_WIDTH, SCREEN_HEIGHT, colors, text_size } from '../configs/configurations';
import { Component_Header1_Bar, Component_Header2_Bar, Component_Row_Button, Component_Status_Bar, Component_Text_Input } from './Common_Components';


export default function Screen_CheckCode (){
    const [result, setResult] = useState("")
    let code = useRef("");

    const CheckCode = () => {
        fetch("http://" + settings['server-address'] + server_queries['check_lora_code'] + code.current )
        .then( (response) => response.json() )
        .then( json => {
            setResult(json['result']);
        })
    }

    return(
        <View style={{backgroundColor: colors['medium']}}>

            <Component_Status_Bar />

            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - bottomSafeArea }}>

                {/* TOP HEADER */}
                <View style={{flex: 0.1}}>

                    <Component_Header1_Bar text={"LORA CODE CHECK"}/>

                </View>

                {/* SEPARTOR */}
                <View style={{flex:0.1}}>
                </View>

                {/* HEADER */}
                <View style={{flex: 0.2}}>
                    
                    <Component_Header2_Bar text={"Insert your lora code and press Check to see if it is ready:"} />

                </View>
                
                {/* TEXT INPUT */}
                <View style={{flex: 0.1, widht: SCREEN_WIDTH}}>
                    
                    <Component_Text_Input onChangeText={(text)=>{ code.current=text }} />

                </View>

                {/* SEPARTOR */}
                <View style={{flex: 0.05}}> 
                </View>

                {/* HEADER */}
                <View style={{flex: 0.15}}>

                    <Text style={{color: colors['dark'], fontWeight: 'bold', fontSize: text_size['big'], textAlign: 'center'}}> {result} </Text>

                </View>

                {/* CHECK BUTTON */}
                <View style={{flex: 0.15}}>

                    <Component_Row_Button text={"CHECK"} onPress={() => {CheckCode()}} />

                </View>

            </View>
        
        </View>

    )
    
}
