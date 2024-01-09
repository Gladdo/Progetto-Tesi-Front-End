import { View , Text} from 'react-native'
import { CommonActions } from '@react-navigation/native';
import { Component_Header1_Bar, Component_Header2_Bar, Component_Row_Button, Component_Status_Bar } from './Common_Components';
import { bottomSafeArea, SCREEN_WIDTH, SCREEN_HEIGHT, text_size, colors} from '../configs/configurations';

export default function Screen_CreatedCode({navigation, route}){

    const onBackButtonPress = () => {
        navigation.dispatch( CommonActions.reset({ index: 0, routes: [{ name: "Screen_Home" }] }) );
    }

    return(
        <View style={{flex: 1, backgroundColor: "#3e69ad"}}>
            
            <Component_Status_Bar />

            <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT - bottomSafeArea}}>

                <View style={{flex: 0.1 }}>

                    <Component_Header1_Bar text={"Your Lora Code"} />

                </View>
                
                <View style={{flex: 0.1, width: SCREEN_WIDTH, justifyContent: 'center' }}>

                    <Component_Header2_Bar text={"your lora code is:"} />

                </View>

                <View>
                    <Text style={{fontWeight: 'bold', textAlign: 'center', color: colors['darkest'], fontSize: text_size['big']}}> {route.params.data} </Text>
                </View>

                <View style={{flex:0.1}}>
                </View>

                <View style={{flex: 0.4 }}>

                    <Component_Header1_Bar text={"When your LoRA is ready (check in the homepage), use your code when generating images to create pictures of yourself!"}/>
                
                </View>

                <View style={{flex: 0.1}}>
                </View>

                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>

                    <Component_Row_Button text={"BACK TO HOME"} onPress={ onBackButtonPress }/>

                </View>

            </View>

        </View>
    )
}
