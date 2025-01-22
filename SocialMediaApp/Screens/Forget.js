import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { auth } from '../firebase';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Forget = ({navigation}) => {

    const navigateBack = () => {
        navigation.navigate('Login');
    }

    const handleReset = () => {
        auth
          .sendPasswordResetEmail(email)
          .then(() => {
            console.log('Kullanıcı şifresi yenileme isteği');
            alert(`İstek gönderildi. Lütfen mail kutunuzu kontrol ediniz. 
            (!!! Maili göremiyorsanız spam kutunuzu kontrol etmeyi unutmayın !!!)`);
          })
          .catch((error) => alert(error.message));
        };

    const [email, setEmail] = useState('');

    return(
        <ScrollView>
            <View style={styles.container}>
                {/*Top View*/}
                <View style={styles.topView}>
                    <View>
                        <TouchableOpacity style={{flexDirection:'row',}} onPress={navigateBack}>
                            <View style={{width:30, height:30, borderWidth:1, marginLeft:25,borderColor:'white', alignItems:'center', justifyContent:'center', borderRadius:10}}>
                                <AntDesign name="left" size={20} style={{color:'#FFFCFC'}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <Image style={styles.image}
                            source={require('../assets/Images/password.png')}
                        />
                    </View>
                </View>

                {/*Buttom View*/}
                <View style={styles.bottomView}>
                    <View style={{justifyContent:'center', alignItems:'center', }}>
                        <Text style={{marginTop:15, fontSize:16, fontWeight:'bold', textAlign:'center', width:'88%'}}>Lütfen kayıtlı E-mail adresinizi giriniz</Text>
                    </View>
                    {/*Txt Email*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20}}>
                        <View style={styles.txtEmail}>
                            <Icon name="email" size={30} style={{marginLeft:15, color:'#818181'}}/>
                            <View style={{ height: '100%', width: 1, backgroundColor: '#818181', marginLeft:15}}></View>
                            <TextInput
                                style={{height:50,width:'100%', fontSize:15, marginLeft:15, color:'#818181'}}
                                placeholder='E-mail'
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            />
                        </View>
                    </View>
                    
                    {/*btn Send reset link*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:20,}}>
                        <TouchableOpacity style={styles.btnSingIn} onPress={handleReset}>
                            <Text style={{color:'#FFFCFC', fontSize:20, fontWeight:'bold'}}>Sıfırla</Text>
                        </TouchableOpacity>
                    </View>
                    {/*Forgot your password*/}
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:10}}>
                        <TouchableOpacity style={styles.forget} onPress={navigateBack}>
                            <Text style={{fontSize:15, fontWeight:'bold',color:'blue'}}>Giriş'e Dön</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <StatusBar style="auto" />
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
        height:'50%',
        justifyContent:'center',
    },

    image:{
        width:300, 
        height:200,
    },


    bottomView:{
        width:'100%',
        height:'50%',
        paddingTop:20,
        backgroundColor:'#F4F4F4',
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
    },

    txtEmail:{
        width:'90%', 
        height:50, 
        borderColor:'#818181', 
        borderWidth:1, 
        borderRadius:15,
        marginTop:20,
        flexDirection:'row',
        alignItems:'center' 
    },

    btnSingIn:{
        width:'90%', 
        height:50, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        marginTop:20,
        borderRadius:15, 
        flexDirection:'row'
    },

    forget:{
        width:'90%', 
        height:50,
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15, 
        flexDirection:'row',
        marginBottom:150
    }
});

export default Forget;