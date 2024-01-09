import { Text, View } from "native-base";
import React from "react";

function Tabs() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => navigation.navigate("Income")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        TAbs
      </Text>
    </View>
  );
}

export default Tabs;
