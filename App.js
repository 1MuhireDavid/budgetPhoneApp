import * as React from "react";
import MainContainer from "./navigation/MainContainer";
import { NativeBaseProvider } from "native-base";


export default function App() {
  return (
    <NativeBaseProvider>
      <MainContainer/>
    </NativeBaseProvider>
    
  );
}

