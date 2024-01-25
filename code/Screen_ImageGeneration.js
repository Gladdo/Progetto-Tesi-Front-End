import { View , Image, ActivityIndicator, StyleSheet, Share} from 'react-native'
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

    const onShare = async () => {
        try {
          const result = await Share.share({
            message: generated_image_url + '\n\n' + route.params.selected_data['poi_image_description'],
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert(error.message);
        }
    };

    const setLoraCode = (text) => {
        lora_code = text;
    }

    function generate_url(poi_name, poi_image_name, action_shot_type, action, dynamic_action_selection, action_prompt, other_details, age, gender, selected_lora, 
        is_background_edited, theme_description, weather_description, is_theme_set, is_weather_set, is_night_time){
        return "http://"+ settings['server-address'] + settings['image_generation_url'] + "?" + 
          "poi_name=" + poi_name + 
          "&poi_image_name=" + poi_image_name +
          "&action_shot_type=" + action_shot_type +
          "&action_name=" + action + 
          "&dynamic_action_selection=" + dynamic_action_selection +
          "&action_prompt=" + action_prompt + 
          "&other_details=" + other_details +
          "&age=" + age + 
          "&gender=" + gender +
          "&selected_lora=" + selected_lora +
          "&is_background_edited=" + is_background_edited +
          "&theme_description=" + theme_description +
          "&weather_description=" + weather_description +
          "&is_theme_set=" + is_theme_set +
          "&is_weather_set=" + is_weather_set +
          "&is_night_time=" + is_night_time ;          
    }

    const generate_image = () => {

        let dynamic_action_selection_str;

        if(route.params.selected_data['dynamic_action_selection']){
            dynamic_action_selection_str = "true"
        }else{
            dynamic_action_selection_str = "false"
        }

        let is_theme_set = route.params.selected_data['is_theme_set']
        let is_weather_set = route.params.selected_data['is_weather_set']
        let is_night_time = route.params.selected_data['is_night_time']
        let is_background_edited_str;

        if(is_theme_set || is_weather_set || is_night_time){
            is_background_edited_str = "true"
        }

        let is_theme_set_str = ( is_theme_set ? "true" : "false" )
        let is_weather_set_str = ( is_weather_set ? "true" : "false" )
        let is_night_time_str = ( is_night_time ? "true" : "false" )

        let url = generate_url(
            route.params.selected_data['poi_name'],
            route.params.selected_data['poi_image'],
            route.params.selected_data['shot_type'],
            route.params.selected_data['action'],
            dynamic_action_selection_str,
            route.params.selected_data['action_prompt'],
            route.params.selected_data['details'],
            route.params.selected_data['age'],
            route.params.selected_data['gender'],
            lora_code,
            is_background_edited_str,
            route.params.selected_data['theme_description'],
            route.params.selected_data['weather_description'],
            is_theme_set_str,
            is_weather_set_str,
            is_night_time_str
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

                {/* SHARE BUTTON */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>
                    <Component_Row_Button onPress={() =>{ onShare() }} text={"SHARE"} />
                </View>

                <View style={{flex: 0.1}}>
                </View>

                {/* NAVIGATE HOMESCREEN BUTTON */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>
                    
                    <Component_Row_Button onPress={() =>{ NavigateHomeScreen() }} text={"HOME SCREEN"} />

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
