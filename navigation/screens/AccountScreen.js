import { Text, View } from 'native-base'
import React from 'react'

function AccountScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('Graph')} style={{fontSize: 26, fontWeight: 'bold'}}>Graph</Text>
        </View>
  )
}

export default AccountScreen
