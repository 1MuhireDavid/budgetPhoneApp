import * as React from "react";
import {View, Text} from 'native-base';

export default function CategoryScreen({navigation}) {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Category')} style={{fontSize: 26, fontWeight: 'bold'}}>Category</Text>
        </View>
    )
}