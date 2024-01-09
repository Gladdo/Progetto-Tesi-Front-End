import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Screen_PoiSelectionForm from './Screen_PoiSelectionForm';
import Screen_ShotSelectionForm from './Screen_ShotSelectionForm';
import Screen_SubjectSelectionForm from './Screen_SubjectSelectionForm';
import Screen_ImageGeneration from './Screen_ImageGeneration';
import Screen_Home from './Screen_Home';
import Screen_LoraForm from './Screen_LoraForm';
import Screen_CreatedCode from './Screen_CreatedCode';
import Screen_CheckCode from './Screen_CheckCode';
import Screen_CitySelection from './Screen_CitySelection';
import Screen_LoraTutorial from './Screen_LoraTutorial';

const ImageGenerationStack = createNativeStackNavigator();
const LoraTrainingStack  = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

export default function App() {

    const ImageGenerationStackContainer = () => {
        return(
            <ImageGenerationStack.Navigator screenOptions={{ headerShown: false }}>
                <ImageGenerationStack.Screen name="Screen_CitySelection" component={Screen_CitySelection} />
                <ImageGenerationStack.Screen name="Screen_PoiSelectionForm" component={Screen_PoiSelectionForm} />
                <ImageGenerationStack.Screen name="Screen_ShotSelectionForm" component={Screen_ShotSelectionForm} />
                <ImageGenerationStack.Screen name="Screen_SubjectSelectionForm" component={Screen_SubjectSelectionForm} />
                <ImageGenerationStack.Screen name="Screen_ImageGeneration" component={Screen_ImageGeneration} />
            </ImageGenerationStack.Navigator>
        )
    }

    const LoraTrainingStackContainer = () => {
        return(
            <LoraTrainingStack.Navigator screenOptions={{ headerShown: false }}>
                <LoraTrainingStack.Screen name="Screen_LoraTutorial" component={Screen_LoraTutorial} />
                <LoraTrainingStack.Screen name="Screen_LoraForm" component={Screen_LoraForm} />
                <LoraTrainingStack.Screen name="Screen_CreatedCode" component={Screen_CreatedCode} />                
            </LoraTrainingStack.Navigator>
        )
    }
    

    return (
        <NavigationContainer>
            <MainStack.Navigator screenOptions={{ headerShown: false }}>
                <MainStack.Screen name="Screen_Home" component={Screen_Home}/>
                <MainStack.Screen name="ImageGenerationStackContainer" component={ImageGenerationStackContainer} />
                <MainStack.Screen name="LoraTrainingStackContainer" component={LoraTrainingStackContainer} />
                <MainStack.Screen name="Screen_CheckCode" component={Screen_CheckCode}/>
            </MainStack.Navigator>            
        </NavigationContainer>
    )

    

}