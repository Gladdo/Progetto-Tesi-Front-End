import {View, Text} from 'react-native'
import { Component_Header1_Bar, Component_Row_Button, Component_Status_Bar } from './Common_Components';
import { colors, SCREEN_WIDTH, SCREEN_HEIGHT, FLORENCE_AREA_CARDS, ROME_AREA_CARDS } from '../configs/configurations'

export default function Screen_CitySelection ({navigation}) {

    const LoadFlorence = () => {
        navigation.navigate('Screen_PoiSelectionForm', { selected_city_index: 0, });
    }

    const LoadRome = () => {
        navigation.navigate('Screen_PoiSelectionForm', { selected_city_index: 1, });
    }

    return (
        <View style={{backgroundColor: colors['medium']}}>

            <Component_Status_Bar/>

            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
                
                <View style={{flex: 0.1}}>

                    <Component_Header1_Bar text={"Where you want to go?"}/>
                </View>

                <View style={{flex: 0.9, flexDirection: 'column', justifyContent: 'space-evenly'}}>

                    <View style={{ height: 100}}>

                        <Component_Row_Button text={"FLORENCE"} onPress={ () => { LoadFlorence() }}/>

                    </View>

                    <View style={{ height: 100}}>

                        <Component_Row_Button text={"ROME"} onPress={ () => { LoadRome() }}/>

                    </View>

                </View>

            </View>
        
        </View>

    )

}