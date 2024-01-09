import { View , Image, ActivityIndicator, StyleSheet} from 'react-native'
import {useState} from 'react'
import {settings, SCREEN_HEIGHT, SCREEN_WIDTH, bottomSafeArea, colors} from '../configs/configurations'
import { Component_Header1_Bar, Component_Header2_Bar, Component_Row_Button, Component_Status_Bar, Component_Text_Input } from './Common_Components';
import { CommonActions } from '@react-navigation/native';

export default function Screen_ImageGeneration({navigation, route}){
    const [generated_image_loading, setGeneratedImageLoading] = useState(false);
    const [generated_image_ready, setGeneratedImageReady] = useState(false);
    const [generated_image_url, setGeneratedImageUrl] = useState("");

    let lora_code;

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* FUNCTIONS */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const setLoraCode = (text) => {
        lora_code = text;
    }

    function generate_url(poi_name, poi_image_name, action_shot_type, dynamic_action_selection, action_prompt, other_details, age, gender, selected_lora){
        return "http://"+ settings['server-address'] + settings['image_generation_url'] + "?" + 
          "poi_name=" + poi_name + 
          "&poi_image_name=" + poi_image_name +
          "&action_shot_type=" + action_shot_type +
          "&dynamic_action_selection=" + dynamic_action_selection +
          "&action_prompt=" + action_prompt + 
          "&other_details=" + other_details +
          "&age=" + age + 
          "&gender=" + gender +
          "&selected_lora=" + selected_lora;     
    }

    const generate_image = () => {

        let url = generate_url(
            route.params.selected_data['poi_name'],
            route.params.selected_data['poi_image'],
            route.params.selected_data['shot_type'],
            "true",
            route.params.selected_data['action_prompt'],
            route.params.selected_data['details'],
            route.params.selected_data['age'],
            route.params.selected_data['gender'],
            lora_code
        )

        console.log("URL: " + url)
        
        fetch(url)
        .then((response)=> response.json())
        .then( json_data => {

            console.log(json_data)
            setGeneratedImageReady(true);
            setGeneratedImageLoading(false);
            setGeneratedImageUrl( "http://" + settings['server-address'] + json_data.url)

        })

        setGeneratedImageLoading(true);
        console.log("GENERATION STARTING");

    }

    const NavigateHomeScreen = () => {
        navigation.dispatch( CommonActions.reset({ index: 0, routes: [{ name: "Screen_Home" }] }) );
    }
    
    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* RENDERING WHEN THE IMAGE IS GENERATED */
    // ------------------------------------------------------------------------------------------------------------------------- | 
      
    if(generated_image_ready){
        return (

            <View style={ styles.screen_container }>
            
                <Component_Status_Bar/>
            
                {/* TOP HEADER */}
                <View style={{ flex: 0.1 , width: SCREEN_WIDTH}}>

                    <Component_Header1_Bar text={"GENERATION"} />

                </View>
                          
                {/* GENERATED IMAGE FRAME */}            
                <View style={{flex: 0.6 ,width: "100%", alignItems: 'center', justifyContent: 'center'}}>
                    
                    <Image source={{uri: generated_image_url }} style={styles.generated_image_frame}/>
            
                </View>

                {/* NAVIGATE HOMESCREEN BUTTON */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>
                    
                    <Component_Row_Button onPress={() =>{ NavigateHomeScreen() }} text={"HOME SCREEN"} />

                </View>
                <View style={{flex: 0.1}}>
                </View>
            
            </View>

        )
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* RENDERING WHEN THE IMAGE IS LOADING */
    // ------------------------------------------------------------------------------------------------------------------------- |

    if(generated_image_loading){

        return(
            
            <View style={ styles.screen_container }>
            
                <Component_Status_Bar/>
            
                <View style={{height: SCREEN_HEIGHT - bottomSafeArea, alignItems: 'center' }}>
                   
                    {/* TOP HEADER */}
                    <View style={{ flex: 0.1 , width: SCREEN_WIDTH}}>

                        <Component_Header1_Bar text={"GENERATION"} />

                    </View>
                    
                    {/* SEPARATOR */}
                    <View style={{flex: 0.4 }}>
                    </View>

                    {/* ACTIVITY INDICATOR */}
                    <View style={{ flex: 0.2 }}>

                        <ActivityIndicator size="large"/>

                    </View>

                    {/* HEADER */}                    
                    <View style={{flex: 0.2 }}>

                        <Component_Header2_Bar text={"Your image is being baked, wait (4-5 min) ..."} />   
                     
                    </View>
            
                </View>
                    
            </View>

        )

    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                        /* RENDERING WHEN BEFORE STARTING THE GENERATION */
    // ------------------------------------------------------------------------------------------------------------------------- |

    return(

        <View style={ styles.screen_container }>
            
            <Component_Status_Bar/>
            
            <View style={{height: SCREEN_HEIGHT - bottomSafeArea , alignItems: 'center' }}>
                
                {/* TOP HEADER */}
                <View style={{ flex: 0.1 , width: SCREEN_WIDTH}}>

                    <Component_Header1_Bar text={"GENERATION"} />

                </View>
                
                {/* SEPARATOR */}
                <View style={{flex: 0.1}}>
                </View>

                {/* HEADER */}
                <View style={{ flex: 0.1 , width: SCREEN_WIDTH}}>

                    <Component_Header2_Bar text={"If you have a LoRA code insert it here to generate an image with your face!"} />

                </View>

                {/* TEXT-INPUT */}
                <View style={{ flex: 0.1 , width: SCREEN_WIDTH}}>

                    <Component_Text_Input onChangeText={ (text) => { setLoraCode(text)} }/>

                </View>                

                {/* SEPARATOR */}
                <View style={{flex: 0.1}}>                       
                </View>

                {/* GENERATE BUTTON */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>
                    
                    <Component_Row_Button onPress={() =>{ generate_image() }} text={"GENERATE IMAGE"} />

                </View>
                    
            </View>
                    
        </View>
    )
}

// ------------------------------------------------------------------------------------------------------------------------- |
                                                /* STYLESHEET */
// ------------------------------------------------------------------------------------------------------------------------- |

const styles = StyleSheet.create({
    screen_container:
    {
        flex:1, 
        backgroundColor: colors['medium'], 
        alignItems: 'center' 
    },
    generated_image_frame:
    {
        maxWidth: SCREEN_HEIGHT-100,
        width: "100%",
        maxHeight: SCREEN_WIDTH,
        aspectRatio: 1/1
    }
})
