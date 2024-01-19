import React, { useEffect, useState } from "react";
import {
  Text,
  VStack,
  Modal,
  Divider,
  Input,
  Pressable,
  Button,
  ScrollView,
  FormControl,
  HStack,
} from "native-base";
import Colors from "../color";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { Alert, StyleSheet } from "react-native";

const db = SQLite.openDatabase("budgetPhoneApp.db");

function AccountScreen() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    createTable();
    getData();
  }, []);

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value INTEGER, notes TEXT);"
      );
    });
  };

  const onSaveAccount = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "INSERT INTO Accounts (name, value, notes) VALUES (?, ?, ?)",
          [name, value, notes],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
            alert("Successfully saved new account");
            setShowModal(false);
            getData();
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
          tx.executeSql("SELECT * FROM Accounts", [], (_, results) => {
            const accountData = results.rows._array.map((row) => ({
              id: row.id,
              name: row.name,
              value: row.value,
              notes: row.notes,
            }));
            setAccounts(accountData);
          });
        },
        (txObj, error) => console.log("Error", error, "getData")
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoreOptions = (account) => {
    setSelectedAccount(account);
    setShowOptionsModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedAccount) {
      return;
    }

    // Set the state to open the second modal for updating
    setShowUpdateModal(true);
  };

  const performUpdate = async () => {
    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Accounts SET name=?, value=?, notes=? WHERE id=?",
          [name, value, notes, selectedAccount.id],
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
    if (!selectedAccount) {
      return;
    }

    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Accounts WHERE id=?",
          [selectedAccount.id],
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

  const onAddAccount = () => {
    setName("");
    setValue("");
    setNotes("");
    setShowModal(true);
  };

  return (
    <>
      <ScrollView>
        {accounts.map((account) => (
          <VStack
            key={account.id}
            space={3}
            w="full"
            mx={3}
            px={6}
            py={4}
            bgColor={Colors.white}
            color={Colors.black}
            mt={5}
          >
            <Pressable onPress={() => handleMoreOptions(account)}>
              <HStack justifyContent="space-between" color={"green"}>
                <Text
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _text={{
                    fontWeight: "extrabold",
                    fontSize: 32,
                    color: "green",
                    lineHeight: 40,
                  }}
                >
                  {account.name}
                </Text>
                <MaterialIcons name="more-vert" size={24} color="black" />
              </HStack>
            </Pressable>

            <HStack justifyContent="space-between" color={"green"}>
              <VStack>
                <Text
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _text={{
                    fontWeight: "extrabold",
                    fontSize: 32,
                    color: "green",
                    lineHeight: 40,
                  }}
                >
                  Wallet
                </Text>
                <Text
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    Notes:
                  </Text>{" "}
                  {account.notes}
                  {"\n"}
                  <Text
                    style={{
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  ></Text>{" "}
                </Text>
              </VStack>
              <Text style={{ textAlign: "right" }}>${account.value}</Text>
            </HStack>
            <Divider />
          </VStack>
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
            <Modal.Header>Update Account</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <FormControl.Label>Name</FormControl.Label>
                <Input
                  type="text"
                  name="name"
                  onChangeText={(name) => setName(name)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Initial amount</FormControl.Label>
                <Input
                  type="number"
                  name="value"
                  onChangeText={(value) => setValue(value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Notes</FormControl.Label>
                <Input
                  type="text"
                  name="notes"
                  onChangeText={(notes) => setNotes(notes)}
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

      <Pressable onPress={onAddAccount} style={styles.floatingButton}>
        <Ionicons name="add-circle" size={100} color="#1664A2" />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Create new account</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <FormControl.Label>name</FormControl.Label>
                <Input
                  type="text"
                  name="name"
                  onChangeText={(name) => setName(name)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Initial amount</FormControl.Label>
                <Input
                  type="number"
                  name="value"
                  onChangeText={(value) => setValue(value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Notes</FormControl.Label>
                <Input
                  type="text"
                  name="notes"
                  onChangeText={(notes) => setNotes(notes)}
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
                <Button onPress={onSaveAccount}>Save</Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 50,
  },
});

export default AccountScreen;
