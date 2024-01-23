import React, { useEffect, useState,useRef } from "react";
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
  Progress,
  ScrollView,
  CheckIcon,
  Select,
  Box,
} from "native-base";
import Colors from "../color";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { Alert,StyleSheet } from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Permissions from 'expo-permissions';

const db = SQLite.openDatabase("budgetPhoneApp.db");

function BudgetScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [valueB, setValue] = useState();
  const [account, setAccount] = useState("");
  const [duration, setDuration] = useState("");
  const [userBudgets, setUserBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [expenseCategory, setExpenseCategoryB] = useState([]);
  const [incomeCategory, setIncomeCategoryB] = useState([]);
  const [accounts, setAccountsB] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState({});



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
          [category, valueB, account, duration],
          (txObj, resultSet) => {
            console.log(resultSet.insertId);
            alert("Successfully saved Budget");
            setShowModal(false); // Close the modal
            schedulePushNotification("Budget created","You have successfully created new budget"); 
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
          tx.executeSql("select * from Budgets", [], (_, results) => {
            var len = results.rows.length;
            //  console.log(results.rows);
            const budgetGet = results.rows._array.map(row=> ({
              id: row.id,
              category: row.category,
              valueB: row.value,
              account: row.account,
              duration: row.duration
            }));
            setUserBudgets(budgetGet);
          });
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
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
              setExpenseCategoryB(categoryData);
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
              setIncomeCategoryB(categoryData);
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
            setAccountsB(accountData);
            console.log(accountData);
          });
        },
        (txObj, error) => console.log("Error ", error, "getData")
      );
    } catch (error) {
      console.log(error);
    }
    
  };
  const calculateProgress = async (selectCategory,budgetvalue) => {
    try {
      console.log("Select Category:", selectCategory);
  
      // Get the category id based on the category name
      const categoryResult = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT id FROM Categorys WHERE name = ?",
            [selectCategory],
            (_, result) => resolve(result),
            (_, error) => reject(error)
          );
        });
      });
  
      const categoryId = categoryResult.rows.item(0)?.id;
  
      console.log(categoryId, "Category ID");
  
      if (categoryId !== undefined) {
        // Fetch expenses for the given budget category using the retrieved category id
        const expensesResult = await new Promise((resolve, reject) => {
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT SUM(value) AS totalExpenses FROM Transactions WHERE type = 'expense' AND category = ?",
              [categoryId],
              (_, result) => resolve(result),
              (_, error) => reject(error)
            );
          });
        });
  
        // Get the total expenses for the budget category
        const totalExpensesForBudget =
          expensesResult.rows.item(0).totalExpenses || 0;
  
        // Calculate the progress as a percentage
        const progress = (totalExpensesForBudget / budgetvalue) * 100 || 0;
        console.log(Math.min(Math.max(progress, 0), 100));
       
        // Ensure the progress is between 0 and 100
        return Math.min(Math.max(progress, 0), 100);
      } else {
        console.error("Category not found:", selectCategory);
        return 0; // Return 0 if category not found
      }
    } catch (error) {
      console.error("Error calculating budget progress:", error);
      return 0; // Return 0 in case of an error
    }
  };
  
  const calculateBudgetProgress = async (budget) => {
    try {
      const progress = await calculateProgress(budget.category, budget.valueB);
      
      // Update the progress for the specific budget
      setBudgetProgress((prevProgress) => ({
        ...prevProgress,
        [budget.id]: progress,
      }));
  
      return progress;
    } catch (error) {
      console.error("Error calculating budget progress:", error);
      return 0;
    }
  };
  useEffect(() => {
    userBudgets.forEach((budget) => {
      calculateBudgetProgress(budget);
    });
  }, [userBudgets, accounts, expenseCategory]);
    
  
  

  const handleMoreOptions = (budget) => {
    setSelectedBudget(budget);
    setShowOptionsModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedBudget) {
      return;
    }
    // Set the state to open the second modal for updating
    setShowUpdateModal(true);
  };

  const performUpdate = async () => {
    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Budgets SET category=?, value=?, account=?,duration=? WHERE id=?",
          [category, valueB, account,duration, selectedBudget.id],
          () => {
            Alert.alert("Success!", "Your data has been updated.");
            setShowUpdateModal(false);
            schedulePushNotification("Budget update","You have successfully updated budget"); 
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
    if (!selectedBudget) {
      return;
    }

    try {
      await db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Budgets WHERE id=?",
          [selectedBudget.id],
          () => {
            Alert.alert("Success!", "Your data has been deleted.");
            setShowOptionsModal(false);
            schedulePushNotification("Budget removed","You have successfully removed budget"); 
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
    <>
      <ScrollView>
      {userBudgets.map((budget) => (
          <VStack
            key={budget.id}
            space={3}
            w="full"
            mx={3}
            px={6}
            py={4}
            bgColor={Colors.white}
            color={Colors.black}
            mt={5}
          >
            <Pressable onPress={() => handleMoreOptions(budget)}>
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
                  {budget.category}
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
                  Account name
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
                    amount:
                  </Text>{" "}
                  {budget.valueB}
                  {"\n"}
                  <Text
                    style={{
                      color: "blue",
                      fontWeight: "bold",
                    }}
                  ></Text>{" "}
                </Text>
           
              </VStack>
              <Text style={{ textAlign: "right" }}>{budget.account}</Text>
            </HStack>
                <Progress value={budgetProgress[budget.id] || 0} colorScheme="emerald" size="md" mt={4} mb={4} />
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
                <FormControl.Label>Category</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Category"
                  placeholder="Choose Category"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(name) => setCategory(name)}
                >
                  {expenseCategory.map((category) => (
                    <Select.Item
                      key={category.id}
                      label={category.name}
                      value={category.name}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Amount</FormControl.Label>
                <Input
                  type="number"
                  name="value"
                  value={valueB}
                  onChangeValue={(value) => setValue(value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Account</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Account"
                  placeholder="Choose Account"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(name) => setAccount(name)} 
                >
                  {accounts.map((account) => (
                    <Select.Item
                      key={account.id}
                      label={account.name}
                      value={account.name}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>duration</FormControl.Label>
                <Input
                  type="text"
                  name="duration"
                  value={duration}
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
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Category"
                  placeholder="Choose Category"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(name) => setCategory(name)}
                >
                  {expenseCategory.map((category) => (
                    <Select.Item
                      key={category.id}
                      label={category.name}
                      value={category.name}
                    />
                  ))}
                </Select>
              </FormControl>
              <FormControl mt="3" isRequired>
                <FormControl.Label>Account</FormControl.Label>
                <Select
                  minWidth="200"
                  accessibilityLabel="Choose Account"
                  placeholder="Choose Account"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(name) => setAccount(name)}
                >
                  {accounts.map((account) => (
                    <Select.Item
                      key={account.id}
                      label={account.name}
                      value={account.name}
                    />
                  ))}
                </Select>
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
