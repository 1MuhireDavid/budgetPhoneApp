import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  DatePickerIOS,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { CheckIcon, Select } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import {
  FormControl,
  Modal,
  Divider,
  Input,
  HStack,
  Image,
  Pressable,
  Button,
  VStack,
} from "native-base";
import Colors from "../color";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("budgetPhoneApp.db");

export default function HomeScreen({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showPicker, setShowpicker] = useState(false);
  const [showPicker1, setShowpicker1] = useState(false);
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState(new Date());
  const [dateOftransaction, setDateOfTransaction] = useState("");
  const [froms, setFrom] = useState("");
  const [notes, setNotes] = useState("");
  const [tos, setTos] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [incomeCategory, setIncomeCategory] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    createTable();
    fetchData();
  }, []);

  const onAddIncome = () => {
    setShowModal(true);
  };
  const onAddExpense = () => {
    setShowModal1(true);
  };
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, category INTEGER, value INTEGER, account INTEGER, date TEXT NULL, froms TEXT NULL, tos TEXT NULL, notes TEXT NULL);"
      );
    });
    console.log("table transaction created", "trans");
  };
  const onSaveIncome = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Transactions (type, category, value, account, date, froms, notes) values (?, ?, ?, ?, ?, ?, ?)",
          ["income", category, value, account, dateOftransaction, froms, notes],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
          },
          (txObj, error) => console.log("Error", error, "onSaveIncome")
        );

        // Update the account balance
        const accountId = account; // Assuming account is the ID
        const currentBalance = await tx.executeSql(
          "SELECT value FROM Accounts WHERE id = ?",
          [accountId]
        );
        const newBalance = currentBalance + parseFloat(value);
        await tx.executeSql("UPDATE Accounts SET value = ? WHERE id = ?", [
          newBalance,
          accountId,
        ]);
      });

      setShowModal(false); // Close the modal
      alert("Successfully saved Income");
    } catch (error) {
      console.log(error);
    }
  };
  const onSaveExpense = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Transactions (type, category, value, account, date, tos, notes) values (?, ?, ?, ?, ?, ?, ?)",
          ["expense", category, value, account, dateOftransaction, tos, notes],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
          },
          (txObj, error) => console.log("Error", error)
        );

        // Update the account balance
        const accountId = account; // Assuming account is the ID
        const currentBalance = await tx.get(
          "SELECT value FROM Accounts WHERE id = ?",
          [accountId]
        );
        const newBalance = currentBalance - parseFloat(value);
        await tx.executeSql("UPDATE Accounts SET value = ? WHERE id = ?", [
          newBalance,
          accountId,
        ]);
      });

      setShowModal(false); // Close the modal
      alert("Successfully saved Expense");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      await db.transaction(
        (tx) => {
          tx.executeSql(
            "select * from Categorys WHERE type = 'expense'",
            [],
            (_, results) => {
              console.log(results.rows._array);
              const categoryData = results.rows._array.map((row) => ({
                id: row.id,
                name: row.name,
              }));
              setExpenseCategory(categoryData);
            }
          );
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
      await db.transaction(
        (tx) => {
          tx.executeSql(
            "select * from Categorys WHERE type = 'income'",
            [],
            (_, results) => {
              //  console.log(results.rows._array);
              const categoryData = results.rows._array.map((row) => ({
                id: row.id,
                name: row.name,
              }));
              setIncomeCategory(categoryData);
            }
          );
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
      await db.transaction(
        (tx) => {
          tx.executeSql("select * FROM Accounts", [], (_, results) => {
            //  console.log(results.rows._array);
            const accountData = results.rows._array.map((row) => ({
              id: row.id,
              name: row.name,
              value: row.value,
              notes: row.notes,
            }));
            setAccounts(accountData);
            console.log(accountData);
          });
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDatePicker = () => {
    setShowpicker(!showPicker);
  };
  const toggleDatePicker1 = () => {
    setShowpicker1(!showPicker1);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfTransaction(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };

  return (
    <>
      <ScrollView overflow="hidden">
        <View style={{ margin: 20 }}>
          <LinearGradient colors={["#9440FD", "#6B47F8"]}>
            <View style={{ height: 60, width: 100 }}>
              <Text style={{ color: "black", display: "flex", fontSize: 17 }}>
                {" "}
                Buget Tracker
              </Text>
            </View>
          </LinearGradient>
        </View>
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
            <Text style={{ color: "#f4511e" }}>Accounts</Text>
            <Text style={{ color: "#f4511e" }}>Last Used</Text>
          </HStack>

          {accounts.map((account) => (
            <VStack key={account.id}>
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
                    {account.name}
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
                  ></Text>
                </VStack>
                <Text>{account.value},Frw</Text>
              </HStack>
              <Divider />
            </VStack>
          ))}
        </VStack>
      </ScrollView>
      <Pressable onPress={onAddIncome} style={styles.floatingButton}>
        <Ionicons name="add-circle" size={100} color="#2EB432" />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Add Income</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <FormControl.Label>category</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Category"
                  placeholder="Choose Category"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(id) => setCategory(id)}
                >
                  {incomeCategory.map((category) => (
                    <Select.Item
                      key={category.id}
                      label={category.name}
                      value={category.id}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>value</FormControl.Label>
                <Input
                  type="number"
                  name="value"
                  onChangeText={(value) => setValue(value)}
                />
              </FormControl>
              <FormControl mt="3" isRequired>
                <FormControl.Label>account</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Account"
                  placeholder="Choose Account"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(id) => setAccount(id)}
                >
                  {accounts.map((account) => (
                    <Select.Item
                      key={account.id}
                      label={account.name}
                      value={account.id}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>date</FormControl.Label>
                {showPicker && (
                  <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={onChange}
                  />
                )}
                {!showPicker && (
                  <Pressable onPress={toggleDatePicker}>
                    <TextInput
                      value={dateOftransaction}
                      name="dateOftransaction"
                      placeholder="Sat Aug 21 2004"
                      editable={false}
                      onChangeText={setDateOfTransaction}
                    />
                  </Pressable>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>from</FormControl.Label>
                <Input
                  type="text"
                  isDisabled={true}
                  name="froms"
                  onChangeText={(froms) => setFrom(froms)}
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>notes</FormControl.Label>
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
                <Button onPress={onSaveIncome}>Save</Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Pressable>
      <Pressable onPress={onAddExpense} style={styles.expenseButton}>
        <FontAwesome name="minus-circle" size={100} color="#FF1D0D" />
        <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Add Expenses</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <FormControl.Label>category</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Category"
                  placeholder="Choose Category"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(id) => setCategory(id)}
                >
                  {expenseCategory.map((category) => (
                    <Select.Item
                      key={category.id}
                      label={category.name}
                      value={category.id}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>value</FormControl.Label>
                <Input
                  type="number"
                  name="value"
                  onChangeText={(value) => setValue(value)}
                />
              </FormControl>
              <FormControl mt="3" isRequired>
                <FormControl.Label>account</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Account"
                  placeholder="Choose Account"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(id) => setAccount(id)}
                >
                  {accounts.map((account) => (
                    <Select.Item
                      key={account.id}
                      label={account.name}
                      value={account.id}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>date</FormControl.Label>
                {showPicker && (
                  <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}
                    onChange={onChange}
                  />
                )}
                {!showPicker1 && (
                  <Pressable onPress={toggleDatePicker1}>
                    <TextInput
                      value={dateOftransaction}
                      name="dateOftransaction"
                      placeholder="Sat Aug 21 2004"
                      editable={false}
                      onChangeText={setDateOfTransaction}
                    />
                  </Pressable>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>to</FormControl.Label>
                <Input
                  type="text"
                  name="tos"
                  onChangeText={(tos) => setTos(tos)}
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>notes</FormControl.Label>
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
                    setShowModal1(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onPress={onSaveExpense}>Save</Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  nav: {
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 130,
  },
  expenseButton: {
    position: "absolute",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 30,
  },
});
