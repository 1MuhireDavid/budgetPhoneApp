import * as React from "react";
import { Text, View } from "native-base";


export default function TransactionScreen({navigation}) {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Transaction')} style={{fontSize: 26, fontWeight: 'bold'}}>Transaction</Text>
        </View>
    )
}
