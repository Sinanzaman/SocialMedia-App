import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function NotificationBox() {
  return (
    <View style={styles.container}>
      <Text>NotificationBox</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        height:50,
        width:'100',
        backgroundColor:'grey',
        justifyContent:'center',
    }
})