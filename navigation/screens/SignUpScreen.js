import {
  VStack,
  Box,
  Heading,
  Input,
  Button,
} from "native-base";
import React, { useEffect, useState } from "react";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { StyleSheet } from "react-native";

const db = SQLite.openDatabase("budgetPhoneApp.db");

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setuserName] = useState("");
  const [users1, setUsers1] = useState([]);

  // console.log(email, password, username);
  useEffect(() => {
    createtable();
    getData();
  }, []);

  const createtable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT);"
      );
    });
  };
  const onSaveUser = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Users (email, password, username) values (?, ?, ?)",
          [email, password, username],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
            alert("Successfully saved new account");
            navigation.navigate("Login", { username });
          },
          (txObj, error) => console.log("Error", error)
        );
      });
      // console.log("onsave");
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      await db.transaction(
        (tx) => {
          tx.executeSql("select * from Users", [], (_, results) => {
            const userData = results.rows._array.map((row) => ({
              id: row.id,
              username: row.username,
              email: row.email,
              password: row.password,
            }));
            setUsers1(userData);
          });
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Heading> Sign Up</Heading>
      <VStack space={5} pt="6">
        {/* USERNAME */}
        <Input
          InputLeftElement={<FontAwesome name="user" size={20} color="#1E88E5" />}
          type="text"
          variant="underlined"
          placeholder="John Doe"
          w="70%"
          pl={2}
          name="username"
          onChangeText={(username) => setuserName(username)}
        />
        {/* EMAIL */}
        <Input
          InputLeftElement={
            <MaterialIcons name="email" size={30} color="#1E88E5" />
          }
          type="email"
          variant="underlined"
          placeholder="user@gmail.com"
          w="70%"
          pl={2}
          name="email"
          onChangeText={(email) => setEmail(email)}
        />
        {/* PASSWORD */}
        <Input
          InputLeftElement={<Ionicons name="eye" size={30} color="#1E88E5" />}
          type="password"
          variant="underlined"
          placeholder="********"
          w="70%"
          pl={2}
          name="password"
          onChangeText={(password) => setPassword(password)}
        />
      </VStack>
      <Button my={30} w="40%" rounded={50} bg={"#1E88E5"} onPress={onSaveUser}>
        SIGN UP
      </Button>

      <Button my={30} w="40%" rounded={50} bg={"#1E88E5"} onPress={() => navigation.navigate("Login")}>
        Login
      </Button>
    </Box>
  );
}

export default SignUpScreen;
