import { Text, View } from 'native-base'
import React from 'react'

function IncomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Income')} style={{fontSize: 26, fontWeight: 'bold'}}>Income</Text>
        </View>
  )
}

export default IncomeScreen
