import { VStack, Box,Heading, Input, Button, Pressable,Text } from 'native-base';
import React from 'react';
import Colors from "../color.js";
import { MaterialIcons,Ionicons, FontAwesome } from '@expo/vector-icons';

function SignUpScreen() {
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Heading> Sign Up</Heading>
      <VStack space={5} pt="6">
        {/* USERNAME */}
        <Input
        InputLeftElement={
          <FontAwesome name="user" size={20} color="black" />
        }
        type='text'
        variant="underlined" placeholder="John Doe"
        w="70%"
        pl={2}
        />
        {/* EMAIL */}
        <Input
        InputLeftElement={
          <MaterialIcons name="email" size={20} color="black" />
        }
        type='email'
        variant="underlined" placeholder="user@gmail.com"
        w="70%"
        pl={2}
        />
        {/* PASSWORD */}
        <Input
        InputLeftElement={
          <Ionicons name="eye" size={20} color="black" />        }
        type='password'
        variant="underlined" placeholder="********"
        w="70%"
        pl={2}
        />
      </VStack>
      <Button my={30} w="40%" rounded={50} bg={"#1E88E5"}>
      SIGN UP
      </Button>
      <Pressable mt={4}>
        <Text color={Colors.blue}>
          Login
        </Text>
      </Pressable>
    </Box>
  )
}

export default SignUpScreen;
