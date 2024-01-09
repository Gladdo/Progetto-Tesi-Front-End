import { TouchableWithoutFeedback, Image, View, Animated} from 'react-native'

export default function Component_Map_Markers_Manager(props){
  

  let magnified_markers = props.magnified_markers;

  const FRAME_WIDTH = props.width;
  const FRAME_HEIGHT = props.height;

  const MARKER_SIZE = 70;
  const ORIGINAL_IMAGE_PIXELS = 1000;

  let markers = props.markers;

  /* RENDERING MARKERS */
  let rendered_markers = [];
  let rendered_markers_opacity = []; 
  let rendered_markers_scale = []; 

  const marker_img = require('../resources/icons/marker.png')
  const marker_back_img = require('../resources/icons/marker_bord.png')

  let MarkerSelection = (index) => {      
    props.onMarkerSelection(markers[index]);        
  }

  // ------------------------------------------------------------------------------------------------------------------------- |
                      /* LOOP PER IL RENDERING DEI MARKERS SULL'UI */
  // ------------------------------------------------------------------------------------------------------------------------- | 
   
  for(var i = 0; i < markers.length; i++){
    rendered_markers_opacity.push(new Animated.Value(1));
    rendered_markers_scale.push(new Animated.Value(1));

    const itemIndex = i;

    rendered_markers.push(

      <TouchableWithoutFeedback key={i} onPress={() => { MarkerSelection(itemIndex)}} >

            <Animated.View 
                style={{ 
                    position: 'absolute',
                    height: MARKER_SIZE, 
                    width: MARKER_SIZE, 
                    left: FRAME_WIDTH/2 + (markers[i].position.x/(ORIGINAL_IMAGE_PIXELS * FRAME_WIDTH/FRAME_HEIGHT )) * FRAME_WIDTH - MARKER_SIZE/2,
                    top: FRAME_HEIGHT/2 + (markers[i].position.y/ORIGINAL_IMAGE_PIXELS) * FRAME_HEIGHT - MARKER_SIZE,

                    transform: [{ scaleX: rendered_markers_scale[itemIndex]}, {scaleY: rendered_markers_scale[itemIndex]}]
            }}>

                <Image  style={{position: 'absolute', width: '100%', height:'100%'}} source={marker_back_img} />
                <Image  style={{position: 'absolute', width: '100%', height:'100%'}} source={marker_img} />

            </Animated.View >

        </TouchableWithoutFeedback>
      
    )
  }

  // ------------------------------------------------------------------------------------------------------------------------- |
                  /* SE NESSUN MARKER E' STATO SELEZIONATO, UTILIZZA LE SEGUENTI ANIMAZIONI PER IL RENDERING */
  // ------------------------------------------------------------------------------------------------------------------------- | 

  if(!magnified_markers){
    for(var i = 0; i < markers.length; i++){

      Animated.sequence([
        Animated.timing(rendered_markers_scale[i], {
          toValue: 0.2,
          duration: 0,
          useNativeDriver: false
        }),
        Animated.timing(rendered_markers_scale[i], {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false
        }),
      ]).start();
    Animated.sequence([
        Animated.timing(rendered_markers_opacity[i], {
            toValue: 0.1,
            duration: 0,
            useNativeDriver: false
        }),
        Animated.timing(rendered_markers_opacity[i], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false
        }),
      ]).start();
    }

  // ------------------------------------------------------------------------------------------------------------------------- |
                  /* ALTRIMETNI, SE E' STATO SELEZIONATO UN MARKER, UTILIZZA LE SEGUENTI ANIMAZIONI */
  // ------------------------------------------------------------------------------------------------------------------------- | 

  }else{

    for(var i = 0; i < markers.length; i++){

      Animated.sequence([
        Animated.timing(rendered_markers_scale[i], {
          toValue: 0.6,
          duration: 0,
          useNativeDriver: false
        }),
        Animated.timing(rendered_markers_scale[i], {
          toValue: 2,
          duration: 1000,
          useNativeDriver: false
        }),
        Animated.timing(rendered_markers_scale[i], {
          toValue: 0,
          duration: 0,
          useNativeDriver: false
        })
      ]).start();
      
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------- |
                                                    /* RENDERING */
  // ------------------------------------------------------------------------------------------------------------------------- | 

  return ( 
      <View>

        <Animated.View style={{opacity: 1}}>

              {rendered_markers}

        </Animated.View>
      
      </View>
  )
    
}

