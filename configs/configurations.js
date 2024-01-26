import { Dimensions } from 'react-native'

export const settings = {
    //'server-address' : "windu.micc.unifi.it:8007",
    'server-address' : "192.168.1.26:8000",
    'api_url' : "diffusers_api", 
    'image_generation_url' : "/diffusers_api/generate_image",
    'lora_training_url' : "/diffusers_api/lora_training"
}

export const server_queries = {
    'get_poi_images' : "/diffusers_api/get_poi_images?poi=",
    'check_lora_code' : "/diffusers_api/check_lora_code?code=",
    'get_maps_data' : "/diffusers_api/get_maps_data"
}

export const colors = {
    'text_input_background_1' : "#cedeeb",
    'text_input_background_2' : "#e0f1ff",
    'text_input_text_color' : "",
    'text_color' : "#e0f1ff",
    'lightest': "#35b0fc",
    'light' : '#3a87cf',
    'medium' : "#3e69ad",
    'medium_secondary' : "#4492eb",
    'dark' : "#314666",
    'darkest' : "#1c3254"
}

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const bottomSafeArea = 24

export const text_size = {
    'small': 16,
    'medium': 20,
    'big': 32
}

// ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* MAP SETUP */
// ------------------------------------------------------------------------------------------------------------------------- | 








