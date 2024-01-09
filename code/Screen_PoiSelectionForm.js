import { View, Text} from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT} from '../configs/configurations';
import Component_Map from './Component_Map'

export default function Screen_PoiSelectionForm({navigation, route}){    
    return(
            
        <View style={{flex: 1}}>

            <Component_Map  
                selected_city_index={route.params.selected_city_index}
                width={SCREEN_WIDTH} 
                height={SCREEN_HEIGHT} 
                
                onPoiSelection={(poi_name) => { 
                    navigation.navigate('Screen_ShotSelectionForm', 
                    { 
                        selected_data : {
                            'poi_name' : poi_name,
                        } 
                    });
                }}

            />
        
            <View style={{ width: SCREEN_WIDTH, height: 150, position: 'absolute', alignContent: 'center', justifyContent: 'center'}}>
                
                <Text style={{textAlign: 'center', color: 'white', fontSize: 32, fontWeight: 'bold'}}> Pick a point of Interest </Text>
            
            </View> 

        </View>
    )
    
}
