import { StyleSheet, Text, TouchableOpacity, View, Dimensions, TextInput, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { auth } from '../firebase';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function AccountInformation({navigation}) {
    const [currentMail, setCurrentMail] = useState("x");

    const email = auth.currentUser.email;

    const navigateBack = () => {
        navigation.navigate('Settings');
    }

    useEffect(() => {
        setCurrentMail(email);
    }, [email])
    
    
  return (
    <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
            <View style={styles.backButton}>
                <AntDesign name="left" size={20} />
            </View>
            <Text style={{marginLeft:5, fontWeight:'bold'}}>Ayarlara Dön</Text>
        </TouchableOpacity>
        <View style={{alignSelf:'center', alignItems:'center', width:screenWidth * 0.9, backgroundColor:'#ECF5FE', borderRadius:15, padding:5, marginBottom:20 }}>
            <Text style={{fontWeight:'bold', fontSize:16}}>E-posta Adresiniz</Text>
            <Text style={{fontWeight:'bold', fontSize:16}}>{currentMail}</Text>
        </View>
        <View style={{alignSelf:'center', alignItems:'center', width:screenWidth * 0.9, backgroundColor:'#ECF5FE', borderRadius:15, padding:5, marginBottom:20 }}>
            <Text style={{fontWeight:'bold', fontSize:16, marginTop:10, textAlign:'center'}}>Şifre Değiştirmek için Bilgileri Giriniz</Text>
            <View style={styles.inputContainer}>
                <Text>Şifre</Text>
                <TextInput secureTextEntry={true}/>
            </View>
            <View style={styles.inputContainer}>
                <Text>Şifre Tekrarı</Text>
                <TextInput secureTextEntry={true}/>
            </View>
            <TouchableOpacity style={styles.button}>
            <Text style={{fontWeight:'bold', fontSize:17}}>Şifreyi Değiştir</Text>
            </TouchableOpacity>
        </View>
        <View style={{alignSelf:'center', alignItems:'center', width:screenWidth * 0.9, backgroundColor:'#ECF5FE', borderRadius:15, padding:5, marginBottom:20 }}>
            <Text style={{fontWeight:'bold', fontSize:16, marginTop:10, textAlign:'center'}}>E-posta Adresini Değiştirmek için Bilgileri Giriniz</Text>
            <View style={styles.inputContainer}>
                <Text>Yeni E-posta Adresi</Text>
                <TextInput />
            </View>
            <View style={styles.inputContainer}>
                <Text>Yeni E-posta Adresi Tekrarı</Text>
                <TextInput />
            </View>
            <TouchableOpacity style={styles.button}>
            <Text style={{fontWeight:'bold', fontSize:17}}>E-postayı Değiştir</Text>
            </TouchableOpacity>
        </View>
        <View style={{alignSelf:'center', alignItems:'center', width:screenWidth * 0.9, backgroundColor:'#ECF5FE', borderRadius:15, padding:5, marginBottom:20 }}>
            <Text style={{fontWeight:'bold', fontSize:16, marginTop:10, textAlign:'center', color:'red'}}>Hesabı Kalıcı Olarak Silmek için Bilgileri Giriniz</Text>
            <View style={styles.inputContainer}>
                <Text>E-posta Adresi</Text>
                <TextInput />
            </View>
            <View style={styles.inputContainer}>
                <Text>Şifre</Text>
                <TextInput secureTextEntry={true}/>
            </View>
            <View style={styles.inputContainer}>
                <Text>Şifre Tekrarı</Text>
                <TextInput secureTextEntry={true}/>
            </View>
            <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]}>
            <Text style={{fontWeight:'bold', fontSize:17}}>Hesabı Sil</Text>
            </TouchableOpacity>
        </View>
        <View style={{marginBottom:50}}></View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginHorizontal:5,
        paddingVertical:30,
        backgroundColor:'white',
    },
    backButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical: screenHeight * 0.02,
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
    inputContainer: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingVertical: 2,
        width: screenWidth * 0.9,
        borderWidth: 1,
        borderColor: '#F3D0D7',
        borderRadius: 15,
        marginVertical: 6,
        backgroundColor:'white',
    },
    textInput: {
        height: 'auto',
        textAlignVertical: 'top',
    },
    button:{
        width: screenWidth * 0.6,
        height: 30,
        backgroundColor:'white',
        borderRadius:8,
        alignItems:'center',
        alignSelf:'center',
        justifyContent:'center',
        marginVertical:5,
      },
})