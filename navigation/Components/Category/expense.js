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

const db = SQLite.openDatabase("budgetPhoneApp.db");
function expense() {
    
  return (
    <View>
      
    </View>
  )
}

export default expense
