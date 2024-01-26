import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View, Alert, FlatList, Animated } from 'react-native'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { colors, settings, text_size, SCREEN_WIDTH, SCREEN_HEIGHT, bottomSafeArea } from '../configs/configurations';
import { Component_Header1_Bar, Component_Row_Button, Component_Status_Bar } from './Common_Components';

//Da impostare secondo la propria camera
const cameraDeviceRatio = 4/3;

// HEAD BUTTONS IMAGES
const overlayImages=[
    require('../resources/face_overlay/left_3-4.png'),
    require('../resources/face_overlay/front.png'),
    require('../resources/face_overlay/front.png'),
    require('../resources/face_overlay/front.png'),
    require('../resources/face_overlay/right_3-4.png')    
]

export default function Screen_LoraForm({navigation}){

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* VARIABLES INITIALIZATION */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    /* STATE VARIABLES */

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const [photo_1, setPhoto1] = useState(undefined);
    const [photo_2, setPhoto2] = useState(undefined);
    const [photo_3, setPhoto3] = useState(undefined);
    const [photo_4, setPhoto4] = useState(undefined);
    const [photo_5, setPhoto5] = useState(undefined);

    const [setupCamera, setSetupCamera] = useState(true);
    const [showCameraView, setShowCameraView] = useState();
    const selected_image = useRef(0);

    // Variabile che contiene il ratio in forma di stringa per configurare il ratio del component Camera di Expo
    const [strCameraRatio, setStrCameraRatioState] = useState();

    // Variabile che contiene il ratio in forma numerica della foto scattata
    const [cameraRatio, setCameraRatio] = useState();

    // Variabile che contiene l'eventuale grandezza / risoluzone della foto presa dalla camera expo (impostata in LoadCameraSetup)
    const [cameraPictureSize, setCameraPictureSize] = useState();

    let camera_ref;

    /* ANIMATION VARIABLES */

    let imageOpacities=[new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0) ];
    imageOpacities[selected_image.current].setValue(1);

    let colorAnim=[new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0) ];
    colorAnim[selected_image.current].setValue(1);

    //Workaround necessario per rendere animabile il colore del bordo dei bottoni con le teste:
    let buttonBorderColors=[
        colorAnim[0].interpolate({inputRange: [0,1], outputRange: [colors['darkest'], colors['text_color']]}),
        colorAnim[1].interpolate({inputRange: [0,1], outputRange: [colors['darkest'], colors['text_color']]}),
        colorAnim[2].interpolate({inputRange: [0,1], outputRange: [colors['darkest'], colors['text_color']]}),
        colorAnim[3].interpolate({inputRange: [0,1], outputRange: [colors['darkest'], colors['text_color']]}),
        colorAnim[4].interpolate({inputRange: [0,1], outputRange: [colors['darkest'], colors['text_color']]})
    ]

    // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* FUNCTIONS */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const onPictureSaved = async photo =>{    

        // Se l'immagine è catturata dalla camera frontale, fai il mirror orizzontale (perchè altrimenti è ribaltata orizzontalmente di default)
        if (type === CameraType.front) {
            photo = await manipulateAsync(
                photo.localUri || photo.uri,
                [
                    { rotate: 180 },
                    { flip: FlipType.Vertical },
                ],
                { compress: 1, format: SaveFormat.PNG }
            );
        }

        switch(selected_image.current){
            case 0:
                setPhoto1(photo);
            break;
            case 1:
                setPhoto2(photo);
            break;  
            case 2:
                setPhoto3(photo);
            break;
            case 3:
                setPhoto4(photo);
            break;
            case 4:
                setPhoto5(photo);
            break;
        }
        setShowCameraView(false);
    }

    const takePicture = () => {

        if (!camera_ref)
            return;

        camera_ref.takePictureAsync({ quality: 1.0, onPictureSaved: onPictureSaved });
        
    }

    const setPreviewImage = (index) => {
            
            Animated.timing(imageOpacities[selected_image.current],{
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start()
            Animated.timing(imageOpacities[index],{
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();

            colorAnim[selected_image.current].setValue(0);
            colorAnim[index].setValue(1);

            selected_image.current = index;
            
            //console.log("(DEBUG) Switching preview image to: " + index);    

    }

    // ------------------------------------------------------------------------------------------------------------------------- |  
    /*     
           LOAD CAMERA RATIO FUNCTION: 

        Il component "Camera" di expo ha la preview con un ratio preso di default; questo può non rispettare il ratio dello schermo del dispositivo
        e causare conseguentemente una preview della camera distorta.
        Per ovviare a ciò bisogna vedere i ratio disponibili della camera e tra questi scegliere quello più vicino al ratio dello screen del dispositivo.

     */
    
        const LoadCameraSetup = async () => {
        // avaRatiosChar contiene i ratios nella forma di array di stringhe: ['4:3', '16:9', '1:1']
        // Funzione che restituisce i ratio disponibili
        const avaRatiosChars = await camera_ref.getSupportedRatiosAsync();
        let ratioValues = [];

        // Trasformo le stringhe dell'array in valori
        for(let i = 0; i <  avaRatiosChars.length; i++){
            let couple = avaRatiosChars[i].split(':');
            ratioValues.push(couple[0]/couple[1]);
        }

        /*  Trovo il ratio più close al ratio dello screen: */
        // Inizializzo il loop
        let closest_ratio_index = 0
        let abs_diff = Math.abs(cameraDeviceRatio - closest_ratio_index);
        
        // Ruoto su tutti i ratio
        for(let i = 1; i < ratioValues.length; i++){
            const curr_abs_diff = Math.abs(cameraDeviceRatio - ratioValues[i]);
            if( curr_abs_diff < abs_diff){
                closest_ratio_index = i;
                abs_diff = curr_abs_diff;            
            }
        }


        let availablePictureSizes = [];
        // Funzione che restituisce le risoluzioni disponibili del device per lo specifico ratio
        availablePictureSizes = camera_ref.getAvailablePictureSizesAsync(avaRatiosChars[closest_ratio_index]);

        console.log("(DEBUG) Chosen camera ratio:  " + avaRatiosChars[closest_ratio_index])
        console.log("(DEBUG) Available picture sizes for chosen Ratio: ");
        for(let i = 0; i < availablePictureSizes.length; i++){
            console.log(availablePictureSizes[i]);
        }

        // Imposto lo stato della variabile cameraRatio e triggero il rerender:
        setStrCameraRatioState(avaRatiosChars[closest_ratio_index]);  
        setCameraRatio(ratioValues[closest_ratio_index]);

        // Scegliere la risoluzione desiderata e impostarla nella seguente variabile di stato:
        // setCameraPictureSize(availablePictureSizes[0]);

        setSetupCamera(false);
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
    /*
            LAUNCH LORA FUNCTION

        Funzione che spedisce le immagini al server e avvia il training

    */

    const LaunchLora = () => {
        if( photo_1==undefined || photo_2==undefined || photo_3==undefined || photo_4==undefined || photo_5==undefined ){
            Alert.alert('Missing Images','Take all 5 selfies before continuing', [
                {text: 'CLOSE', onPress: () => {}},
            ]);
            return
        }
         

        let data = new FormData();

        data.append("image1", {uri: photo_1.uri, name: 'image1.jpg', type: 'image/jpeg'})
        data.append("image2", {uri: photo_2.uri, name: 'image2.jpg', type: 'image/jpeg'})
        data.append("image3", {uri: photo_3.uri, name: 'image3.jpg', type: 'image/jpeg'})
        data.append("image4", {uri: photo_4.uri, name: 'image4.jpg', type: 'image/jpeg'})
        data.append("image5", {uri: photo_5.uri, name: 'image5.jpg', type: 'image/jpeg'})

        fetch("http://" + settings['server-address'] + settings['lora_training_url'], 
            {
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: data
            }
        )
        .then((response) => response.json())
        .then( json =>{
                console.log(json['lora_code'])
                navigation.navigate("Screen_CreatedCode", {data: json['lora_code']});
            }
        ).catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
             // ADD THIS THROW error
              throw error;
            });
    }


    // ------------------------------------------------------------------------------------------------------------------------- |
                                                /* RENDERING RICHIESTA DEI PERMESSI */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={{ flex: 1, justifyContent: 'center'}}>
            <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    // ------------------------------------------------------------------------------------------------------------------------- |
                                            /* PRIMO RENDERING TEMPORANEO PER SETUP PARAMETRI DELLA CAMERA */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    if(setupCamera){

        return (
            
            <View style={{flex: 1, backgroundColor: colors['medium'], justifyContent: 'center', alignItems: 'center'}}>
            
                <Text> Loading camera configurations </Text>

                <View style={{height: 0}}>

                    <Camera onCameraReady={() => { console.log("LoadingCamera"); LoadCameraSetup(); }} onMountError={(error) => { console.log("error" + error)}} style={{width: 0, height: 0}} type={type} ref={ (ref) => { camera_ref = ref }}>
                    </Camera>

                </View>
                
            </View>

        )
    }


    // ------------------------------------------------------------------------------------------------------------------------- |
                                        /* RENDERING SE SI STA FACENDO UNA FOTO (showCameraView==true) */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    if(showCameraView){
  
        return ( 
            
            <View style={{ flex: 1, justifyContent: 'center',}}>

                <Camera pictureSize={cameraPictureSize} ratio={strCameraRatio} style={{width: SCREEN_WIDTH, height: SCREEN_WIDTH*cameraRatio}} type={type} ref={ (ref) => { camera_ref = ref }}>

                    {/* TOP BUTTON CONTAINER */}
                    <View style={[styles.camera_button_container, { top: 30}]}>
                        
                        {/* FLIP CAMERA BUTTON */}
                        <TouchableOpacity style={[ styles.camera_button, {height: 60}]} onPress={toggleCameraType}  >

                            <Text style={styles.camera_button_text}> Flip Camera </Text>

                        </TouchableOpacity>
                    
                    </View>

                    {/* BOTTOM BUTTON CONTAINER */}
                    <View style={[styles.camera_button_container, {height: 220, bottom: bottomSafeArea}]}>
                    
                        {/* TAKE SHOT BUTTON */}
                        <TouchableOpacity style={[ styles.camera_button, {height: 100}]} onPress={takePicture} >

                            <Text style={styles.camera_button_text}> Take shot </Text>

                        </TouchableOpacity>

                        {/* GO BACK BUTTON */}
                        <TouchableOpacity style={[ styles.camera_button, {height: 100}]} onPress={() => {setShowCameraView(false)}}>

                            <Text style={styles.camera_button_text}> Go Back </Text>

                        </TouchableOpacity>
                    
                    </View>

                </Camera>

            </View>
        
        )

    
    // ------------------------------------------------------------------------------------------------------------------------- |
                                            /* RENDERING DEL FORM PER LA SCELTA DELLE FOTO */
    // ------------------------------------------------------------------------------------------------------------------------- | 

    }else{

        return (
            
            <View style={{flex: 1, backgroundColor: colors['medium']}}>
                
                {/* Hidden component per setuppare il ratio della camera */}

                <Component_Status_Bar />

                <View style={{ height: SCREEN_HEIGHT - bottomSafeArea, width: SCREEN_WIDTH}}>

                    {/* --------------------------------------------------| */}
                    {/* TITLE FRAME */}
                    <View style={{ flex: 0.10,  width: SCREEN_WIDTH}}>

                        <Component_Header1_Bar text={"LORA TRAINING"}/>

                    </View>

                    {/* --------------------------------------------------| */}
                    {/* PICTURE CONTAINER */}
                    {/* Le foto sono tutte sovrapposte e con opacità 0 TRANNE una; la foto visibile è associata al "bottone testa" selezionato */}
                    <TouchableOpacity style={ [ {flex: 0.60,}, styles.pictures_container] } onPress={() => { setShowCameraView(true) }} >

                        {/* CONTAINER PHOTO 1 */}
                        <Animated.View style={[ styles.picture_container, { opacity: imageOpacities[0]}]}>
                            
                            {photo_1 && <Image style={{ width: '' + (1/cameraRatio) * 100 + '%' , height: '100%' }} source={{uri:photo_1.uri} } />}
                            <Text style={styles.picture_text}> tap to take a picture </Text>

                        </Animated.View>

                        {/* CONTAINER PHOTO 2 */}
                        <Animated.View style={[ styles.picture_container, { opacity: imageOpacities[1]}]}>

                            {photo_2 && <Image style={{ width: '' + (1/cameraRatio) * 100 + '%' , height: '100%' }} source={{uri:photo_2.uri} } /> }
                            <Text style={styles.picture_text}> tap to take a picture </Text>

                        </Animated.View>

                        {/* CONTAINER PHOTO 3 */}
                        <Animated.View style={[ styles.picture_container, { opacity: imageOpacities[2]}]}>

                            {photo_3 && <Image style={{ width: '' + (1/cameraRatio) * 100 + '%' , height: '100%' }} source={{uri:photo_3.uri} } /> }
                            <Text style={styles.picture_text}> tap to take a picture </Text>

                        </Animated.View>

                        {/* CONTAINER PHOTO 4 */}
                        <Animated.View style={[ styles.picture_container, { opacity: imageOpacities[3]}]}>

                            {photo_4 && <Image style={{ width: '' + (1/cameraRatio) * 100 + '%' , height: '100%' }} source={{uri:photo_4.uri} } /> }
                            <Text style={styles.picture_text}> tap to take a picture </Text>

                        </Animated.View>

                        {/* CONTAINER PHOTO 5 */}
                        <Animated.View style={[ styles.picture_container, { opacity: imageOpacities[4]}]}>

                            {photo_5 && <Image style={{ width: '' + (1/cameraRatio) * 100 + '%' , height: '100%' }} source={{uri:photo_5.uri} } /> }
                            <Text style={styles.picture_text}> tap to take a picture </Text>

                        </Animated.View>

                    </TouchableOpacity>

                    {/* --------------------------------------------------| */}
                    {/* HEADS BUTTONS FRAME */}
                    <View style={{ flex: 0.15, backgroundColor: colors['light']}}>

                        <FlatList
                            horizontal
                            style={{ width: '100%', height: '100%'}}                                

                            data={[ photo_1, photo_2, photo_3, photo_4 ,photo_5 ]}

                            renderItem={ ({item, index}) => {
                                return(
                                    
                                    <TouchableOpacity key={index} onPress={() => {setPreviewImage(index)}} style={styles.head_button_container}>
                                    
                                        <Animated.View style={[styles.head_button_frame, { borderColor: buttonBorderColors[index]}]}>

                                                { item && <View style={styles.green_overlay}></View>}  
                                                <Image style={{ position: 'absolute', width: '100%', height: '70%',}} source={overlayImages[index]}/>
                                                  
                                        
                                        </Animated.View>    

                                    </TouchableOpacity>

                                )

                            }}
                        />

                    </View>
                    
                    {/* --------------------------------------------------| */}
                    {/* START BUTTON FRAME  */}
                    <View style={{ flex: 0.15}}>

                        <Component_Row_Button text={"CONFIRM"} onPress={()=>{LaunchLora()}}/>
                                                
                    </View>
                    {/* --------------------------------------------------| */}

                </View>

            </View> 
            
        )

    }

}

// ------------------------------------------------------------------------------------------------------------------------- |
                                                /* STYLESHEET */
// ------------------------------------------------------------------------------------------------------------------------- | 

const styles = StyleSheet.create({

// FORM ITEMS STYLE:

    pictures_container:
    {
        
        borderBottomColor: colors['dark'],
        borderBottomWidth: 4
    },
    picture_container:
    {
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        width:'100%',
        height:'100%'
    },
    picture_text:
    {
        position: 'absolute',
        bottom: 20,
        color: 'white'
    },

// HEAD BUTTONS STYLES:
    head_button_container:
    {
        width: SCREEN_WIDTH/5, 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    head_button_frame:
    {
        backgroundColor: colors['lightest'],
        width: '95%', 
        height: '90%', 
        borderRadius: 15, 
        borderWidth: 3 , 
        justifyContent: 'center', 
        alignItems: 'center', 
        size: 0.2,
    },
    green_overlay:
    {
        width: '100%',
        height: '100%',
        backgroundColor: '#27b84d',
        borderRadius:10
    },


// CAMERA ITEMS STYLES:

    camera_button_container: 
    {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: SCREEN_WIDTH, 
        alignItems: 'center',
        position: 'absolute',
    },
    camera_button: 
    {
        borderWidth: 4, 
        borderRadius: 10, 
        width: SCREEN_WIDTH/1.5,  
        justifyContent: 'center', 
        alignItems:'center'
    },
    camera_button_text: 
    {
        fontSize: text_size['medium'],
        fontWeight: 'bold',
        color: 'white',
    },
})
