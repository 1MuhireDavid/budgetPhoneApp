import * as React from "react";
import MainContainer from "./navigation/MainContainer";
import { NativeBaseProvider } from "native-base";
import AuthNavigator from "./navigation/AuthNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, Text } from "react-native";

export default function App() {
  
  return (
    <NavigationContainer>
    <NativeBaseProvider>
      <AuthNavigator />
    </NativeBaseProvider>
    </NavigationContainer>
    
  );
}

