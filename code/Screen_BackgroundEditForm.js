import { Animated, View, StyleSheet, TouchableOpacity, Image} from 'react-native'
import Component_ExclusivePickerButtons from './Component_ExclusivePickerButtons';
import { Component_Header1_Bar, Component_Header2_Bar, Component_Status_Bar, Component_Text_Input, Component_Row_Button } from './Common_Components';
import {  SCREEN_WIDTH, SCREEN_HEIGHT, bottomSafeArea, colors } from '../configs/configurations';


export default function Screen_SubjectSelectionForm({navigation, route}){

    let theme_description = ""
    let weather_description = ""
    let is_theme_set = false
    let is_weather_set = false
    let is_night_time = false

    let theme_ui_opacity = new Animated.Value(0.35)
    let weather_ui_opacity = new Animated.Value(0.35)
    let theme_on_button_opacity = new Animated.Value(0)
    let weather_on_button_opacity = new Animated.Value(0)
    let theme_off_button_opacity = new Animated.Value(1)
    let weather_off_button_opacity = new Animated.Value(1)
    
    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* SCREEN OUTPUT FUNCTION */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const onNextButtonPress = () => {
        navigation.navigate('Screen_SubjectSelectionForm', 
        {
            selected_data : {
                'poi_name' : route.params.selected_data['poi_name'],
                'poi_image' : route.params.selected_data['poi_image'],
                'shot_type' : route.params.selected_data['shot_type'],
                'poi_image_description' : route.params.selected_data['poi_image_description'],
                'theme_description' : theme_description,
                'weather_description' : weather_description,
                'is_theme_set' : is_theme_set,
                'is_weather_set' : is_weather_set,
                'is_night_time' : is_night_time
            } 
        });

    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* FUNCTIONS */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const SetThemeDescription = (text) => {
        theme_description = text;
    }

    const SetWeatherDescription = (text) => {
        weather_description = text;
    }

    const SetIsNightTIme = (index) => {
        if(index == 0)
            is_night_time=false
        else if(index == 1)
            is_night_time=true
    }

    const SwapIsThemeSet = () => {
        if(is_theme_set){
            is_theme_set=false
            theme_ui_opacity.setValue(0.35)
            theme_on_button_opacity.setValue(0);
            theme_off_button_opacity.setValue(1);
        }
        else{
            is_theme_set=true
            theme_ui_opacity.setValue(1)
            theme_on_button_opacity.setValue(1);
            theme_off_button_opacity.setValue(0);
        }
            
    }

    const SwapIsWeatherSet = () => {
        if(is_weather_set){
            is_weather_set=false
            weather_ui_opacity.setValue(0.35);
            weather_on_button_opacity.setValue(0);
            weather_off_button_opacity.setValue(1);
        }
        else{
            is_weather_set=true
            weather_ui_opacity.setValue(1);
            weather_on_button_opacity.setValue(1);
            weather_off_button_opacity.setValue(0);
        }
            
    }


    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* RENDERING */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    return (
        <View style={{ flex:1, backgroundColor: colors['medium'] }}>
    
            <Component_Status_Bar/>
            
            <View style={{height: SCREEN_HEIGHT - bottomSafeArea, alignItems: 'center'}}>
                    
                {/* TOP HEADER */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH }}>
                    
                    <Component_Header1_Bar text={"EDIT BACKGROUND"}/>

                </View>

                {/* THEME HEADER */}
                <Animated.View style={{flex: 0.05, opacity: theme_ui_opacity}}>
                    
                    <Component_Header2_Bar text={"Specify a theme for the image: "}/> 
  
                </Animated.View>

                {/* THEME TEXT INPUT */}
                <Animated.View style={{flex: 0.175, width: SCREEN_WIDTH, opacity: theme_ui_opacity }}> 

                    <Component_Text_Input placeholder={" Write here something like: \n 'futuristic environment' or 'post apocalyptic environment, ruins environment'"} 
                    onChangeText={(text) => { SetThemeDescription(text) }} />                   

                </Animated.View>

                {/* WEATHER HEADER */}
                <Animated.View style={{flex: 0.05, opacity: weather_ui_opacity}}>

                    <Component_Header2_Bar text={"Specify the weather for the image:"}/>                    

                </Animated.View>
                    
                {/* WEATHER TEXT INPUT */}
                <Animated.View style={{flex: 0.175, width: SCREEN_WIDTH, opacity: weather_ui_opacity}}>
                    
                    <Component_Text_Input placeholder={" Write here something like: \n 'rainy day, storm' or 'snow storm, blizzard' "} 
                    onChangeText={(text) => { SetWeatherDescription(text) }} />
                    
                </Animated.View>

                {/* THEME AND WEATHER BUTTONS */}                
                <View style={{flex: 0.20, flexDirection: 'row'}}>
                    
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.5}}>
                        
                        <Component_Header2_Bar text={"Theme ON/OFF"}/>
                        
                        <TouchableOpacity onPress={() => { SwapIsThemeSet() } } style={{ width: "62%", height: "50%"}}>

                            <Animated.View style={{     opacity: theme_off_button_opacity, justifyContent: "center", alignItems: "center",
                                                        position: 'absolute', width: "100%", height: "100%"}}>

                                <Image style={{ width: "100%", height: "100%"}} source={require('../resources/icons/switch_button_off.png')} />

                            </Animated.View>

                            <Animated.View style={{     opacity: theme_on_button_opacity, justifyContent: "center", alignItems: "center",
                                                        position: 'absolute', width: "100%", height: "100%"}}>

                                <Image style={{ width: "100%", height: "100%"}} source={require('../resources/icons/switch_button_on.png')} />

                            </Animated.View>

                        </TouchableOpacity>

                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.5}}>

                        <Component_Header2_Bar text={"Weather ON/OFF"}/>

                        <TouchableOpacity onPress={() => { SwapIsWeatherSet() } } style={{ width: "62%", height: "50%"}}>

                            <Animated.View style={{     opacity: weather_off_button_opacity, justifyContent: "center", alignItems: "center",
                                                        position: 'absolute', width: "100%", height: "100%"}}>
                                <Image style={{  width: "100%", height: "100%"}} source={require('../resources/icons/switch_button_off.png')} />
                            </Animated.View>

                            <Animated.View style={{     opacity: weather_on_button_opacity, justifyContent: "center", alignItems: "center",
                                                        position: 'absolute', width: "100%", height: "100%"}}>
                                <Image style={{  width: "100%", height: "100%"}} source={require('../resources/icons/switch_button_on.png')} />
                            </Animated.View>

                        </TouchableOpacity>

                    </View>

                </View>

                {/* NIGHT TIME HEADER */}
                <View style={{flex: 0.05}}>

                    <Component_Header2_Bar text={"Do you want the image to be at night time?"}/>                    

                </View>
            
                {/* NIGHT TIME SELECTION*/}
                <View style={[ styles.picker_container, {flex: 0.1, width: SCREEN_WIDTH }]}>        

                        <Component_ExclusivePickerButtons width={SCREEN_WIDTH} onButtonPress={(index) => { SetIsNightTIme(index)} } options={['NO','YES']}/>
                    
                </View>

                <View style={{flex: 0.05}}>
                </View>
                
                {/* NEXT BUTTON */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>

                    <Component_Row_Button text={"NEXT"} onPress={onNextButtonPress}/>

                </View>
                
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    picker_container:
    {
        backgroundColor: colors['light'], 
        borderColor: colors['dark'], 
        borderTopWidth: 5, 
        borderBottomWidth: 1,
    }
})