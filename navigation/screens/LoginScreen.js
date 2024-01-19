import {
  VStack,
  Box,
  Heading,
  Input,
  Button,
  Pressable,
  Text,
} from "native-base";
import React, { useState } from "react";
import Colors from "../color.js";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import SignUpScreen from "./SignUpScreen.js";
import { TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("budgetPhoneApp.db");

function LoginScreen(props) {
  const [username1, setUsername1] = useState("");
  const [password1, setpassword1] = useState("");
  const {navigation} = props;

  const handleLogin = async () => {
    console.log(username1, "username");
 if(username1 =="" && password1 =="" ){
  return 
 }
 try {
  // Query the database to check for matching credentials
  await db.transaction((tx) => {
      tx.executeSql(
          "SELECT * FROM Users WHERE email = ? AND password = ?",
          [username1, password1],
          (txObj, resultSet) => {
              if (resultSet.rows._array.length > 0) {
                  // Successful login
                  console.log("Login successful");
                  // Navigate to the MainContainer screen
                  navigation.navigate("MainContainer", { name: username1 });
              } else {
                  // Invalid credentials
                  alert("Invalid username or password");
              }
          }
      );
  });
} catch (error) {
  console.error("Error during login:", error);
}

 
};

  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Heading> Login</Heading>
      <VStack space={5} pt="6">
        {/* EMAIL */}
        <Input
          InputLeftElement={
            <MaterialIcons name="email" size={20} color="black" />
          }
          onChangeText={(name)=>setUsername1(name)}
          variant="underlined"
          placeholder="user@gmail.com"
          w="70%"
          pl={2}
        />
        {/* PASSWORD */}
        <Input
          InputLeftElement={<Ionicons name="eye" size={20} color="black" />}
          type="password1"
          variant="underlined"
          placeholder="********"
          w="70%"
          pl={2}
          onChangeText={(password1)=>setpassword1(password1)}
        />
      </VStack>
      <Button
        my={30}
        w="40%"
        rounded={50}
        bg={"#1E88E5"}
        onPress={handleLogin}
      >
        Login
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text>Move to Signup Screen</Text>
      </TouchableOpacity>
    </Box>
  );
}

export default LoginScreen;
LoginScreen.navigationOptions = {
  headerLeft: null, // Hides the back button
};