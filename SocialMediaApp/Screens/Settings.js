import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUserContext } from '../UserContext';

export default function Settings({navigation}) {
  const {myPrivacy} = useUserContext();

  const navigateBack = () => {
    navigation.navigate('Profile');
  }

  const navigateAccountInformation = () => {
    navigation.navigate('AccountInformation');
  }

  const navigateFavoritePosts = () => {
    navigation.navigate('FavoritePosts');
  }

  const navigateAccountPrivacy = () => {
    navigation.navigate('AccountPrivacy');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
        <View style={styles.backButton}>
          <AntDesign name="left" size={20} />
        </View>
        <Text style={{marginLeft:5, fontWeight:'bold'}}>Profile Dön</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accountContainer} onPress={navigateAccountInformation}>
        <View style={styles.iconImage} >
          <FontAwesome name="user" size={20} style={{color:'black'}}/>
        </View>
        <View style={styles.userInfo}>
          <Text style={{ fontWeight: 'bold' }}>Hesap Bilgilerimi Gör</Text>
        </View>
        <AntDesign name="right" size={20} style={{color:'black'}}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accountContainer} onPress={navigateFavoritePosts}>
        <View style={styles.iconImage} >
          <FontAwesome name="star" size={20} style={{color:'black'}}/>
        </View>
        <View style={styles.userInfo}>
          <Text style={{ fontWeight: 'bold' }}>Kaydedilenler</Text>
        </View>
        <AntDesign name="right" size={20} style={{color:'black'}}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.accountContainer} onPress={navigateAccountPrivacy}>
        <View style={styles.iconImage} >
        <FontAwesome name="lock" size={20} style={{color:'black'}}/>
        </View>
        <View style={styles.userInfo}>
            <Text style={{ fontWeight: 'bold' }}>Hesap Gizliliği</Text>
        </View>
        <Text>{myPrivacy ? "Gizli Hesap" : "Açık Hesap"}</Text>
        <AntDesign name="right" size={20} style={{marginLeft:10, color:'black'}}/>
      </TouchableOpacity>
      {/* <View style={{marginVertical:80, flex:1, justifyContent:'flex-end'}}>
        <Text style={{fontWeight:'bold', fontSize:16, textAlign:'center'}}>
          Bu Uygulama{'\n'}
          <Text style={{color: 'blue', fontWeight: 'bold'}}>
            <Text onPress={() => Linking.openURL('https://github.com/Sinanzaman')}>
              Sinan Zaman
            </Text>
          </Text>{'\n'}
          Tarafından Yapılmıştır
        </Text>
      </View> */}

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginHorizontal:5,
    paddingTop:30,
    backgroundColor:'white',
  },
  backButtonContainer:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical: Dimensions.get('window').height * 0.02,
  },
  backButton:{
    width:30,
    height:30,
    borderWidth:1,
    marginLeft:10,
    borderColor:'black',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
  },
  accountContainer: {
    height:60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 5,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#F3D0D7',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
})