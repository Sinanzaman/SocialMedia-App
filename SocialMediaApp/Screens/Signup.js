import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { auth, SetUser } from '../firebase';
import Icon from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useState } from 'react';

const Signup = ({navigation}) => {

    const navigateBack = () => {
        navigation.navigate('Login');
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [namesurname, setNamesurname] = useState('');
    const [username, setUsername] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [isEyeEnabled, setIsEyeEnabled] = useState(false);

    const handleSignUp = () => {
        if(password === passwordAgain && namesurname && username){
            auth
            .createUserWithEmailAndPassword(email, password)
            .then((userCredentials) => {
              const user = userCredentials.user;
              console.log('Kullanıcı ', user.email);
              alert("Mail adresinizi kontrol edin. Doğrulama linki gönderilmiştir",[{text:"Tamam" ,onPress:navigateBack()}]);
              SetUser(namesurname, username);
              setNamesurname("");
              setUsername("");
              setEmail("");
              setPassword("");
              return user.sendEmailVerification();
            })
            .catch((error) => alert(error.message));
          }else{
            alert("Şifreler uyuşmuyor veya eksik bilgiler var !");
          }
        };

    const handleEyeChange = () => {
        if(isEyeEnabled == true){
            setIsEyeEnabled(false);
        }else{
            setIsEyeEnabled(true);
        }
    }

    return(
        <ScrollView>
            <View style={styles.container}>
                {/*Top View*/}
                <View style={styles.topView}>
                    <View>
                        <TouchableOpacity style={{flexDirection:'row'}} onPress ={navigateBack}>
                            <View style={{width:30, height:30, borderWidth:1, marginLeft:25,borderColor:'white', alignItems:'center', justifyContent:'center', borderRadius:10}}>
                                <AntDesign name="left" size={20} style={{color:'#FFFCFC'}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Image style={styles.image}
                            source={require('../assets/Images/information.png')}
                        />
                    </View>
                </View>

                {/*Buttom View*/}
                <View style={styles.bottomView}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{marginTop:10, fontSize:24, fontWeight:'bold'}}>Hesap Oluştur</Text>
                        <Text style={{marginTop:2, fontSize:13}}>Hesap oluşturmak için lütfen bilgileri giriniz</Text>
                    </View>
                    {/*name and surname*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:15}}>
                        <View style={styles.txtEmail}>
                            <AntDesign name="user" size={30} style={{marginLeft:15, color:'#818181'}}/>
                            <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                            <TextInput
                                style={{height:50,width:'100%', fontSize:15, marginLeft:15, color:'#818181'}}
                                placeholder='Ad Soyad'
                                value={namesurname}
                                onChangeText={(text)=> setNamesurname(text)}
                                maxLength={25}
                            />
                        </View>
                    </View>
                    {/*username*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20}}>
                        <View style={styles.txtEmail}>
                            <AntDesign name="user" size={30} style={{marginLeft:15, color:'#818181'}}/>
                            <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                            <TextInput
                                style={{height:50,width:'100%', fontSize:15, marginLeft:15, color:'#818181'}}
                                placeholder='Kullanıcı Adı'
                                value={username}
                                onChangeText={(text)=> setUsername(text)}
                                maxLength={25}
                            />
                        </View>
                    </View>
                    {/*e-mail*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20}}>
                        <View style={styles.txtnamesurname}>
                            <Icon name="email" size={30} style={{marginLeft:15, color:'#818181'}}/>
                            <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                            <TextInput
                                style={{height:50,width:'100%', fontSize:15, marginLeft:15, color:'#818181'}}
                                placeholder='E-posta'
                                value={email}
                                onChangeText={(text)=> setEmail(text)}
                                maxLength={30}
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
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={!isEyeEnabled}
                                maxLength={30}
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
                                placeholder='Şifreyi Tekrar Giriniz'
                                value={passwordAgain}
                                onChangeText={(text)=> setPasswordAgain(text)}
                                secureTextEntry={!isEyeEnabled}
                                maxLength={30}
                            />
                            {isEyeEnabled 
                            ? 
                            <TouchableOpacity>
                                <Feather name="eye" size={30} style={{color:'#818181'}} onPress={handleEyeChange}/> 
                            </TouchableOpacity>
                            : 
                            <TouchableOpacity>
                                <Feather name="eye-off" size={30} style={{color:'#818181'}} onPress={handleEyeChange}/> 
                            </TouchableOpacity> 
                            }
                            
                        </View>
                    </View>
                    {/*btn Sing In*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20,}}>
                        <TouchableOpacity style={styles.btnSingIn} onPress={handleSignUp}>
                            <Text style={{color:'#FFFCFC', fontSize:20, marginLeft:110, fontWeight:'bold'}}>Kayıt Ol</Text>
                            <AntDesign name="rightcircle" size={20} style={{marginLeft:100, color:'#FFFCFC'}}/>
                        </TouchableOpacity>
                    </View>
                     {/*Already have an account*/}
                     <View style={{justifyContent:'center', alignItems:'center', marginTop:6,}}>
                        <TouchableOpacity style={styles.forget} onPress ={navigateBack}>
                            <Text style={{fontSize:15, fontWeight:'bold'}}>Zaten hesabın var mı ? <Text style={{color:'blue'}}>Giriş Yap</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'#2980B9',
        justifyContent:'center'
    },

    topView:{
        width:'100%',
        height:'35%',
        justifyContent:'center',
    },

    image:{
        width:260, 
        height:160,
    },

    bottomView:{
        width:'100%',
        height:'65%',
        backgroundColor:'#F4F4F4',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },

    txtEmail:{
        width:'90%', 
        height:40, 
        borderColor:'#818181', 
        borderWidth:1, 
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center' 
    },

    txtPassword:{
        width:'90%', 
        height:40, 
        borderColor:'#818181', 
        borderWidth:1, 
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center' 
    },
    txtnamesurname:{
        width:'90%', 
        height:40, 
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
        flexDirection:'row',
        
    },

    forget:{
        width:'90%', 
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row',
        marginBottom:100
    },
});

export default Signup;