import { Text, View } from 'native-base'
import React from 'react'

function BudgetScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Budget')} style={{fontSize: 26, fontWeight: 'bold'}}>Budget</Text>
        </View>
  )
}

export default BudgetScreen
