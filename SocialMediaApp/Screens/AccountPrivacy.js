import { Dimensions, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useUserContext } from '../UserContext';
import { SetMyPrivacy } from '../firebase';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function AccountPrivacy({navigation}) {
    const {myPrivacy, setMyPrivacy} = useUserContext();

    const navigateBack = () => {
        navigation.navigate('Settings');
    }

    const handleSetPrivacy = () => {
        SetMyPrivacy(!myPrivacy);
        setMyPrivacy(!myPrivacy);
    }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
            <View style={styles.backButton}>
                <AntDesign name="left" size={20} />
            </View>
            <Text style={{marginLeft:5, fontWeight:'bold'}}>Ayarlara Dön</Text>
        </TouchableOpacity>
        <View style={{width: screenWidth * 0.9,alignItems:'center', alignSelf:'center', flexDirection:'row'}}>
            <Text style={{fontSize:20, fontWeight:'bold', flex:1}}>Gizli Hesap</Text>
            <Switch
                /* trackColor={{ false: "#767577", true: "#81b0ff" }} */
                /* thumbColor={true ? "#f5dd4b" : "#f4f3f4"} */
                value={myPrivacy}
                onValueChange={handleSetPrivacy}
                style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}
            />
        </View>
        <View style={{width:'95%', alignSelf:'center', alignItems:'flex-start', marginTop:20}}>
            <Text style={styles.text}>Hesabınız herkese açık olduğunda profilini, takipçilerini ve takip ettiklerini herkes görebilir.</Text>
            <Text style={styles.text}>Hesabınız gizli olduğunda bu bilgilerinizi yalnızca sizi takip edenler görebilir.</Text>
        </View>
    </View>
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
    text:{
        fontSize:16,
        fontWeight:'bold',
        marginBottom:10,
    }
})