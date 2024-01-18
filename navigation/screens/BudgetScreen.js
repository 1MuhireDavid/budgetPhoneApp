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
import Colors from "../color";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { StyleSheet } from "react-native";

function BudgetScreen() {
  const db = SQLite.openDatabase("budgetPhoneApp.db");

  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [account, setAccount] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    createtable();
    getData();
  }, []);

  const onAddBudget = () => {
    setShowModal(true);
  };

  const createtable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Budgets (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, value INTEGER, account TEXT, duration TEXT);"
      );
    });
  };
  const onSaveBuget = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Budgets (category, value, account, duration) values (?, ?, ?, ?)",
          [category, value, account, duration],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
            alert("Successfully saved Budget");
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
          tx.executeSql("select * from Budgets", [], (_, results) => {
            var len = results.rows.length;
            //  console.log(results.rows);

            if (len > 0) {
              var categoryValue = results.rows.item(0).category;
              var values = results.rows.item(0).value;
              var accountValue = results.rows.item(0).account;
              var durationValue = results.rows.item(0).duration;

              setCategory(categoryValue);
              setValue(values);
              setAccount(accountValue);
              setDuration(durationValue);
            }
          });
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ScrollView>
        <VStack
          space={3}
          w="full"
          mx={3}
          px={6}
          py={4}
          bgColor={Colors.white}
          color={Colors.black}
          mt={5}
        >
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
              Accounts
            </Text>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </HStack>
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
                Last used: 08/12/2023
              </Text>
            </VStack>
            <Text>$100.00</Text>
          </HStack>
          <Divider />
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
                Last used: 08/12/2023
              </Text>
            </VStack>
            <Text>$100.00</Text>
          </HStack>
        </VStack>
      </ScrollView>
      <Pressable onPress={onAddBudget} style={styles.floatingButton}>
        <Ionicons name="add-circle" size={100} color="#1664A2" />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Add Budget</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <FormControl.Label>Budget amount</FormControl.Label>
                <Input
                  type="number"
                  name="value"
                  onChangeText={(value) => setValue(value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Category</FormControl.Label>
                <Input
                  type="text"
                  name="category"
                  onChangeText={(category) => setCategory(category)}
                />
              </FormControl>
              <FormControl mt="3" isRequired>
                <FormControl.Label>Account</FormControl.Label>
                <Input
                  type="text"
                  name="account"
                  onChangeText={(account) => setAccount(account)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Duration</FormControl.Label>
                <Input
                  type="text"
                  name="duration"
                  onChangeText={(duration) => setDuration(duration)}
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
                <Button onPress={onSaveBuget}>Save</Button>
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

export default BudgetScreen;
