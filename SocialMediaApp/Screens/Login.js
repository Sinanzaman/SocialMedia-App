import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, Switch, Dimensions} from 'react-native';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import React from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import * as SecureStore from 'expo-secure-store';
/* import registerNNPushToken from 'native-notify';
import { registerIndieID } from 'native-notify'; */

const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEyeEnabled, setIsEyeEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hack, setHack] = useState(0);
    const [rememberMe, setRememberMe] = useState(false);
    const [isCredentialsLoaded, setIsCredentialsLoaded] = useState(false);

    /* registerNNPushToken(23219, '9bI6BBJvF01eIrM8FAoiPw'); */

    useEffect(() => {
        const loadCredentials = async () => {
            const savedEmail = await SecureStore.getItemAsync('email');
            const savedPassword = await SecureStore.getItemAsync('password');
            const savedRememberMe = await SecureStore.getItemAsync('rememberMe');
            if (savedEmail && savedPassword && savedRememberMe) {
                setEmail(savedEmail);
                setPassword(savedPassword);
                setRememberMe(true);
                setIsCredentialsLoaded(true);
            }
        };
        loadCredentials();
    }, []);

    useEffect(() => {
        if (isCredentialsLoaded) {
            handleLogin();
        }
    }, [isCredentialsLoaded]);

    const navigateSignup = () => {
        navigation.navigate('Signup');
    }

    const navigateForget = () => {
        navigation.navigate('Forget')
    }

    const handleEyeChange = () => {
        setIsEyeEnabled(!isEyeEnabled);
        setHack(hack + 1);
    }

    const handleLogin = async () => {
        setLoading(true);
        try {
          const userCredentials = await auth.signInWithEmailAndPassword(email, password);
          const user = userCredentials.user;
          if (user.emailVerified) {
              if (rememberMe) {
                await SecureStore.setItemAsync('email', email);
                await SecureStore.setItemAsync('password', password);
                await SecureStore.setItemAsync('rememberMe', "true");
              } else {
                await SecureStore.deleteItemAsync('email');
                await SecureStore.deleteItemAsync('password');
                await SecureStore.deleteItemAsync('rememberMe');
              }
              /* registerIndieID(user.uid, 23219, '9bI6BBJvF01eIrM8FAoiPw'); */
              navigation.navigate('Dashboard');
              /* setEmail("");
              setPassword(""); */
          } else {
            alert('E-posta adresinizi doğrulamak için lütfen e-postanızı kontrol edin ve doğrulama bağlantısına tıklayın.');
            await user.sendEmailVerification();
          }
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      };
      

    const deneme = () => {
        setEmail("sinanhesap55@gmail.com");
        setPassword("123456");
    }

    const deneme2 = () => {
        setEmail("sinanininal55@gmail.com");
        setPassword("123456");
    }

    return (
        <View style={styles.container}>
            {/*Top View*/}
            <View style={styles.topView}>
                <View style={{alignItems:'center'}}>
                    <Image style={styles.image}
                        source={require('../assets/Images/icon.png')}
                    />
                </View>
            </View>

            {/*Buttom View*/}
            <View style={styles.bottomView}>
                <Text style={{marginLeft:25, marginTop:15, fontSize:20, fontWeight:'bold',}}>Hoş Geldiniz</Text>
                {/*Txt Email*/}
                <View style={{justifyContent:'center', alignItems:'center', marginTop:20}}>
                    <View style={styles.txtEmail}>
                        <Icon name="email" size={30} style={{marginLeft:15, color:'#818181'}}/>
                        <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                        <TextInput
                            style={{height:50,width:'100%', fontSize:15, marginLeft:15, color:'#818181'}}
                            placeholder='E-posta'
                            value={email}
                            onChangeText={(text)=> setEmail(text)}
                        />
                    </View>
                </View>
                {/*Txt Password*/}
                <View style={{justifyContent:'center', alignItems:'center', marginTop:20}}>
                    <View style={styles.txtPassword}>
                        <Ionicons name="key-outline" size={30} style={{marginLeft:15, color:'#818181'}}/>
                        <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                        <TextInput
                            style={{height:50,width:'65%', fontSize:15, marginLeft:15, color:'#818181'}}
                            placeholder='Şifre'
                            value={password}
                            onChangeText={(text)=> setPassword(text)}
                            secureTextEntry={!isEyeEnabled}
                        />
                        {isEyeEnabled 
                        ? 
                        <TouchableOpacity onPress={handleEyeChange}>
                            <Feather name="eye" size={30} style={{color:'#818181'}}/> 
                        </TouchableOpacity>
                        : 
                        <TouchableOpacity onPress={handleEyeChange}>
                            <Feather name="eye-off" size={30} style={{color:'#818181'}}/> 
                        </TouchableOpacity> 
                        }
                    </View>
                </View>
                {/*Remember Me*/}
                <View style={styles.rememberMe}>
                    <Text>Beni Hatırla</Text>
                    <Switch
                        value={rememberMe}
                        onValueChange={setRememberMe}
                    />
                </View>
                {/*btn Sing In*/}
                <View style={{justifyContent:'center', alignItems:'center', marginTop:10, flexDirection:"column"}}>
                    <TouchableOpacity style={styles.btnSingIn} onPress={handleLogin}>
                        <Text style={{color:'#FFFCFC', fontSize:20, marginLeft:110, fontWeight:'bold'}}>Giriş Yap</Text>
                        <AntDesign name="rightcircle" size={20} style={{marginLeft:100, color:'#FFFCFC'}}/>
                    </TouchableOpacity>
                    {hack > 20 && <TouchableOpacity style={{width:'30%', 
                height:20, 
            backgroundColor:'#0984E3', 
            justifyContent:'center', 
            alignItems:'center', 
            borderRadius:15,
            marginTop:5,
            flexDirection:'row'}} onPress={deneme}>
                        <Text style={{color:'#FFFCFC', fontSize:10, fontWeight:'bold', textAlign:"center"}}>Otomatik gir</Text>
                    </TouchableOpacity>}
                    {hack > 20 && <TouchableOpacity style={{width:'30%', 
                height:20, 
            backgroundColor:'#0984E3', 
            justifyContent:'center', 
            alignItems:'center', 
            borderRadius:15,
            marginTop:5,
            flexDirection:'row'}} onPress={deneme2}>
                        <Text style={{color:'#FFFCFC', fontSize:10, fontWeight:'bold', textAlign:"center"}}>Otomatik gir</Text>
                    </TouchableOpacity>}
                </View>
                {/*Forgot your password*/}
                <View style={{justifyContent:'center', alignItems:'center', marginTop:5,}}>
                    <TouchableOpacity style={styles.forget} onPress={navigateForget}>
                        <Text style={{color:'blue', fontSize:15,}}>Şifreni mi unuttun ?</Text>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent:'center', alignItems:'center', marginTop:5,}}>
                    <View style={{width:'90%', borderWidth:0.5}}></View>
                </View>
                <View style={{justifyContent:'center', alignItems:'center', marginTop:10,}}>
                    <View><Text>Ya da</Text></View>
                </View>
                {/*Sign up now*/}
                <View style={{justifyContent:'center', alignItems:'center', marginTop:15}}>
                    <TouchableOpacity style={styles.btnRegister} onPress ={navigateSignup}>
                        <Text style={{color:'#FFFCFC', fontSize:20, marginLeft:90, fontWeight:'bold'}}>Şimdi Kayıt Ol</Text>
                        <Entypo name="add-user" size={20} style={{marginLeft:70, color:'#FFFCFC'}}/>
                    </TouchableOpacity>
                </View>
            </View>
            {loading && ( <View style={styles.loadingContainer}>
                <ActivityIndicator size={60} color="blue" />
                <Text style={{fontWeight:"900", fontSize:18}}>Lütfen Bekleyin</Text>
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#2980B9',
        justifyContent:'center',
    },
    topView:{
        width:'100%',
        height:'37%',
        justifyContent:'center',
        marginTop:30,
    },
    image:{
        width:200, 
        height:200,
        borderRadius:30
    },
    bottomView:{
        width:'100%',
        height:'63%',
        backgroundColor:'#F4F4F4',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },
    txtEmail:{
        width:'90%', 
        height:50, 
        borderColor:'#818181', 
        borderWidth:1, 
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center' 
    },
    txtPassword:{
        width:'90%', 
        height:50, 
        borderColor:'#818181', 
        borderWidth:1, 
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center' 
    },
    btnSingIn:{
        width:'90%', 
        height:50, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row'
    },
    btnSingInAnother:{
        width:'43%', 
        height:50, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row',
        marginHorizontal:10,
    },
    forget:{
        width:'90%', 
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row'
    },
    btnRegister:{
        width:'90%', 
        height:50, 
        backgroundColor:'#2ECC71', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row',
        marginBottom:100
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rememberMe:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
        height:35,
        marginLeft: Dimensions.get('screen').width * 0.05,
    }
});

export default Login;
