import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import { Text } from "react-native";
import RequestInviteScreen from "./src/screens/RequestInviteScreen";
import LandingScreen from "./src/screens/LandingScreen";
import RequestInviteSuccess from "./src/screens/RequestInviteSuccess";
import RegistrationScreen from "./src/screens/RegistrationScreen";
import TermsAndConditionsScreen from "./src/screens/TermsAndConditionsScreen";
import LoginScreen from "./src/screens/LoginScreen";

const prefix = Linking.makeUrl("/");

class AppNavigator extends Component {
  render() {
    const Stack = createStackNavigator();

    const linking = {
      prefixes: [prefix],
    };

    return (
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator initialRouteName="LandingScreen" headerMode={false}>
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen
            name="RequestAnInvite"
            component={RequestInviteScreen}
          />
          <Stack.Screen
            name="RequestInviteSuccess"
            component={RequestInviteSuccess}
          />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
          />
          <Stack.Screen
            name="TermsAndConditionsScreen"
            component={TermsAndConditionsScreen}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default AppNavigator;
