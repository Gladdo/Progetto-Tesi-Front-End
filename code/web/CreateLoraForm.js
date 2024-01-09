import React from 'react';
import { Linking, StyleSheet, View, Button} from 'react-native';

export default function CreateLoraForm(props){

    return(

        <View style={styles.form_container}>

            <View style={styles.button}>

                <Button title="REDIREC TO LORA UPLOAD PAGE"onPress={()=>{Linking.openURL("http://" + props.server_address + "/diffusers_api/lora_training")}} > REDIRECT </Button>
            
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
  
    form_container: {
      width: '80%',
      height: 200,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    button: {
      width: '100%',
      backgroundColor: 'red',
    }, 
  
  });