import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Center,FormControl,Modal, Divider, Input, HStack, Image, Pressable, Button, VStack } from "native-base";
import Colors from "../color";
import { MaterialIcons,Ionicons, FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite'

export default function HomeScreen({ navigation }) {
  const db = SQLite.openDatabase('budgetPhoneApp.db');

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [froms, setFrom] = useState("");
  const [notes, setNotes] = useState("");
  const [tos, setTos] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(()=>{
    createTable();
    fetchTransactions();
  },[]);

  const onAddIncome = () =>{
    setShowModal(true);
  }
  const onAddExpense = () =>{
    setShowModal1(true);
  } 
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS Transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, category TEXT, value INTEGER, account TEXT, date TEXT NULL, time TEXT NULL, froms TEXT NULL, tos TEXT NULL, notes TEXT NULL);");
    });
    console.log("table transaction created", "trans")
  };
  const onSaveIncome = async() => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Transactions (type, category, value, account, date, time, froms, notes) values (?, ?, ?, ?, ?, ?, ?, ?)",
          ["income", category, value, account, date, time, froms, notes],
          (txObj, resultSet) => console.log(resultSet.insertId),
          (txObj, error) => console.log('Error', error, "onSaveIncome")
        );
      })
      setShowModal(false); // Close the modal
      alert("Successfully saved Income");
      fetchTransactions(); // Refresh the transactions
    } catch (error) {
      console.log(error);
    }
  };
  const onSaveExpense = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Transactions (type, category, value, account, date, time, tos, notes) values (?, ?, ?, ?, ?, ?, ?, ?)",
          ["expense", category, value, account, date, time, tos, notes],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
            alert("Successfully saved Expense");
            fetchTransactions(); // Refresh the transactions
          },
          (txObj, error) => console.log("Error", error)
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTransactions = async () => {
    try {
     await db.transaction((tx) => {
        tx.executeSql("select * from Transactions order by date desc",[],
        (_,results) => {
          console.log(results.rows._array);
        const transactionData = results.rows._array.map(row => ({
          id: row.id,
          type: row.type,
          category: row.category,
          value: row.value,
          account: row.account,
          date: row.date,
          time: row.time,
          froms: row.froms,
          tos: row.tos,
          notes: row.notes,
        }));
        setTransactions(transactionData);
        console.log(transactionData);
        
        })
      },(txObj, error) => console.log('Error ', error, "getData") 
      )
      console.log(category, account, date, time, froms, notes, value)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
    <ScrollView overflow="hidden"> 
    <View style={{ margin: 20 }}>
      <LinearGradient colors={["#9440FD", "#6B47F8"]}>
        <View style={{ height: 100, width: 100 }}>
          <Text> hello !!</Text>
        </View>
      </LinearGradient>
    </View>
    <VStack space={3} w="full" mx={3} px={6} py={4} bgColor={Colors.white} color={Colors.black}>
    <HStack justifyContent="space-between">
  <Text display="flex" alignItems="center" justifyContent="center"  _text={{ fontWeight: "extrabold", fontSize: 32 }}>Summary</Text>
  <MaterialIcons name="more-vert" size={24} color="black" />
</HStack>
      <Text>August 2023</Text>
      <HStack mb="2.5" mt="1.5" space={3}>
        <Image source={{
      uri: "https://wallpaperaccess.com/full/317501.jpg"
    }} alt="Alternate Text" size="xl" />
        <VStack space={3} justifyContent="center">
        <HStack mb="2.5" mt="1.5" space={10} display="flex" justifyContent="space-between">
        <Text>Income :</Text><Text >$1,612:00</Text>
        </HStack>
        <HStack mb="2.5" mt="1.5" space={10} display="flex" justifyContent="space-between">
        <Text>Expenses :</Text><Text >$1,612:00</Text>
        </HStack>
        <HStack mb="2.5" mt="1.5" space={10} display="flex" justifyContent="space-between">
        <Text>Total :</Text><Text >$1,612:00</Text>
        </HStack>
        </VStack >
       
      </HStack>
    </VStack>


    <VStack space={3} w="full" mx={3} px={6} py={4} bgColor={Colors.white} color={Colors.black} mt={5}>
    <HStack justifyContent="space-between" color={"green"}>
    <Text display="flex" alignItems="center" justifyContent="center" _text={{ fontWeight: "extrabold", fontSize: 32, color: "green", lineHeight: 40 }}>Accounts</Text>
    <MaterialIcons name="more-vert" size={24} color="black" />
    </HStack>
    <HStack justifyContent="space-between" color={"green"}>
      <VStack>
      <Text display="flex" alignItems="center" justifyContent="center" _text={{ fontWeight: "extrabold", fontSize: 32, color: "green", lineHeight: 40 }}>Wallet</Text>
    <Text display="flex" alignItems="center" justifyContent="center" _text={{ fontWeight: "extrabold", fontSize: 32, color: "green", lineHeight: 40 }}>Last used: 08/12/2023</Text>
      </VStack>
      <Text>$100.00</Text>
    </HStack>
    <Divider/>
    <HStack justifyContent="space-between" color={"green"}>
      <VStack>
      <Text display="flex" alignItems="center" justifyContent="center" _text={{ fontWeight: "extrabold", fontSize: 32, color: "green", lineHeight: 40 }}>Wallet</Text>
    <Text display="flex" alignItems="center" justifyContent="center" _text={{ fontWeight: "extrabold", fontSize: 32, color: "green", lineHeight: 40 }}>Last used: 08/12/2023</Text>
      </VStack>
      <Text>$100.00</Text>
    </HStack>
    </VStack>
    
    </ScrollView>
    <Pressable onPress={onAddIncome} style={styles.floatingButton}>
    <Ionicons name="add-circle" size={100} color="#2EB432"/>
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Add Income</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <FormControl.Label>category</FormControl.Label>
              <Input type="text" name="category" onChangeText={(category) => setCategory(category)}/>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>value</FormControl.Label>
              <Input type="number" name="value" onChangeText={(value) => setValue(value)}/>
            </FormControl>
            <FormControl mt="3" isRequired>
              <FormControl.Label>account</FormControl.Label>
              <Input type="text" name="account" onChangeText={(account) => setAccount(account)}/>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>date</FormControl.Label>
              <Input type="text" name="date" onChangeText={(date) => setDate(date)}/>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>time</FormControl.Label>
              <Input type="text" name="time" onChangeText={(time) => setTime(time)}/>
            </FormControl>
            <FormControl>
              <FormControl.Label>from</FormControl.Label>
              <Input type="text" name="froms" onChangeText={(froms) => setFrom(froms)}/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>notes</FormControl.Label>
              <Input type="text" name="notes" onChangeText={(notes) => setNotes(notes)}/>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={onSaveIncome}>
                Save
              </Button>
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
          <Modal.Header>Contact Us</Modal.Header>
          <Modal.Body>
          <FormControl isRequired>
              <FormControl.Label>category</FormControl.Label>
              <Input type="text" name="category" onChangeText={(category) => setCategory(category)}/>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>value</FormControl.Label>
              <Input type="number" name="value" onChangeText={(value) => setValue(value)}/>
            </FormControl>
            <FormControl mt="3" isRequired>
              <FormControl.Label>account</FormControl.Label>
              <Input type="text" name="account" onChangeText={(account) => setAccount(account)}/>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>date</FormControl.Label>
              <Input type="text" name="date" onChangeText={(date) => setDate(date)}/>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>time</FormControl.Label>
              <Input type="text" name="time" onChangeText={(time) => setTime(time)}/>
            </FormControl>
            <FormControl>
              <FormControl.Label>to</FormControl.Label>
              <Input type="text" name="tos" onChangeText={(tos) => setTos(tos)}/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>notes</FormControl.Label>
              <Input type="text" name="notes" onChangeText={(notes) => setNotes(notes)}/>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal1(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={onSaveExpense}>
                Save
              </Button>
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
  }
});
