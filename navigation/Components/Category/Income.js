import React, { useEffect, useState,useRef } from "react";
import {
  Text,
  View,
  FormControl,
  ScrollView,
  Modal,
  Input,
  Button,
  VStack,
  Pressable,
  HStack,
} from "native-base";
import { MaterialIcons,Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { Alert,StyleSheet } from "react-native";
import * as Notifications from 'expo-notifications';

const db = SQLite.openDatabase("budgetPhoneApp.db");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const Income = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedIncomeTab, setSelectedIncomeTab] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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

  const onAddIncomeCategory = () => {
    setShowModal(!showModal);
  };

  const createtable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Categorys (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT, name TEXT);"
      );
    });
  };

  const onSaveCategory = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Categorys (type, name) values (?, ?)",
          ["income", name],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
            alert("Successfully saved category");
            setShowModal(false);
            schedulePushNotification("Income category created", "Successfully saved new Income category");
          },
          (txObj, error) => console.log("Error", error)
        );
        // After saving the category, fetch the updated data
        getData();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      await db.transaction(
        (tx) => {
          tx.executeSql(
            "select * from Categorys WHERE type = 'income'",
            [],
            (_, results) => {
              const categoryData = results.rows._array.map((row) => ({
                id: row.id,
                name: row.name,
              }));
              setCategory(categoryData);
            }
          );
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
    } catch (error) {
      console.log(error);
    }
  }; 
  const handleMoreOptions = (income) => {
    setSelectedIncomeTab(income);
    setShowOptionsModal(!showOptionsModal);
  };

  const handleUpdate = async () => {
    if (!selectedIncomeTab) {
      return;
    }

    // Set the state to open the second modal for updating
    setShowUpdateModal(!showUpdateModal);
  };

  const performUpdate = async () => {
    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Categorys SET name=? WHERE id=?",
          [name,  selectedIncomeTab.id],
          () => {
            Alert.alert("Success!", "Your data has been updated.");
            setShowUpdateModal(false);
            setShowOptionsModal(!showOptionsModal);
            schedulePushNotification("Income category updated", "Successfully updated Income category");
            getData();
          },
          (error) => {
            console.log(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async () => {
    if (!selectedIncomeTab) {
      return;
    }

    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Categorys WHERE id=?",
          [selectedIncomeTab.id],
          () => {
            Alert.alert("Success!", "Your data has been deleted.");
            setShowOptionsModal(!showOptionsModal);
            schedulePushNotification("Income category removed", "Successfully removed Income category");
            getData();
          },
          (error) => {
            console.log(error);
          }
        );
      });
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
    <View>
      <ScrollView>
      {category.map((cat) => (
        <HStack key={cat.id} justifyContent="space-between" mt={5}>
          <Text key={cat.id}>{cat.name}</Text>
          <Pressable onPress={() => handleMoreOptions(cat)}>
                <MaterialIcons name="more-vert" size={24} color="black" />
            </Pressable>
        </HStack>
      ))}
      </ScrollView>

      <Modal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
      >
        <Modal.Content maxWidth="300px">
          <Modal.CloseButton />
          <Modal.Body>
            <VStack space={4}>
              <Pressable onPress={handleUpdate}>
                <Text fontSize="lg">Update</Text>
              </Pressable>
              <Pressable onPress={handleRemove}>
                <Text fontSize="lg" color="red.500">
                  Remove
                </Text>
              </Pressable>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {showUpdateModal && (
        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        >
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Update Income category</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <FormControl.Label>Name</FormControl.Label>
                <Input
                  type="text"
                  name="name"
                  onChangeText={(name) => setName(name)}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowUpdateModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onPress={performUpdate}>Update</Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}


      <Pressable onPress={onAddIncomeCategory} style={styles.floatingButton}>
        <Ionicons name="add-circle" size={60} color="#43A047" />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Create new category</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <FormControl.Label>name</FormControl.Label>
                <Input
                  type="text"
                  name="name"
                  onChangeText={(name) => setName(name)}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onPress={onSaveCategory}>Save</Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Pressable>
    </View>
  );
};

export default Income;

const styles = StyleSheet.create({
  floatingButton: {
    position: "relative",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    left: 290,
    top: 450,
  },
});
