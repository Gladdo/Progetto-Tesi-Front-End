import { FlatList, View, Text, TouchableOpacity, Image, Animated, StyleSheet } from "react-native";
import {useState} from 'react'
import { SCREEN_WIDTH, colors, text_size } from "../configs/configurations";

export default function Component_CameraDistancePicker(props){
    const [flatlist_ref, setFlatListRef] = useState();

    let descriptions_opacities = [new Animated.Value(1), new Animated.Value(0), new Animated.Value(0)];
        
    let curr_index = 0; 
    let max_index = 2;

    let options = ['FUS','MES','CLS'];

    const arrow_img = require('../resources/icons/dark_blue_arrow1.png');

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* FUNCTIONS */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    const switchDescriptionAnimation = (old_dsc_index, next_dsc_index) => {
        Animated.sequence([
            Animated.timing(
                descriptions_opacities[old_dsc_index], {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }),
            Animated.timing(
                descriptions_opacities[next_dsc_index], {
                toValue: 1,
                duration: 200,
                useNativeDriver: false
            }),
        ]).start();
    }

    const scrollRightEvent = () => {
        if(curr_index < max_index)
        {
            curr_index=curr_index+1;
            flatlist_ref.scrollToIndex({animated: true, index: curr_index});
            switchDescriptionAnimation(curr_index-1, curr_index);
            props.onScroll( options[curr_index] );
        }
        
    }

    const scrollLeftEvent = () =>{
        if(curr_index>0){
            curr_index=curr_index-1;
            flatlist_ref.scrollToIndex({animated: true, index: curr_index});
            switchDescriptionAnimation(curr_index+1, curr_index);
            props.onScroll( options[curr_index] );
        }
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* RENDERING */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    return(

        <View style={styles.container}>

            <View style={styles.choice_slider_container}>
            
                {/* LEFT ARROW BUTTON */}
                <TouchableOpacity onPress={() =>{scrollLeftEvent()}} style={ [styles.arrow_button_container, {left: 0}] }>
            
                    <Image style={[ styles.arrow_image, { transform: [{rotate: '180deg'}], left: 15 }]} source={arrow_img}/>
            
                </TouchableOpacity>
            
                {/* RIGHT ARROW BUTTON */}
                <TouchableOpacity onPress={() =>{scrollRightEvent()}} style={ [styles.arrow_button_container, {right: 0}] }>
            
                    <Image style={ [ styles.arrow_image, { right:15 } ] } source={arrow_img}/>
            
                </TouchableOpacity>
            
                {/* CHOICE CONTAINER */}
                <FlatList   horizontal 
                            style={{ width: SCREEN_WIDTH, height: "100%" }}
                            pagingEnabled
                            
                            data={['FAR', 'MEDIUM', 'CLOSE' ]}
                            
                            ref={(ref) => { setFlatListRef(ref)}}
                            renderItem={(el) => {
                    
                                return(

                                    <View style={{ justifyContent: 'center', width: SCREEN_WIDTH }}>
                                        
                                        <Text style={styles.choice_text}> {el.item} </Text>

                                    </View>

                                )
                            }}
                />
            
            </View>
            
            <View style={styles.descriptions_container}>
                            
                {/* FAR OPTION DESCRIPTION */}
                <View style={styles.description_container}>
                        
                        <Animated.View style={ [ styles.description, {opacity: descriptions_opacities[0]}]}>
                            
                            <Text style={{color: colors['text_color'], fontSize: text_size['small']}}> Far: </Text>
                            
                            <Text style={{color: colors['text_color'], fontSize: text_size['small']}}> The subject fits into the frame; he appears from head to toes. </Text>
                       
                        </Animated.View>
                
                </View>
                
                {/* MEDIUM OPTION DESCRIPTION */}
                <View style={styles.description_container}>
                   
                        <Animated.View style={ [ styles.description, {opacity: descriptions_opacities[1]}]}>
                            
                            <Text style={{color: colors['text_color'], fontSize: text_size['small']}}> Medium: </Text>
                            
                            <Text style={{color: colors['text_color'], fontSize: text_size['small']}}> The subject will appear in the picture from the hip to the head. </Text>
                        
                        </Animated.View>
                
                </View>
                
                {/* CLOSE OPTION DESCRIPTION */}
                <View style={styles.description_container}>
                   
                        <Animated.View style={ [ styles.description, {opacity: descriptions_opacities[2]}]}>
                           
                            <Text style={{color: colors['text_color'],  fontSize: text_size['small']}}> Close: </Text>
                           
                            <Text style={{color: colors['text_color'],  fontSize: text_size['small']}}> The subject will appear very close in the picture, fitting from the chest to the head. </Text>
                       
                        </Animated.View>

                </View>  
                
            </View>
            
        </View>
    )

}

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* STYLESHEET */
    // ------------------------------------------------------------------------------------------------------------------------- | 

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: colors['light'],
        borderColor: colors['dark'] , 
        borderTopWidth: 4, 
        borderBottomWidth: 1
    },
    choice_slider_container:
    {
        flex: 0.32,
        width: SCREEN_WIDTH
    },
    descriptions_container:
    {
        flex: 0.68, 
        width: SCREEN_WIDTH
    },
    description_container:
    {
        position: 'absolute', 
        padding: '2%', 
        height: '100%', 
        width: '100%'
    },
    description:
    {
        paddingLeft: 30, 
        paddingRight: 30, 
        borderRadius: 20, 
        height: '100%', 
        width: '100%', 
        backgroundColor: colors['dark'], 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    arrow_button_container:{
        zIndex: 2, 
        position: 'absolute', 
        width: 100, 
        height: "100%", 
        justifyContent: 'center',
    },
    arrow_image:
    {
        height: '40%',
        width: 50,
        position: 'absolute',
    },
    choice_text:
    {
        color: colors['darkest'], 
        fontWeight: 'bold', 
        textAlign: 'center', 
        fontSize: text_size['big']
    }
})



