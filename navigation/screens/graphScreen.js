import * as React from "react";
import {View, Text} from 'react-native';


export default function GraphScreen({navigation}) {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Graph')} style={{fontSize: 26, fontWeight: 'bold'}}>Graph</Text>
        </View>
    )
}
