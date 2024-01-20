import { Text, View } from "native-base";
import React, {useState} from "react";
import { SceneMap, TabView,TabBar } from "react-native-tab-view";
import Income from "./Income";
import Expense from "./expense";
import { StyleSheet, useWindowDimensions } from "react-native";
import Colors from "../../color";

const renderScene = SceneMap({
  first:Income,
  second:Expense
})
function Tabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "first",
      title: "Income"
    },
    {
      key: "second", 
      title: "Expense"
    }
  ]);
  const renderTabsbar = (props) => {
    <TabBar 
    {...props}
    tabStyle= {styles.tabStyle}
    indicatorStyle={{backgroundColor: Colors.black}}
    activeColor="#488600"
    inactiveColor={Colors.white}
    renderLabel={({ route, color }) => (
      <Text style={{ color, ...styles.text}}>{route.title}</Text>
    )}
    />
  };


  return (
    <TabView navigationState={{index, routes}} renderScene={renderScene}
    onIndexChange={setIndex} initialLayout={{ width: layout.width }}
    />
  );
}

const styles = StyleSheet.create({
  tabStyle:{
    backgroundColor: "black"
  },
  text: {
    fontSize: 13,
    fontweight: "bold",
  }
});
export default Tabs;
