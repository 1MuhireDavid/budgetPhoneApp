import { Text, View } from 'native-base'
import React from 'react'

function ExpenseScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Expense')} style={{fontSize: 26, fontWeight: 'bold'}}>Expense</Text>
        </View>
  )
}

export default ExpenseScreen;
