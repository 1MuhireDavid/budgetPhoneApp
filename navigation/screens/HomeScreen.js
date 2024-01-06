import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Center,FormControl,Modal, Divider, Input, HStack, Image, Pressable, Button, VStack } from "native-base";
import Colors from "../color";
import { MaterialIcons,Ionicons, FontAwesome } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const onAddIncome = () =>{
    setShowModal(true);
  }
  const onAddExpense = () =>{
    setShowModal1(true);
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
          <Modal.Header>Contact Us</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <FormControl.Label>category</FormControl.Label>
              <Input/>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>value</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl mt="3" isRequired>
              <FormControl.Label>account</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>date</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>time</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl>
              <FormControl.Label>from</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>notes</FormControl.Label>
              <Input />
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
                onPress={() => {
                  setShowModal(false);
                }}>
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
            <FormControl>
              <FormControl.Label>Name</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input />
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
                onPress={() => {
                  setShowModal1(false);
                }}>
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
