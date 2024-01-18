import * as React from "react";
import MainContainer from "./navigation/MainContainer";
import { NativeBaseProvider } from "native-base";
import LoginScreen from "./navigation/screens/LoginScreen";
import SignUpScreen from "./navigation/screens/SignUpScreen";
export default function App() {
  return (
    <NativeBaseProvider>
      <MainContainer/>
    </NativeBaseProvider>
    
  );
}

