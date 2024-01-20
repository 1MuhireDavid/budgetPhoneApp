import {
  VStack,
  Box,
  Heading,
  Input,
  Button,
} from "native-base";
import React, { useEffect, useState,useRef } from "react";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { StyleSheet } from "react-native";
import * as Notifications from 'expo-notifications';



const db = SQLite.openDatabase("budgetPhoneApp.db");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setuserName] = useState("");
  const [users1, setUsers1] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // console.log(email, password, username);
  useEffect(() => {
    createtable();
    getData();
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };

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
            navigation.navigate("Login");
            schedulePushNotification("Account created successfully", username);
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

  async function schedulePushNotification(title, description) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: description,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }
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
