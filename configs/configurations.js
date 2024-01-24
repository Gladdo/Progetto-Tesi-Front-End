import { Dimensions } from 'react-native'

export const settings = {
    'server-address' : "windu.micc.unifi.it:8007",
    'api_url' : "diffusers_api", 
    'image_generation_url' : "/diffusers_api/generate_image",
    'lora_training_url' : "/diffusers_api/lora_training"
}

export const server_queries = {
    'get_poi_images' : "/diffusers_api/get_poi_images?poi=",
    'check_lora_code' : "/diffusers_api/check_lora_code?code="
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

const server_address = "http://" + settings['server-address']
const florence_map_media_path = "/data/poi_maps/florence"
const rome_map_media_path = "/data/poi_maps/rome"

export const FLORENCE_AREA_CARDS = [
    /*AREA0*/   { 
                    canvas_position: {x: 0, y: 0}, 
                    markers:    [
                                    {position: {x: 63, y: -220}, value: "duomo", popup_image: server_address + florence_map_media_path + "/overviews/overview_duomo.jpg" }, 
                                    {position: {x: -10, y: 80}, value: "piazza_della_signoria", popup_image: server_address + florence_map_media_path + "/overviews/overview_piazza_della_signoria.jpg"},
                                    {position: {x: 50, y:100}, value: "palazzo_vecchio", popup_image: server_address + florence_map_media_path + "/overviews/overview_palazzo_vecchio.jpg" },
                                    {position: {x: -125, y:245}, value: "uffizi", popup_image: server_address + florence_map_media_path + "/overviews/overview_uffizi.jpg" },
                                ],

                    background_image: server_address + florence_map_media_path + "/1_florence.png" ,
                    connected_areas: [1, 2, 3]
                }, 
    /*AREA1*/   {
                    canvas_position: {x: -SCREEN_WIDTH*2, y: SCREEN_HEIGHT*2}, 
                    markers:    [
                                    {position: {x: 110, y: -200}, value: "ponte_vecchio" , popup_image: server_address + florence_map_media_path + "/overviews/overview_ponte_vecchio.jpeg"},
                                    {position: {x: -145, y: -20}, value: "palazzo_pitti", popup_image: server_address + florence_map_media_path + "/overviews/overview_palazzo_pitti.jpg" },
                                    {position: {x: 15, y: 190}, value: "boboli", popup_image: server_address + florence_map_media_path + "/overviews/overview_boboli.jpg" },
                                ], 
                    background_image: server_address + florence_map_media_path + "/2_florence.png",
                    connected_areas: [0, 2]
                },
    /*AREA2*/   {   
                    canvas_position: {x: SCREEN_WIDTH, y: SCREEN_HEIGHT*2}, 
                    markers:    [
                                     {position: {x: 73, y: 234}, value: "piazzale_michelangelo", popup_image: server_address + florence_map_media_path + "/overviews/overview_piazzale_michelangelo.jpg" },
                                     {position: {x: -80, y: -160}, value: "basilica_di_santa_croce", popup_image: server_address + florence_map_media_path + "/overviews/overview_santa_croce.jpg" },
                                ], 
                    background_image: server_address + florence_map_media_path + "/3_florence.png",
                    connected_areas: [0, 1] 
                },
    /*AREA3*/   {   
                    canvas_position: {x: 0, y: -SCREEN_HEIGHT*2}, 
                    markers:    [
                                    {position: {x: 0, y: 60}, value: "galleria_della_accademia", popup_image: server_address + florence_map_media_path + "/overviews/overview_galleria_della_accademia.jpg" },
                                ], 
                    background_image: server_address + florence_map_media_path + "/4_florence.png",
                    connected_areas: [0] 
                }
]

export const ROME_AREA_CARDS = [
    /*AREA0*/   { 
                    canvas_position: {x: 0, y: 0}, 
                    markers:    [
                                    {position: {x: 110, y: 135}, value: "piazza_venezia", popup_image: server_address + rome_map_media_path + "/overviews/overview_piazza_venezia.jpg" },
                                    {position: {x: -150, y: -15}, value: "pantheon", popup_image: server_address + rome_map_media_path + "/overviews/overview_pantheon.jpg" },
                                    {position: {x: 115, y: -100}, value: "fontana_di_trevi", popup_image: server_address + rome_map_media_path + "/overviews/overview_fontana_di_trevi.jpg" },
                                ],

                    background_image: server_address + rome_map_media_path + "/1_rome.png" ,
                    connected_areas: [1, 2, 4]
                }, 
    /*AREA1*/   {
                    canvas_position: {x: SCREEN_WIDTH*2, y: SCREEN_HEIGHT/2}, 
                    markers:    [
                                    {position: {x: 130, y: 10}, value: "colosseo", popup_image: server_address + rome_map_media_path + "/overviews/overview_colosseo.jpg" },
                                    {position: {x: -65, y: 15}, value: "foro_romano", popup_image: server_address + rome_map_media_path + "/overviews/overview_foro_romano.jpg" },
                                ], 
                    background_image: server_address + rome_map_media_path + "/2_rome.png",
                    connected_areas: [0, 5]
                },
    /*AREA2*/   {   
                    canvas_position: {x: -2*SCREEN_WIDTH, y: -SCREEN_HEIGHT/2}, 
                    markers:    [
                                    {position: {x: -10, y: 50}, value: "castel_sant_angelo", popup_image: server_address + rome_map_media_path + "/overviews/overview_castel_sant_angelo.jpg" },
                                ], 
                    background_image: server_address + rome_map_media_path + "/3_rome.png",
                    connected_areas: [0, 3] 
                },
    /*AREA3*/   {   
                    canvas_position: {x: -4*SCREEN_WIDTH, y: -SCREEN_HEIGHT/2 }, 
                    markers:    [
                                    {position: {x: 40, y: 160}, value: "basilica_di_san_pietro", popup_image: server_address + rome_map_media_path + "/overviews/overview_basilica_di_san_pietro.jpg" },
                                    {position: {x: -90, y: -80}, value: "musei_vaticani", popup_image: server_address + rome_map_media_path + "/overviews/overview_musei_vaticani.jpg" },
                                ], 
                    background_image: server_address + rome_map_media_path + "/4_rome.png",
                    connected_areas: [2] 
                },
    /*AREA4*/   {   
                    canvas_position: {x: SCREEN_WIDTH, y: -SCREEN_HEIGHT*2}, 
                    markers:    [
                                    {position: {x: 15, y: 70}, value: "villa_borghese", popup_image: server_address + rome_map_media_path + "/overviews/overview_villa_borghese.jpg" },
                                ], 
                    background_image: server_address + rome_map_media_path + "/5_rome.png",
                    connected_areas: [0] 
                },
    /*AREA5*/   {   
                    canvas_position: {x: SCREEN_WIDTH*4, y: SCREEN_HEIGHT}, 
                    markers:    [
                                    {position: {x: 10, y: 45}, value: "basilica_di_san_giovanni", popup_image: server_address + rome_map_media_path + "/overviews/overview_basilica_di_san_giovanni.jpg" },
                                ], 
                    background_image: server_address + rome_map_media_path + "/6_rome.png",
                    connected_areas: [1] 
                }
]

export const CITIES_CARDS = [FLORENCE_AREA_CARDS, ROME_AREA_CARDS];



