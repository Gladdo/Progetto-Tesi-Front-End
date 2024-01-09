import React, {useState, useEffect} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Button, TextInput, Image, CheckBox } from 'react-native';

import GladImagePicker from './GladImagePicker'
import GladPicker from './GladPicker'
import {Dimensions} from 'react-native';

/* --------------------------------------------------------------------------------------------------------------------------------------------------- |
> GENERATE IMAGE FORM COMPONENT:
------------------------------------------------------------------------------------------------------------------------------------------------------ */

export default function GenerateImageForm(props){

    const server_address = props.server_address;
    /* --------------------------------------------------------------------------------------------------------------------------------------------------- |
    > FUNCTION STATE VARIABLES:
    ------------------------------------------------------------------------------------------------------------------------------------------------------ */

    // Nelle variabili available_* viene inserito i dati ricevuti dal server inerenti ai rispettivi nomi 
    const [available_pois, setAvailablePois] = useState("");
    const [available_pois_images, setAvailablePoisImages] = useState("");
    const [available_actions, setAvailableActions] = useState("");
    const available_action_shot_types = [{"name": "Close distance Shot"}, {"name": "Medium distance Shot"}, {"name": "Far distance Shot"}]
  
    const [generated_image_loading, setGeneratedImageLoading] = useState(false);
    const [generated_image_ready, setGeneratedImageReady] = useState(false);
    const [generated_image_url, setGeneratedImageUrl] = useState("");
  
    // Nelle variabili selected_* viene inserito le scelte fatte dall'utente sul form; queste vengono poi spedite al server
    const [selected_poi, setSelectedPoi] = useState("");
    const [selected_poi_image, setSelectedPoiImage] = useState("");
    const [selected_action, setSelectedAction] = useState("");
    const [selected_action_shot_type, setSelectedActionShotType] = useState("");
    const [selected_gender, setSelectedGender] = useState("");
    const [selected_age, setSelectedAge] = useState("");
    const [selected_other_details, setSelectedOtherDetails] = useState("");
    const [selected_lora, setSelectedLora] = useState("");
  
    // Dynamic action selection properties
    const [selected_action_prompt, setActionPrompt] = useState("");
    const [selected_dynamic_action_selection, setDynamicActionSelection] = useState(false);
    
    // Variabile di stato a true se le variabili available_* sono state caricate
    const [loaded, setLoaded] = useState(false);
  
    /* --------------------------------------------------------------------------------------------------------------------------------------------------- |
    > FUNCTIONS:
    Funzioni varie per le features del front-end e l'interazione col back-end
    ------------------------------------------------------------------------------------------------------------------------------------------------------ */
    
    // -------------------------|
    // GENERATE IMAGE:
    // -------------------------|
    // Genera l'url dell'API
    function generate_url(poi_name, poi_image_name, action_name, action_shot_type, age, gender, other_details, selected_lora, dynamic_action_selection, action_prompt){
      return "http://"+ server_address + "/diffusers_api/generate_image?" + 
        "poi_name=" + poi_name + 
        "&poi_image_name=" + poi_image_name +
        "&action_name=" + action_name + 
        "&action_shot_type=" + action_shot_type +
        "&age=" + age + 
        "&gender=" + gender +
        "&other_details=" + other_details +
        "&selected_lora=" + selected_lora + 
        "&dynamic_action_selection=" + dynamic_action_selection +
        "&action_prompt=" + action_prompt;
    }

    // -------------------------|
    // GENERATE IMAGE:
    // -------------------------|
    // Definisco un'arrow function così che il this si riferisca allo stato della funzione in cui è definita l'arrow function
    const generate_image = () => {
      fetch(generate_url(selected_poi,
        selected_poi_image, 
        selected_action, 
        selected_action_shot_type, 
        selected_age, selected_gender, 
        selected_other_details, 
        selected_lora, 
        selected_dynamic_action_selection, 
        selected_action_prompt))
      .then((response)=> response.json())
      .then( json_data => {
          console.log(json_data)
          setGeneratedImageReady(true);
          setGeneratedImageLoading(false);
          setGeneratedImageUrl( "http://" + server_address + json_data.url)
      })
  
      setGeneratedImageLoading(true);
    }
  
    // -------------------------|
    // USE EFFECT:
    // -------------------------|
    /* 
    Questa funzione viene chiamata da React-Native solo la prima volta che GenerateImageForm viene renderizzato.
    La funzione adempie alle seguenti cose:
      > Richiede i dati dal back-end con cui popolare le features del front-end che poi l'utente dovrà selezionare.
      > All'arrivo dei dati produce dei side effects sulle variabili di stato della funzione; questo triggera il re-rendering del componente che
      viene ri-renderizzato utilizzando i dati fetchati. 
    */
    useEffect(() => {
      fetch("http://"+ server_address +"/diffusers_api/db_summary")
      .then( (response) =>  response.json())
      .then( 
        json => {
          setAvailablePois(json['pois']);
          console.log(json['pois']);
          setAvailablePoisImages(json['poi_images'])
          console.log(json['poi_images'])
          setAvailableActions(json['actions']);
          setLoaded(true);
        }
      )
    }, []);
    
    // -------------------------|
    // EVENT POI SELECTION:
    // -------------------------|
    // Funzione triggerata quando l'utente seleziona il Point of Interest
    const EventPoiSelection = (name) => {
      setSelectedPoi(name);
      // Alla selezione del POI voglio assicurarmi che intanto venga selezionata la prima immagine disponibile, poi l'utente se vuole la cambia
      for(var i = 0; i < available_pois_images.length; i++){
        if(available_pois_images[i].poi == name){
          setSelectedPoiImage(available_pois_images[i].name);
          break;
        }
      } 
    }
  
    /* --------------------------------------------------------------------------------------------------------------------------------------------------- |
    > DEBUG:
    ------------------------------------------------------------------------------------------------------------------------------------------------------ */
  
    console.log("Selected Poi: " + selected_poi);
    console.log("Selected Poi Image: " + selected_poi_image);
    console.log("Selected Action: " + selected_action);
    console.log("Selected Action Shot Type: " + selected_action_shot_type);
    console.log("Selected Other Details: " + selected_other_details);
    
    /* --------------------------------------------------------------------------------------------------------------------------------------------------- |
    > PRE-RENDERING SETUP:
    ------------------------------------------------------------------------------------------------------------------------------------------------------ */
    
    /* Delle immagini disponibili in available_pois_images, carica in poi_images_data le immagini relative al POI selezionato. 
    La struttura poi_images_data viene poi utilizzata per setuppare il GladImagePicker.
    */
    var poi_images_data = [];
    for(var i = 0; i < available_pois_images.length; i++){
      if(available_pois_images[i].poi == selected_poi){
        poi_images_data.push(available_pois_images[i]);
      }
    }  
  
    /* --------------------------------------------------------------------------------------------------------------------------------------------------- |
    > RENDERING:
    ------------------------------------------------------------------------------------------------------------------------------------------------------ */
  
    if(generated_image_ready){
      return (
        <View style={{width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center'}}>

          <Image source={{uri: generated_image_url }} style={{maxWidth: WINDOW_HEIGHT-100, width: "100%", maxHeight: WINDOW_WIDTH-100,height: undefined, aspectRatio: 1/1}}/>
        
        </View>
      )
    }
  
    if(generated_image_loading){
      return (

        <View>
          
          <ActivityIndicator size="large"/>

          <Text style={{marginTop: 20, fontWeight: 'bold', fontSize: 20 }}> Your image is being baked, wait (4-5 min) ... </Text>

        </View>

      )
    }
  
    var action_selection;
    if(selected_dynamic_action_selection){

      action_selection=(

        <View style={{ width: "100%", zIndex: 3, paddingTop: 20, alignItems:'center'}}>

          <Text style={styles.form_element}> Action prompt: </Text>

          <TextInput
            style={[styles.text_input, styles.form_element, {maxWidth: WINDOW_HEIGHT-100}]}
            placeholder=" write here... "
            onChangeText={newText => setActionPrompt(newText)}
          />

        </View>

      )
    }else{
      action_selection = (

        <View style={{ width: "100%", zIndex: 3, paddingTop: 20, alignItems:'center'}}>

          <GladPicker
            width={"100%"}
            maxWidth={WINDOW_HEIGHT-100}
            menuMaxHeight={200}
            data={available_actions}
            onSelection={setSelectedAction}
            placeholder="Select an Action"
          />

        </View>

      )
    }
  
    if(loaded){
      return (
        <View style={styles.form_container}>

          <View style={{ width: "100%", zIndex: 10, paddingTop: 20, paddingBottom: 20, alignItems:'center'}}>

          <GladPicker 
            width={"100%"}
            maxWidth={WINDOW_HEIGHT-100}
            menuMaxHeight={200}
            data={available_pois} 
            onSelection={EventPoiSelection}
            placeholder="Select a POI"/>
          </View>

          <GladImagePicker 
            server_address={server_address}
            width={"100%"}
            maxWidth={WINDOW_HEIGHT-100}
            data={poi_images_data}
            onSelection={setSelectedPoiImage}   
            placeholder="SELECT A POI TO SHOW DATA"       
          />

          <View style={{ width: "100%", zIndex: 8, paddingTop: 20, alignItems:'center'}}>

            <GladPicker
              width={"100%"}
              maxWidth={WINDOW_HEIGHT-100}
              menuMaxHeight={80}
              data={available_action_shot_types}
              onSelection={(name) => { 
                if(name=="Close distance Shot")
                  setSelectedActionShotType("CLS")
                if(name=="Medium distance Shot")
                  setSelectedActionShotType("MES")
                if(name=="Far distance Shot")
                  setSelectedActionShotType("FUS")
                  console.log("(DEBUG) Selected shot type: " + selected_action_shot_type)
              }}
              placeholder="Select a Shot Type"
            />

          </View>

          <View style={{ width: "100%", zIndex: 7, paddingTop: 20, alignItems:'center'}}>

            <GladPicker
              width={"100%"}
              maxWidth={WINDOW_HEIGHT-100}
              menuMaxHeight={80}
              data={[{"name": "man"}, {"name": "woman"}]}
              onSelection={setSelectedGender}
              placeholder="Select Gender"
            />

          </View>

          <View style={{ width: "100%", zIndex: 6, paddingTop: 20, alignItems:'center'}}>

            <GladPicker
              width={"100%"}
              maxWidth={WINDOW_HEIGHT-100}
              menuMaxHeight={80}
              data={[{"name": "young"}, {"name": "adult"}, {"name": "old"}]}
              onSelection={setSelectedAge}
              placeholder="Select Age"
            />

          </View>
  
          <View style={{ width: "100%", zIndex: 4, paddingTop: 20, alignItems:'center', flexDirection: 'row', justifyContent: 'center'}}>

            <CheckBox
              value={selected_dynamic_action_selection}
              onValueChange={setDynamicActionSelection}
            /> 

            <Text> Choose action with a prompt </Text>

          </View>

          {action_selection}

          <Text style={styles.form_element}> Write your Lora Code: </Text>

          <TextInput
            style={[styles.text_input, styles.form_element, {maxWidth: WINDOW_HEIGHT-100}]}
            placeholder=" write here... "
            onChangeText={newText => setSelectedLora(newText)}
          />
  
          <Text style={styles.form_element}> Other Details: </Text>

          <TextInput
            style={[styles.text_input, styles.form_element, {maxWidth: WINDOW_HEIGHT-100}]}
            placeholder=" write here... "
            onChangeText={newText => setSelectedOtherDetails(newText)}
          />
          
          <View style={styles.generate_button}>

            <Button  title="GENERATE IMAGE" onPress={generate_image} > GENERATE </Button>

          </View>
          
        </View>
     )
    }else{
      return (

        <View>

          <Text> Loading Form ... </Text>

        </View>

      )
    }
    
}

// Uutils variables:
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

/* --------------------------------------------------------------------------------------------------------------------------------------------------- |
> STYLE:
------------------------------------------------------------------------------------------------------------------------------------------------------ */

const styles = StyleSheet.create({
  
    form_container: {
      width: '80%',
      height: 200,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    form_element: {
      width: '100%',
      maxWidth: WINDOW_HEIGHT-100,
      margin: 4,
    }, 
  
    text_input: {
      height: 40,
      borderWidth: 1,
      borderRadius: 4,
    },
  
    generate_button: {
      width: '100%',
      maxWidth: WINDOW_HEIGHT-100,
      backgroundColor: 'red',
    }, 
  
  });

