import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FormControl,
  Modal,
  Divider,
  Input,
  HStack,
  Image,
  Pressable,
  Button,
  VStack,
  ScrollView,
} from "native-base";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { StyleSheet } from "react-native";

const db = SQLite.openDatabase("budgetPhoneApp.db");
function Income() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);




  useEffect(() => {
    createtable();
    getData();
  }, []);



  const onAddIncomeCategory = () => {
    setShowModal(true);
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
            setShowModal(false); // Close the modal
          },
          (txObj, error) => console.log("Error", error)
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      await db.transaction(
        (tx) => {
          tx.executeSql("select * from Categorys WHERE type = 'income'", [], (_, results) => {
            //  console.log(results.rows._array);
            const categoryData = results.rows._array.map(row => ({
              id: row.id,
              name: row.name,
            }));
            setCategory(categoryData);

          });
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Text>Income</Text>
      <Pressable onPress={onAddIncomeCategory} style={styles.floatingButton}>
          <Ionicons name="add-circle" size={100} color="#43A047" />
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
  )
}

export default Income;

const styles = StyleSheet.create({
  floatingButton: {
    position: "relative",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    left: 300,
    top: 550,
  },
});