import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FormControl,
  Modal,
  Input,
  Button,
  VStack,
  Pressable,
  ScrollView,
  HStack,
} from "native-base";
import { MaterialIcons,Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { Alert,StyleSheet } from "react-native";

const db = SQLite.openDatabase("budgetPhoneApp.db");

function Expense() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedExpenseTab, setSelectedExpenseTab] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    createtable();
    getData();
  }, []);

  const onAddExpenseCategory = () => {
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
          ["expense", name],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
            alert("Successfully saved Category");
            setShowModal(false);
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
            "select * from Categorys WHERE type = 'expense'",
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
  const handleMoreOptions = (expense) => {
    setSelectedExpenseTab(expense);
    setShowOptionsModal(!showOptionsModal);
  };

  const handleUpdate = async () => {
    if (!selectedExpenseTab) {
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
          [name, selectedExpenseTab.id],
          () => {
            Alert.alert("Success!", "Your data has been updated.");
            setShowUpdateModal(false);
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
    if (!selectedExpenseTab) {
      return;
    }

    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Categorys WHERE id=?",
          [selectedExpenseTab.id],
          () => {
            Alert.alert("Success!", "Your data has been deleted.");
            setShowOptionsModal(false);
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

  return (
    <View>
      {category.map((cat) => (
        <HStack key={cat.id} justifyContent="space-between" mt={5}>
          <Text key={cat.id}>{cat.name}</Text>
          <Pressable onPress={() => handleMoreOptions(cat)}>
                <MaterialIcons name="more-vert" size={24} color="black" />
            </Pressable>
        </HStack>
      ))}
      <ScrollView>

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
      <Pressable onPress={onAddExpenseCategory} style={styles.floatingButton}>
        <Ionicons name="add-circle" size={60} color="#1664A2" />
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
}

export default Expense;

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
