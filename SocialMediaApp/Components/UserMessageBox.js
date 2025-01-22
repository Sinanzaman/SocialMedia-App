import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { auth, getUserData, getMessages } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function UserMessageBox({ useruid }) {
  const [userData, setUserData] = useState(null);
  const [lastMessage, setLastMessage] = useState("");
  const [lastMessageOwner, setLastMessageOwner] = useState("");
  const navigation = useNavigation();

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData(useruid);
      setUserData(data);
    };
    const fetchMessage = async () => {
      const { lastMessage, lastMessageOwner } = await getMessages(useruid);
      if(lastMessage && lastMessageOwner){
      setLastMessage(lastMessage);
      setLastMessageOwner(lastMessageOwner);
      }
    };
    fetchUserData();
    fetchMessage();
  }, [useruid]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  const { profilePictureUrl, namesurname } = userData;

  const navigateMessageScreen = ({ useruid: useruid }) => {
    navigation.navigate('MessageScreen', { useruid });
  }

  return (
    <TouchableOpacity
    style={styles.container}
    onPress={() => navigateMessageScreen({ useruid: useruid })}
    >
        <Image
          style={styles.profilePicture}
          source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
        />
        <View style={{ marginLeft: 10, flex:1}}>
          <Text style={{ fontWeight: 'bold'}}>{namesurname}</Text>
          {(lastMessage && lastMessageOwner) ?
            <Text numberOfLines={1} ellipsizeMode='tail'>
              {lastMessageOwner == user.uid ? `Sen : ${lastMessage}` : lastMessage }
            </Text>
            :
            <Text style={{fontWeight:'bold'}}>Mesaj Başlatmak için Dokun</Text>
          }
        </View>
        <AntDesign name="right" size={20} style={{marginLeft:20, color:'black'}}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:70,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
    },
    profilePicture:{
        width:50,
        height:50,
        borderRadius:25,
    },
})
