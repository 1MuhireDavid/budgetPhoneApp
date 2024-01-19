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

function LoginScreen(props) {
  const [username, setName] = useState("");
  const [password, setpassword] = useState("");
  const {navigation} = props;
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Heading> Login</Heading>
      <VStack space={5} pt="6">
        {/* EMAIL */}
        <Input
          InputLeftElement={
            <MaterialIcons name="email" size={20} color="black" />
          }
          onChange={(name)=>setName(name)}
          variant="underlined"
          placeholder="user@gmail.com"
          w="70%"
          pl={2}
        />
        {/* PASSWORD */}
        <Input
          InputLeftElement={<Ionicons name="eye" size={20} color="black" />}
          type="password"
          variant="underlined"
          placeholder="********"
          w="70%"
          pl={2}
          onChange={(password)=>setpassword(password)}
        />
      </VStack>
      <Button
        my={30}
        w="40%"
        rounded={50}
        bg={"#1E88E5"}
        onPress={() => navigation.navigate("MainContainer",{name:username})}
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
