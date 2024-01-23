import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import Favicon from "../assets/favicon.png";
import {
    MaterialIcons,
    FontAwesome,Ionicons
  } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "native-base";
// Screens
import HomeScreen from "./screens/HomeScreen";
import CategoryScreen from "./screens/CategoryScreen";
import TransactionScreen from "./screens/transactionScreen";
import AccountScreen from "./screens/AccountScreen";
import BudgetScreen from "./screens/BudgetScreen";

const homeName = "Home";
const categoryName = "Category";
const transactionName = "Transaction";
const accountName = "Account";
const budgetName = "Budget";



const Drawer = createDrawerNavigator();

export default function MainContainer({route}){
    return (
        <>
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
                    alt={"Profile"}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      marginVertical: 6,
                      fontWeight: "bold",
                      color: "#111"
                    }}
                  >{route.params.name}</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#111"
                    }}
                  ></Text>
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
            backgroundColor: "#488600",
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
          name={categoryName}
          options={{
            drawerLabel: "Category management",
            title: "Category management",
            drawerIcon: () => (
              <MaterialIcons name="category" size={20} color="#808080" />
            )
          }}
          component={CategoryScreen}
        />
      </Drawer.Navigator>
        </>
    )
}