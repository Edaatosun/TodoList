import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import login from "./Screens/login";
import signUp from "./Screens/signUp";
import changePassword from "./Screens/changePassword";
import mainPage from "./Screens/mainPage";
import details from "./Screens/details";
import Profile from "./Screens/profile";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false, gestureEnabled: false,}} >
      <Stack.Screen name = "Login" component={login}></Stack.Screen>
        <Stack.Screen name = "SignUp" component={signUp}></Stack.Screen>
        <Stack.Screen name = "ChangePassword" component={changePassword}></Stack.Screen>
        <Stack.Screen name = "MainPage" component={mainPage}></Stack.Screen>
        <Stack.Screen name = "Details" component={details}></Stack.Screen>
        <Stack.Screen name = "Profile" component={Profile}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


