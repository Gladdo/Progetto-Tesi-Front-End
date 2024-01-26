import {View, Text} from 'react-native'
import { Component_Row_Button, Component_Status_Bar } from './Common_Components';
import { settings, server_queries, colors, SCREEN_WIDTH, SCREEN_HEIGHT } from '../configs/configurations'
import { useEffect } from 'react';

const server_address = settings['server-address']

export default function Screen_Home ({navigation}) {

    useEffect(() => {
        if(global.are_cities_loaded==false){
            fetch("http://"+ server_address + server_queries['get_maps_data'] )
            .then( (response) =>  response.json())
            .then( json => { 

                global.are_cities_loaded=true;
                global.CITIES_CARDS = json

                console.log(json)
          }
        )
        }
        
        
    }, []);
    

    return (
        <View style={{backgroundColor: colors['medium']}}>

            <Component_Status_Bar/>

            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
                
                <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>

                    <Text style={{color: colors['text_color'], fontWeight: 'bold', fontSize: 50, textAlign: 'center'}}> Title placeholder </Text>

                </View>

                <View style={{flex: 0.7, flexDirection: 'column', justifyContent: 'space-evenly'}}>

                    <View style={{ height: 100}}>

                        <Component_Row_Button text={"GENERATE IMAGES"} onPress={ () => { navigation.navigate('ImageGenerationStackContainer'); }}/>

                    </View>

                    <View style={{ height: 100}}>

                        <Component_Row_Button text={"LORA TRAINING"} onPress={ () => { navigation.navigate('LoraTrainingStackContainer'); }}/>

                    </View>

                    <View style={{ height: 100}}>

                        <Component_Row_Button text={"CHECK LORA CODE"} onPress={ () => { navigation.navigate('Screen_CheckCode'); }}/>

                    </View>


                </View>

            </View>
        
        </View>

    )

}
