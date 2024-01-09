import React, {useState} from 'react';
import { StyleSheet, View, Button } from 'react-native';
import GenerateImageForm from './web/GenerateImageForm';
import CreateLoraForm from './web/CreateLoraForm';
import {Dimensions} from 'react-native';
import { settings } from '../configs/configurations';

/* --------------------------------------------------------------------------------------------------------------------------------------------------- |
> APP HOOK:
----------------------------------------------------------------------------------------------------------------------------------------------- Gladdo */

const server_address = settings['server-address'];

export default function App() {
  const [page, setPage] = useState(1);

  if(page==1){
  // HOMEPAGE
    return(

      <View style={styles.container}>

        <View style={styles.button}>
            <Button  title="GENERATE IMAGE" onPress={() => {setPage(2)}} > GENERATE </Button>
        </View>

        <View style={styles.button}>
            <Button  title="CREATE YOUR LORA" onPress={() => {setPage(3)}} > CREATE </Button>
        </View>

      </View>);

  }
  if(page==2){
  // IMAGE GENERATION FORM
    return(

    <View style={styles.container}>

      <Button  title="<- GO BACK HOME" onPress={() => {setPage(1)}} > CREATE </Button>

      <GenerateImageForm server_address={server_address} />

    </View>);

  }
  if(page==3){
  // LORA TRAINING FORM
    return(

      <View style={styles.container}>

        <Button  title="<- GO BACK HOME" onPress={() => {setPage(1)}} > CREATE </Button>

        <CreateLoraForm server_address={server_address} />

      </View>);

  }

}

/* --------------------------------------------------------------------------------------------------------------------------------------------------- |
> STYLE:
----------------------------------------------------------------------------------------------------------------------------------------------- Gladdo */

const WINDOW_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    margin: 10,
    width: '100%',
  }, 

});

