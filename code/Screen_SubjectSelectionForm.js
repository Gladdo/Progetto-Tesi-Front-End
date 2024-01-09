import { View, StyleSheet} from 'react-native'
import Component_ExclusivePickerButtons from './Component_ExclusivePickerButtons';
import { Component_Header1_Bar, Component_Header2_Bar, Component_Status_Bar, Component_Text_Input, Component_Row_Button } from './Common_Components';
import { SCREEN_WIDTH, SCREEN_HEIGHT, bottomSafeArea, colors } from '../configs/configurations';


export default function Screen_SubjectSelectionForm({navigation, route}){

    let poi_name = route.params.selected_data['poi_name'];
    let poi_image = route.params.selected_data['poi_image'];
    let shot_type = route.params.selected_data['shot_type'];

    let action_prompt = ""
    let details = ""
    let age = "young"
    let gender = "man"

    let gender_options = ['man', 'woman']
    let age_options = ['young', 'adult', 'old']

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* FUNCTIONS */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const SetActionPrompt = (text) => {
        action_prompt = text;
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

    const onNextButtonPress = () => {
        navigation.navigate('Screen_ImageGeneration', 
        {
            selected_data : {
                'poi_name' : poi_name,
                'poi_image' : poi_image,
                'shot_type' : shot_type,
                'action_prompt' : action_prompt,
                'details' : details,
                'age' : age,
                'gender' : gender
            } 
        });
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* RENDERING */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    return(
        <View style={{ flex:1, backgroundColor: '#3e69ad' }}>
    
            <Component_Status_Bar/>
            
            <View style={{height: SCREEN_HEIGHT - bottomSafeArea, alignItems: 'center'}}>
                    
                {/* TOP HEADER */}
                <View style={{flex: 0.1, width: SCREEN_WIDTH }}>
                    
                    <Component_Header1_Bar text={"SUBJECT DETAILS"}/>

                </View>

                {/* HEADER */}
                <View style={{flex: 0.05}}>

                    <Component_Header2_Bar text={"Describe what the subject is doing:"}/>                    
                    
                </View>

                {/* ACTION PROMPT TEXT INPUT */}
                <View style={{flex: 0.175, width: SCREEN_WIDTH }}> 

                    <Component_Text_Input onChangeText={(text) => { SetActionPrompt(text) }} />

                </View>

                {/* HEADER */}
                <View style={{flex: 0.05}}>

                    <Component_Header2_Bar text={"Describe what the subject is wearing:"}/>                    

                </View>
                    
                {/* DETAILS TEXT INPUT */}
                <View style={{flex: 0.175, width: SCREEN_WIDTH}}>
                    
                    <Component_Text_Input onChangeText={(text) => { SetDetails(text) }} />
                    
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
