import * as React from "react";
import {View, Text} from 'react-native';

export default function DetailsScreen({navigation}) {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Details')} style={{fontSize: 26, fontWeight: 'bold'}}>Details</Text>
        </View>
    )
}
