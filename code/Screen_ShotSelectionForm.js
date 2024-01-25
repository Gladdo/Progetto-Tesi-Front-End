import { useState, useEffect } from 'react'
import { View, Image, StyleSheet, Animated, Text, TouchableOpacity, ScrollView} from 'react-native'
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
    let poi_image_description;
    let shot_type = 'FUS';

    let selected_image_index = 0;
    let openedPanelIndex = 0;

    let isInfoPanelOpen = false;
    let image_description_panels_positions = [];

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                        /* FETCHING POI IMAGES DATA */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    useEffect(() => {
        
        fetch("http://"+ server_address + server_queries['get_poi_images'] + poi_name  )
        .then( (response) =>  response.json())
        .then( json => { 
            image_data = json['poi_images'].map(function(item){ return {
                image_name: item.name, image_url: item.image, image_description: item.user_description }; })
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
        selected_image_index = index;
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
                'shot_type' : shot_type,
                'poi_image_description' : poi_image_description
            } 
        });
    }

    const OpenImageInfoPanel = () => {
        if(isInfoPanelOpen)
            return;

        image_description_panels_positions[selected_image_index].setValue(0)
        openedPanelIndex=selected_image_index;
        isInfoPanelOpen=true;

    }

    const CloseImageInfoPanel = () => {
        if(!isInfoPanelOpen)
            return;

        image_description_panels_positions[openedPanelIndex].setValue(1000)
        isInfoPanelOpen=false;

    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* SLIDER COMPONENT DEFINITION */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    let image_slider;

    let image_description_panels=[];
    
    if(loaded){
        
        poi_image = image_data[0].image_name; 
        poi_image_description = image_data[0].image_description

        for(let i = 0; i < image_data.length; i++){
            image_description_panels_positions.push(new Animated.Value(1000));

            image_description_panels.push(
            
                <Animated.View key={i} style={{ justifyContent:'center', alignItems: 'center', zIndex: 3, position: 'absolute', width: SCREEN_WIDTH, height: SCREEN_HEIGHT, transform: [{translateY: image_description_panels_positions[i] }]}}>
                    
                    <View style={{width: '80%', height: '80%', backgroundColor: colors["light"], borderWidth: 2, borderColor: colors["dark"],}}>
                        
                        <View style={{ flex: 0.8, width: '100%',  justifyContent: 'center', alignItems: 'center'}}>

                            <ScrollView contentContainerStyle={{top: 10, width: '94%'}} >

                                <Component_Header2_Bar text={image_data[i].image_description + "\n " +
                                "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur. Duis aute irure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." +
                                "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullamco laboriosam, nisi ut aliquid ex ea commodi consequatur. Duis aute irure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}/> 

                            </ScrollView>

                        </View>

                        <View style={{flex: 0.05}}>
                        </View>

                        <View style={{flex: 0.1,  justifyContent: 'center', alignItems: 'center'}}>

                            <TouchableOpacity style={{ justifyContent: 'center', width: "80%", height: "100%", backgroundColor: colors["lightest"], borderWidth: 2, borderColor: colors["dark"]}}onPress={ () => { CloseImageInfoPanel() } }>

                                <Component_Header2_Bar text={"Close"}/>

                            </TouchableOpacity>

                        </View>


                    </View>
                       
                </Animated.View>
            )

        }

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

                            <Image style={{width: "100%", height: "100%"}} resizeMode='cover' source={{ uri: "http://"+ server_address + item.image_url }} />
                            
                        </View>

                    )}
                />

                <TouchableOpacity style={{position: 'absolute', right: 5, top:10 , borderRadius: 40, width: 40, height: 40, backgroundColor: 'grey'}} onPress={ () => { OpenImageInfoPanel() } } >
                
                        <Image style={{ width: 40, height: 40}} source={require('../resources/icons/info_button.png')} />

                </TouchableOpacity>

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

                <View style={{flex: 0.08, width: SCREEN_WIDTH, justifyContent:'center'}}>

                    <Component_Header2_Bar text={" Select a " + poi_name + " image:"}/>

                </View>
                
                <View style={{flex: 0.37, width: SCREEN_WIDTH}}>

                    {image_slider}

                </View>

                <View style={{flex: 0.08, width: SCREEN_WIDTH, justifyContent:'center'}}>

                    <Component_Header2_Bar text={" Select where the subject appears in the image: "}/>

                </View>

                <View style={{flex: 0.27, width: SCREEN_WIDTH}}>
       
                    <Component_CameraDistancePicker onScroll={ (value) => {setShotType(value)}} />

                </View>

                <View style={{flex: 0.1, width: SCREEN_WIDTH}}>

                    <Component_Row_Button text={"NEXT"} onPress={onNextButtonPress}/>

                </View>

                {image_description_panels}

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

