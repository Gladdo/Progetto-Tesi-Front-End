import {View, Text} from 'react-native'
import { Component_Header1_Bar, Component_Row_Button, Component_Status_Bar } from './Common_Components';
import { colors, SCREEN_WIDTH, SCREEN_HEIGHT, FLORENCE_AREA_CARDS, ROME_AREA_CARDS, bottomSafeArea } from '../configs/configurations'
import Component_HorizontalScrollPicker from './Component_HorizontalScrollPicker';

export default function Screen_CitySelection ({navigation}) {

    let cities = Object.keys(global.CITIES_CARDS);
    let selected_city = cities[0]

    const SetCity = (text) => {
        selected_city = text
        
    }

    const onNextButtonPress = () => {
        navigation.navigate('Screen_PoiSelectionForm', { selected_city_name: selected_city, });
    }

    return (
        <View style={{backgroundColor: colors['medium']}}>

            <Component_Status_Bar/>

            <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT - bottomSafeArea}}>
                
                <View style={{flex: 0.1}}>

                    <Component_Header1_Bar text={"Where you want to go?"}/>
                </View>

                <View style={{flex: 0.8, flexDirection: 'column', justifyContent: 'space-evenly'}}>

                    <View style={{ flex: 0.4 }}>
                        
                        <Component_HorizontalScrollPicker onScroll={(text) => SetCity(text) } options={cities}></Component_HorizontalScrollPicker>

                    </View>

                </View>

                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>

                    <Component_Row_Button text={"NEXT"} onPress={onNextButtonPress}/>

                </View>

            </View>
        
        </View>

    )

}