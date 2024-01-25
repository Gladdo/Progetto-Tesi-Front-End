import { FlatList, View, Text, TouchableOpacity, Image, Animated, StyleSheet } from "react-native";
import {useState} from 'react'
import { SCREEN_WIDTH, colors, text_size } from "../configs/configurations";

export default function Component_HorizontalScrollPicker(props){
    const [flatlist_ref, setFlatListRef] = useState();

    let curr_index = 0; 
   

    let options = props.options;

    let max_index = options.length-1;

    let descriptions_opacities = [];
    for(let i=0; i < options.length; i ++){
        descriptions_opacities.push(new Animated.Value(0));
    }
    descriptions_opacities[0].setValue(1);

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
                        
                        data={options}
                        
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
        borderColor: colors['darkest'] , 
        borderTopWidth: 2, 
        borderBottomWidth: 2,
        width: SCREEN_WIDTH
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



