import  React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "native-base";
import * as SQLite from 'expo-sqlite';
import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity,Modal } from "react-native";

const db = SQLite.openDatabase('budgetPhoneApp.db');

export default function TransactionScreen({navigation}) {
  const [transactions, setTransactions] = useState([]);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedTransaction, setUpdatedTransaction] = useState({});
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedAccount, setUpdatedAccount] = useState('');
  const [updatedValue, setUpdatedValue] = useState();
  const [updatedDate, setUpdatedDate] = useState('');
  const [updatedFrom, setUpdatedFrom] = useState('');
  const [updatedNotes, setUpdatedNotes] = useState('');
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [incomeCategory, setIncomeCategory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [accountNames, setAccountNames] = useState({});


    const handleUpdate = async(transactionId) => {
      try {
        await db.transaction(
          (tx) => {
            tx.executeSql(`select * from Transactions WHERE id = ${transactionId}`, [], (_, results) => {
            //  console.log(results.rows._array[0].account,"updated transaction");
              const transactionData= results.rows._array;
              setUpdatedTransaction(transactionData);
              setUpdatedCategory(transactionData[0].category);
              setUpdatedAccount(transactionData[0].account);
              setUpdatedValue(transactionData[0].value);
              setUpdatedDate(transactionData[0].date);
              setUpdatedFrom(transactionData[0].froms);
              setUpdatedNotes(transactionData[0].notes);
              setUpdateModalVisible(!isUpdateModalVisible);

            });
          },
          (txObj, error) => console.log("Error ", error, "getData")
        );
      } catch (error) {
        console.log(error, "error")
      }
    };
  
    const updateTransaction = async () => {

      try {
        await db.transaction(
          (tx) => {
            tx.executeSql(
              "UPDATE Transactions SET category = ?, value = ?, account = ?, date = ?, froms = ?, notes = ? WHERE id = ?",
              [updatedCategory, updatedValue, updatedAccount,updatedDate,updatedFrom,updatedNotes, updatedTransaction.id],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  console.log(`Transaction with ID ${updatedTransaction.id} updated successfully`);
                  setUpdateModalVisible(false);
                  fetchTransactions(); // Fetch updated transactions after update
                } else {
                  console.log(`No transaction found with ID ${updatedTransaction.id}`);
                }
              }
            );
          },
          (txObj, error) => console.log('Error ', error, "updateTransaction")
        );
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleDelete = async (transactionId) => {
      try {
        await db.transaction(
          (tx) => {
            tx.executeSql(
              "DELETE FROM Transactions WHERE id = ?",
              [transactionId],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  console.log(`Transaction with ID ${transactionId} deleted successfully`);
                  // Fetch updated transactions after deletion
                  fetchTransactions();
                } else {
                  console.log(`No transaction found with ID ${transactionId}`);
                }
              }
            );
          },
          (txObj, error) => console.log('Error ', error, "deleteTransaction")
        );
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
        fetchTransactions();
    },[])
    const fetchTransactions = async () => {
        try {
         await db.transaction((tx) => {
            tx.executeSql("select * from Transactions",[],
            (_,results) => {
               console.log(results.rows._array);
            const transactionData = results.rows._array.map(row => ({
              id: row.id,
              type: row.type,
              category: row.category,
              value: row.value,
              account: row.account,
              date: row.date,
              froms: row.froms,
              tos: row.tos,
              notes: row.notes,
            }));
            setTransactions(transactionData);
            
            
            })
          },(txObj, error) => console.log('Error ', error, "getData") 
          )

          await db.transaction(
            (tx) => {
              tx.executeSql("select * from Categorys", [], (_, results) => {
                const categoryData = results.rows._array.reduce((acc, row) => {
                  acc[row.id] = row.name;
                  return acc;
                }, {});
                setCategoryNames(categoryData);
              });
            },
            (txObj, error) => console.log('Error ', error, 'fetchCategories')
          );
          await db.transaction(
            (tx) => {
              tx.executeSql("select * from Accounts", [], (_, results) => {
                const accountData = results.rows._array.reduce((acc, row) => {
                  acc[row.id] = row.name;
                  return acc;
                }, {});
                setAccountNames(accountData);
              });
            },
            (txObj, error) => console.log('Error ', error, 'fetchAccounts')
          );
        } catch (error) {
          console.log(error);
        }
      }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {transactions.map((transaction) => (
          <View
            key={transaction.id}
            style={{
              marginBottom: 16,
              padding: 16,
              backgroundColor: '#fff',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
              width: 350,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              Category: {categoryNames[parseInt(transaction.category)]}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                Account: {accountNames[parseInt(transaction.account)]}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 4 }}>
                Value: {transaction.value}
              </Text>
              <Text style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>
                Date: {transaction.date}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleUpdate(transaction.id)}>
                <Ionicons name="md-create" size={24} color="blue" style={{ marginRight: 16 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(transaction.id)}>
                <Ionicons name="md-trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isUpdateModalVisible}
          onRequestClose={() => setUpdateModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 5 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                Update Transaction
              </Text>
              <View>
              <TextInput
                placeholder="Category"
                value={updatedCategory}
                onChangeText={(text) => setUpdatedCategory(text)}
                style={{ marginBottom: 8, padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4 }}
              />
              </View>
              <View>
              <TextInput
                placeholder="Value"
                value={updatedValue}
                onValueChange={(value) => setUpdatedValue(value)}
                style={{ marginBottom: 16, padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4 }}
              />
              </View>
              <View>
              <TextInput
                placeholder="Account"
                value={updatedAccount}
                onChangeText={(text) => setUpdatedAccount(text)}
                style={{ marginBottom: 8, padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4 }}
              />
              </View>
              <View>
              <TextInput
                placeholder="Sat Aug 21 2024"
                value={updatedDate}
                onChangeText={(text) => setUpdatedDate(text)}
                style={{ marginBottom: 16, padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4 }}
              />
              </View>
              <View>
              <TextInput
                placeholder="from"
                value={updatedFrom}
                onChangeText={(text) => setUpdatedFrom(text)}
                style={{ marginBottom: 16, padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4 }}
              />
              </View>
              <View>
              <TextInput
                placeholder="notes"
                value={updatedNotes}
                onChangeText={(text) => setUpdatedNotes(text)}
                style={{ marginBottom: 16, padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 4 }}
              />
              </View>
              <Button style={{ color: 'white', margin: "10px", backgroundColor: "#1E88E5"}} onPress={updateTransaction} > Update</Button>
              <Button style={{ color: "#1E88E5", marginBottom: "10px", backgroundColor: "white"}} onPress={() => setUpdateModalVisible(false)} >Cancel</Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
    )
}
