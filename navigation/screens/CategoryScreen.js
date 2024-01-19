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
import Tabs from "../Components/Category/tabs";

const db = SQLite.openDatabase("budgetPhoneApp.db");
export default function CategoryScreen({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [accounts, setAccounts] = useState([]);
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
        "CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value INTEGER, notes TEXT);"
      );
    });
  };
  const onSaveCategory = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "insert into Categories (name, value, notes) values (?, ?, ?)",
          [name, value, notes],
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
          tx.executeSql("select * from Categories", [], (_, results) => {
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

  return (
    <>
      <Tabs />
    </>
  );
}
const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",

    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 50,
  },
});
