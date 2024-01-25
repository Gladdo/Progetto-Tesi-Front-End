import {useState, useEffect} from 'react'
import { Animated, View, StyleSheet, TouchableOpacity} from 'react-native'
import Component_ExclusivePickerButtons from './Component_ExclusivePickerButtons';
import { Component_Header1_Bar, Component_Header2_Bar, Component_Status_Bar, Component_Text_Input, Component_Row_Button } from './Common_Components';
import { settings, SCREEN_WIDTH, SCREEN_HEIGHT, bottomSafeArea, colors } from '../configs/configurations';
import Component_HorizontalScrollPicker from './Component_HorizontalScrollPicker';

const server_address = settings['server-address']

export default function Screen_SubjectSelectionForm({navigation, route}){
    const [available_actions, setAvailableActions] = useState("");
    const [loaded, setLoaded] = useState(false);

    let action = ""
    let dynamic_action_selection = true;
    let action_prompt = ""

    let action_picker_x_translation = new Animated.Value(SCREEN_WIDTH);
    
    let details = ""
    let age = "young"
    let gender = "man"

    let gender_options = ['man', 'woman']
    let age_options = ['young', 'adult', 'old']

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* SCREEN OUTPUT FUNCTION */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const onNextButtonPress = () => {
        navigation.navigate('Screen_ImageGeneration', 
        {
            selected_data : {
                'poi_name' : route.params.selected_data['poi_name'],
                'poi_image' : route.params.selected_data['poi_image'],
                'shot_type' : route.params.selected_data['shot_type'],
                'poi_image_description' : route.params.selected_data['poi_image_description'],
                'theme_description' : route.params.selected_data['theme_description'],
                'weather_description' : route.params.selected_data['weather_description'],
                'is_theme_set' : route.params.selected_data['is_theme_set'],
                'is_weather_set' : route.params.selected_data['is_weather_set'],
                'is_night_time' : route.params.selected_data['is_night_time'],
                'action_prompt' : action_prompt,
                'details' : details,
                'age' : age,
                'gender' : gender,
                'action' : action,
                'dynamic_action_selection' : dynamic_action_selection
            } 
        });
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* FETCHING ACTIONS DATA */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    useEffect(() => {
        fetch("http://"+ server_address +"/diffusers_api/get_actions")
        .then( (response) =>  response.json())
        .then( 
          json => {
            let available_actions_json = json['actions'];
            let array = []
            for(let i = 0; i < available_actions_json.length; i ++){
                array.push(available_actions_json[i].name);
            }
            action = array[0]
            setAvailableActions(array)
            setLoaded(true);
          }
        )
    }, []);

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* FUNCTIONS */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const OnExplicitActionButtonPress = () => {
        if(dynamic_action_selection){
            dynamic_action_selection = false;
            action_picker_x_translation.setValue(0);
        }else{
            dynamic_action_selection = true;
            action_picker_x_translation.setValue(SCREEN_WIDTH);
        }
        
    }

    const SetActionPrompt = (text) => {
        action_prompt = text;
    }

    const SetAction = (name) => {
        action = name;
    } 

    const SetDetails = (text) => {
        details = text;
    }

    const SetAge = (index) => {
        age=age_options[index];
    }

    const SetGender = (index) => {
        gender=gender_options[index];
    }



    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* RENDERING */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    let action_slider;

    if(loaded){
        action_slider = (<Component_HorizontalScrollPicker onScroll={(text) => SetAction(text) } options={available_actions}></Component_HorizontalScrollPicker>);
    }else{
        action_slider = (<View></View>);
    }

    return(
        <View style={{ flex:1, backgroundColor: colors['medium'] }}>
    
            <Component_Status_Bar/>
            
            <View style={{height: SCREEN_HEIGHT - bottomSafeArea, alignItems: 'center'}}>
                    
                {/* TOP HEADER */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH }}>
                    
                    <Component_Header1_Bar text={"SUBJECT DETAILS"}/>

                </View>

                {/* ACTION HEADER */}
                <View style={{flex: 0.05, flexDirection:'row', width: SCREEN_WIDTH}}>
                    
                    <View style={{flex: 0.9}}>
                        
                        <Component_Header2_Bar text={"Describe what the subject is doing:"}/> 

                        <Animated.View style={{ backgroundColor: colors['medium'], width: "100%", height: "100%", position: 'absolute', transform: [{translateX: action_picker_x_translation}]}}>
                    
                            <Component_Header2_Bar text={"Pick an action explicitly: "}/>       
                        
                        </Animated.View>
                    
                    </View>

                    <View style={{flex: 0.1}}>
                        
                        <TouchableOpacity onPress={() => { OnExplicitActionButtonPress() }}style={{ position: 'absolute' , right: 0, top: 0, height: '100%', minWidth: 40, backgroundColor: 'red'}}>

                        </TouchableOpacity>

                    </View>
                     
                </View>

                {/* ACTION SELECTION */}
                <View style={{flex: 0.175, width: SCREEN_WIDTH }}> 

                    <Component_Text_Input placeholder={" Write here something like: \n 'Taking a walk around' or 'Pondering about life' \n Or pick an action manually with M button "} onChangeText={(text) => { SetActionPrompt(text) }} />
                    
                    <Animated.View style={{backgroundColor: colors['light'], width: "100%", height: "100%", position: 'absolute', transform: [{translateX: action_picker_x_translation}]}}>

                        {action_slider}
                    
                    </Animated.View>
                    

                </View>

                {/* HEADER */}
                <View style={{flex: 0.05}}>

                    <Component_Header2_Bar text={"Describe what the subject is wearing:"}/>                    

                </View>
                    
                {/* DETAILS TEXT INPUT */}
                <View style={{flex: 0.175, width: SCREEN_WIDTH}}>
                    
                    <Component_Text_Input placeholder={" Write here something like: \n 'Medieval clothes' or 'Futuristic clothes' "} onChangeText={(text) => { SetDetails(text) }} />
                    
                </View>
                
                {/* HEADER */}
                <View style={{flex: 0.05}}>

                    <Component_Header2_Bar text={"Pick Generalities:"}/>                    

                </View>
            
                {/* GENERALITIES CONTAINER */}
                <View style={[ styles.generalities_pickers_container, {flex: 0.3, width: SCREEN_WIDTH }]}>
                    
                    <View  style={{flex: 0.1}}></View>     
                    
                    <View style={{flex: 0.35}}>
                    
                        <Component_ExclusivePickerButtons width={SCREEN_WIDTH} onButtonPress={(index) => { SetAge(index)} } options={['YOUNG','ADULT','OLD']}/>
                    
                    </View>
                    
                    <View style={{flex:0.05}}></View>
                    
                    <View style={{flex: 0.4}}>

                        <Component_ExclusivePickerButtons width={SCREEN_WIDTH} onButtonPress={(index) => { SetGender(index)} } options={['MALE','FEMALE']}/>
                    
                    </View>       
                    
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
    generalities_pickers_container:
    {
        backgroundColor: colors['light'], 
        borderColor: colors['dark'], 
        borderTopWidth: 5, 
        borderBottomWidth: 1,
    }
})
