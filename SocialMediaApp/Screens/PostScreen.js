import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React from 'react'
import Post from '../Components/Post'
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function PostScreen({ route, navigation }) {
    const { useruid, posttime, fromPage } = route.params;

    const navigateBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={navigateBack}>
                <View style={styles.button}>
                    <AntDesign name="left" size={20} />
                </View>
                <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>Geri Dön</Text>
            </TouchableOpacity>
            <Post useruid={useruid} posttime={posttime} fromPage={fromPage}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        paddingVertical: Dimensions.get('window').height * 0.025,
    },
    button:{
        width:30,
        height:30,
        borderWidth:1,
        marginLeft:15,
        borderColor:'black',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
    },
})