import {View, ScrollView} from 'react-native'
import { Component_Header1_Bar, Component_Header2_Bar, Component_Row_Button, Component_Status_Bar } from './Common_Components';
import { colors, SCREEN_WIDTH, SCREEN_HEIGHT, bottomSafeArea } from '../configs/configurations'

export default function Screen_LoraTutorial ({navigation}) {

    return (
        <View style={{backgroundColor: colors['medium']}}>

            <Component_Status_Bar/>

            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT-bottomSafeArea}}>
                
                <View style={{flex: 0.1}}>

                    <Component_Header1_Bar text={"TUTORIAL:"}/>

                </View>

                <View style={{flex: 0.8, alignItems: 'center'}}>

                    <ScrollView contentContainerStyle={{width: '94%'}}>
                    
                        <Component_Header2_Bar text={" In the next page you need to take 5 pictures of your face; this will allow the application to reproduce it in generated images."}/>

                        <Component_Header2_Bar text={" "}/>

                        <Component_Header2_Bar text={" Each picture must be taken with a specified angle represented by the head buttons shown on the bottom (3 straight selfies and 2 photos at 3/4 angle, with different directions ); select a button then tap on the central frame to take the respective picture. "}/>

                        <Component_Header2_Bar text={" "}/>

                        <Component_Header2_Bar text={" Once a picture has been shot, the relative head will turn green; if you're not satisfied with the picture, press the specified head button, tap the central frame and capture it again. "}/>

                        <Component_Header2_Bar text={" When all head buttons turn green, press the CONFIRM button to send the picture to training!"}/>

                        <Component_Header2_Bar text={" "}/>

                        <Component_Header2_Bar text={" For the best results stick to the following rules: "}/>

                        <Component_Header2_Bar text={" "}/>

                        <Component_Header2_Bar text={" 1) take each picture with a different background "}/>

                        <Component_Header2_Bar text={" 2) take each picture by framing your face differently in the photo: try different distances from the camera and don't always center your face precisely in the middle of the picture "}/>

                        <Component_Header2_Bar text={" 3) take each picture with the best resolution possible "}/>

                        <Component_Header2_Bar text={" 4) take each picture with different lighting conditions "}/>
                        


                    </ScrollView>

                </View>

                <View style={{ flex: 0.1 }}>

                    <Component_Row_Button text={"START"} onPress={ () => { navigation.navigate('Screen_LoraForm') }}/>

                </View>

            </View>
        
        </View>

    )

}