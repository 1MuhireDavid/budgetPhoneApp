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
import Tabs from "../Components/Category/tabs";

const db = SQLite.openDatabase("budgetPhoneApp.db");
export default function CategoryScreen({ navigation }) {
  return (
    <>
      <Tabs />
    </>
  );
}

