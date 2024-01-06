import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import Favicon from "../assets/favicon.png";
import {
    SimpleLineIcons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,Ionicons
  } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "native-base";
// Screens
import HomeScreen from "./screens/HomeScreen";
import CategoryScreen from "./screens/CategoryScreen";
import TransactionScreen from "./screens/transactionScreen";
import GraphScreen from "./screens/graphScreen";
import AccountScreen from "./screens/AccountScreen";
import ExpenseScreen from "./screens/ExpenseScreen";
import IncomeScreen from "./screens/IncomeScreen";
import BudgetScreen from "./screens/BudgetScreen";

const homeName = "Home";
const categoryName = "Category";
const graphName = "Graph";
const transactionName = "Transaction";
const accountName = "Account";
const expenseName = "Expense";
const incomeName = "Income";
const budgetName = "Budget";


const Drawer = createDrawerNavigator();

export default function MainContainer(){
    return (
        <NavigationContainer>
            <Drawer.Navigator
        drawerContent={
          (props) => {
            return (
              <SafeAreaView>
                <View
                  style={{
                    height: 200,
                    width: '100%',
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomColor: "#f4f4f4",
                    borderBottomWidth: 1
                  }}
                >
                  <Image
                    source={Favicon}
                    style={{
                      height: 130,
                      width: 130,
                      borderRadius: 65,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      marginVertical: 6,
                      fontWeight: "bold",
                      color: "#111"
                    }}
                  >Isabella Joanna</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#111"
                    }}
                  >Product Manager</Text>
                </View>
                <DrawerItemList {...props} />
              </SafeAreaView>
            )
          }
        }
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#fff",
            width: 250
          },
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold"
          },
          drawerLabelStyle: {
            color: "#111"
          }
        }}
      >
        <Drawer.Screen
          name={homeName}
          options={{
            drawerLabel: "Home",
            title: "Overview",
            drawerIcon: () => (
              <Ionicons name="ios-apps-outline" size={24} color="black" />
            )
          }}
          component={HomeScreen}
        />
        <Drawer.Screen
          name={budgetName}
          options={{
            drawerLabel: "Budgets",
            title: "Budgets",
            drawerIcon: () => (
              <MaterialIcons name="timelapse" size={24} color="black" />
            )
          }}
          component={BudgetScreen}
        />
        <Drawer.Screen
          name={graphName}
          options={{
            drawerLabel: "Chart",
            title: "Chart",
            drawerIcon: () => (
              <MaterialIcons name="timeline" size={24} color="black" />
            )
          }}
          component={GraphScreen}
        />
        <Drawer.Screen
          name={transactionName}
          options={{
            drawerLabel: "Transaction",
            title: "Transaction",
            drawerIcon: () => (
              <Ionicons name="ios-repeat" size={24} color="black" />
            )
          }}
          component={TransactionScreen}
        />
        <Drawer.Screen
          name={accountName}
          options={{
            drawerLabel: "Accounts",
            title: "Accounts",
            drawerIcon: () => (
              <MaterialIcons name="account-balance" size={24} color="black" />
            )
          }}
          component={AccountScreen}
        />
        <Drawer.Screen
          name={incomeName}
          options={{
            drawerLabel: "Income",
            title: "Income",
            drawerIcon: () => (
              <SimpleLineIcons name="home" size={20} color="#808080" />
            )
          }}
          component={IncomeScreen}
        />
        <Drawer.Screen
          name={categoryName}
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: () => (
              <MaterialIcons name="category" size={20} color="#808080" />
            )
          }}
          component={CategoryScreen}
        />
      </Drawer.Navigator>
        </NavigationContainer>
    )
}