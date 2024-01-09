import { useState, useEffect } from 'react'
import { View, Image, StyleSheet} from 'react-native'
import { settings, server_queries, SCREEN_WIDTH, SCREEN_HEIGHT, bottomSafeArea, colors } from '../configs/configurations';

import Component_CameraDistancePicker from './Component_CameraDistancePicker';
import { Component_Status_Bar, Component_Header1_Bar, Component_Header2_Bar, Component_Row_Button } from './Common_Components';

import Carousel from 'react-native-reanimated-carousel';

const server_address = settings['server-address']
let image_data = []

export default function Screen_ShotSelectionForm({navigation, route}){
    const [loaded, setLoaded] = useState(false);

    let poi_name = route.params.selected_data['poi_name'];
    let poi_image; // Initialized after poi_images data is loaded
    let shot_type = 'FUS';

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* FETCHING POI IMAGES DATA */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    useEffect(() => {
        
        fetch("http://"+ server_address + server_queries['get_poi_images'] + poi_name  )
        .then( (response) =>  response.json())
        .then( json => { 
            image_data = json['poi_images'].map(function(item){ return {
                image_name: item.name, image_url: item.image }; })
            if(image_data.length > 0){

                // Initializing poi_image con la prima immagine dell'array
                setLoaded(true);
            }
          }
        )
    }, []);


    // ------------------------------------------------------------------------------------------------------------------------- |
                                                            /* FUNCTIONS */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const setPoiImage = (index) => {
        poi_image = image_data[index].image_name;
    }
    
    const setShotType = (value) => {
        shot_type = value;
    }

    const onNextButtonPress = () => {
        navigation.navigate('Screen_SubjectSelectionForm', 
        {
            selected_data : {
                'poi_name' : poi_name,
                'poi_image' : poi_image,
                'shot_type' : shot_type
            } 
        });
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* SLIDER COMPONENT DEFINITION */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    let image_slider;
    if(loaded){
        
        poi_image = image_data[0].image_name; 
        image_slider = ( 

            <View style={{height: '100%'}}>   

                <Carousel
                    loop
                    width={SCREEN_WIDTH}
                    autoPlay={false}
                    data={image_data}
                    scrollAnimationDuration={500}
                    onSnapToItem={setPoiImage}
                    renderItem={({ item }) => (

                        <View style={styles.poi_image_frame} >

                            <Image style={{width: "100%", height: "100%"}} resizeMode='cover' source={{ uri: "http://"+ server_address + item.image_url   }} />

                        </View>

                    )}
                />

            </View>

        )

    }else{

        image_slider = ( <View style={{  width: SCREEN_WIDTH, height: '100%' }}></View> )

    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* RENDERING */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    return(
     
        <View style={{ flex:1, backgroundColor: colors['medium'] }}>
         
            <Component_Status_Bar/>
         
            <View style={{height: SCREEN_HEIGHT-bottomSafeArea}}>

                <View style={{flex: 0.1, width: SCREEN_WIDTH }}>

                    <Component_Header1_Bar text={" SETUP THE SHOT "} />

                </View>

                <View style={{flex: 0.05, width: SCREEN_WIDTH}}>

                    <Component_Header2_Bar text={" Slide to pick an image "}/>

                </View>
                
                <View style={{flex: 0.4, width: SCREEN_WIDTH}}>

                    {image_slider}

                </View>

                <View style={{flex: 0.05, width: SCREEN_WIDTH}}>

                    <Component_Header2_Bar text={" Camera distance from the subject: "}/>

                </View>

                <View style={{flex: 0.3, width: SCREEN_WIDTH}}>
       
                    <Component_CameraDistancePicker onScroll={ (value) => {setShotType(value)}} />

                </View>

                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>

                    <Component_Row_Button text={"NEXT"} onPress={onNextButtonPress}/>

                </View>

            </View>

        </View>
        
    )
}

// ------------------------------------------------------------------------------------------------------------------------- |
                                                /* STYLESHEET */
// ------------------------------------------------------------------------------------------------------------------------- | 

const styles = StyleSheet.create({
    poi_image_frame:
    {
        width: '100%', 
        height: '100%', 
        borderTopWidth: 5, 
        borderBottomWidth: 5, 
        borderColor: colors['dark'], 
        justifyContent: 'center'
    }
})

