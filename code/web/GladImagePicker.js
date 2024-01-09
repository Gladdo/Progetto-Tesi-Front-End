import {View, Text, Image, FlatList, Button} from 'react-native'
import React, {useState} from 'react';

  /* --------------------------------------------------------------------------------------------------------------------------------------------------- |
  > GLAD IMAGE PICKER:
  Renderizza le coppie (name, image) strutturate così:
  [{"name": "item1", "image": "url_to_img1"}, {"name": "item2", "image": "url_to_img2"}, ..., {"name": "itemN", "image": "url_to_imgN"}]
  ------------------------------------------------------------------------------------------------------------------------------------------------------ */

export default function GladImagePicker(props){
    // -------------------------|
    // FUNCTION STATE VARIABLES
    // -------------------------|
    const [flatList, setFlatList] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inner_width, setInnerWidth] = useState(0);

    // -------------------------|
    // UTILITY VARIABLES
    // -------------------------|
    const imageHost = "http://" + props.server_address + "/";
    const maxIndex = props.data.length - 1;

    // -------------------------|
    // EVENT FUNCTIONS
    // -------------------------|

    // Chiamata alla pressione del bottone di sinistra
    const previous_image = () =>{
        if(currentIndex>0){
            var index = currentIndex - 1;
            setCurrentIndex(index);
            flatList.scrollToIndex({animated: true, index: index});
            props.onSelection(props.data[index].name);
        }
    }

    // Chiamata alla pressione del bottone di destra
    const next_image = () =>{
        if(currentIndex<maxIndex){
            var index = currentIndex + 1;
            setCurrentIndex(index);
            flatList.scrollToIndex({animated: true, index: index});
            props.onSelection(props.data[index].name);
        }
    }

    // -------------------------|
    // RENDERING
    // -------------------------|

    return (
        
        <View style={{maxWidth: 512, width: '100%', height: inner_width}} onLayout={(event) => {setInnerWidth(event.nativeEvent.layout.width)}}>
            
            {/* ------------------------------------------------------|
                FLATLIST A SCORRIMENTO ORIZZONTALE 
            |------------------------------------------------------ */}
            <FlatList 
                horizontal
                ref={(ref) => { setFlatList(ref); }}
                scrollEnabled={false}
                data={props.data}
                style={{width: '100%'}}
                renderItem={({item}) => {
                    
                    /* FUNZIONE DI RENDERING DEL CONTAINER DI CIASCUNA IMMAGINE DELLA LISTA */
                    return (

                        <View style={{width: inner_width, justifyContent: 'center', alignItems: 'center'}}>
                            
                            <Image style={{width: inner_width, height: inner_width-50}} resizeMode='cover' source={{ uri: imageHost + item.image }} />

                            <Text style={{fontWeight: 'bold', height: 20}}> {item.name} </Text>

                        </View>
                    )
                }}
            />
            
            {/* ------------------------------------------------------|
                BUTTONS PER LA SELEZIONE 
            |------------------------------------------------------ */}
            <View style={{height: 30, flexDirection: 'row', justifyContent: 'center'}}>

                <View style={{ width:"50%", alignItems: "flex-start" }}>
                    <Button title="<" onPress={previous_image}></Button>
                </View>

                <View style={{ width:"50%", alignItems: "flex-end" }}>
                    <Button title=">" onPress={next_image}></Button>
                </View>

            </View>

        </View>
    )
}
