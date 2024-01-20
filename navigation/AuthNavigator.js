import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import MainContainer from './MainContainer';
const Signup = "Signup";
const Login = "Login";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName={Login}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="MainContainer" options={({ route }) =>({headerBackTitleVisible: false})}  component={MainContainer} />
    </Stack.Navigator>
  )
}
