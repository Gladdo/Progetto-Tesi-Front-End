
import { StatusBar, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { colors, text_size, SCREEN_WIDTH } from '../configs/configurations'

export function Component_Status_Bar  (){

    return(
        <View style={{
            elevation: 20, 
            zIndex: 5, 
            width: SCREEN_WIDTH, 
            backgroundColor: colors['darkest'], 
            height: StatusBar.currentHeight
        }}>
                
            <Text>STATUS BAR</Text>
    
        </View>
    )

}

export function Component_Header1_Bar(props){
    
    return(
        <View style={{ backgroundColor: colors['light'], width: "100%", height: '100%', alignContent: 'center', justifyContent: 'center', borderBottomWidth: 5, borderTopWidth: 5, borderColor: colors['dark']}}>

            <Text style={{fontWeight: 'bold', textAlign: 'center', color: colors['text_color'] , fontSize: 32}}> {props.text} </Text>

        </View>
    )

}

export function Component_Header2_Bar(props){
    
    return(

        <View> 

            <Text style={{fontWeight: 'bold', textAlign: 'center', color: colors['text_color'], fontSize: 20}}> {props.text} </Text>

        </View>

    )

}

export function Component_Row_Button(props){

    return(

        <TouchableOpacity onPress={ () => { props.onPress() }} style={{width: "100%", height:"100%", borderBottomWidth: 4, borderTopWidth: 4, borderColor: colors['dark'], backgroundColor: colors['lightest'], justifyContent: 'center' }}>
                        
            <Text style={{fontWeight: 'bold', textAlign: 'center', color: colors['text_color'] , fontSize: 32}}> {props.text} </Text>

        </TouchableOpacity> 
    )
}

export function Component_Text_Input(props){

    return(

        <View style={{ width: '100%', height: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: colors['text_input_background_1'], borderTopWidth: 3, borderBottomWidth: 3, borderColor: colors['dark']}}>
                    
            <View style={{ paddingLeft: 10, paddingRight: 10, width: '100%', height: '100%', backgroundColor: colors['text_input_background_2']}}>
        
                <TextInput 
                    onChangeText={(text) => { props.onChangeText(text) }}
                    placeholder={props.placeholder}
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={140}
                    
                    style={{ maxHeight: '100%', color: colors['dark'], fontWeight: 'bold', fontSize: text_size['small']}}>  
                
                </TextInput>
                
            </View>
        
        </View>
    )
    
    // old color: #e0f1ff
}