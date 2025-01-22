import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import NotificationBox from '../Components/NotificationBox';
import { auth, getUserData } from '../firebase';

export default function NotificationScreen({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const [userPrivacy, setUserPrivacy] = useState(false);
  const [requests, setRequests] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    const getData = async () => {
      const usersdata = await getUserData(user.uid);
      if(usersdata){
        setUserPrivacy(usersdata.myPrivacy);
        setRequests(usersdata.followingRequests);
      }
      setRefreshing(false);
    };
    getData();
  }, [refreshing])

  const navigateBack = () => {
      navigation.navigate('Home');
  }

  const navigateRequestScreen = (requests) => {
      navigation.navigate('RequestScreen', { requests });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  return (
    <ScrollView
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
        <View style={styles.backButton}>
          <AntDesign name="left" size={20} />
        </View>
        <Text style={{marginLeft:5, fontWeight:'bold'}}>Bildirimler</Text>
      </TouchableOpacity>
        <View>
            <TouchableOpacity
            style={styles.followrequest}
            onPress={() => navigateRequestScreen(requests)}
            >
                <Text style={styles.followrequestText}>Takip İstekleri</Text>
                <Text style={{marginRight:10, fontWeight:'bold'}}>{requests.length}</Text>
                <AntDesign style={{marginRight:10}} name="right" size={20} />
            </TouchableOpacity>
        </View>
      <Text style={{fontWeight:'bold', marginBottom:10}}>Son Bildirimler</Text>
      <View>
        <NotificationBox/>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        padding:15,
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
        borderColor:'black',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
      },
      followrequest:{
        flexDirection:'row',
        borderWidth:1,
        borderRadius:10,
        paddingVertical:8,
        borderColor:'grey',
        marginBottom:10,
      },
      followrequestText:{
        fontWeight:'bold',
        flex:1,
        marginLeft:10,
      }
})