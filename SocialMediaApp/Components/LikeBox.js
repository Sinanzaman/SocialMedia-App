import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../firebase';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function LikeBox({ useruid, onCommentPress }) {
  const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
      const fetchUserData = async () => {
        const data = await getUserData(useruid);
        setUserData(data);
      };
  
      fetchUserData();
    }, [useruid]);
  
    if (!userData) {
      return (
        <View style={styles.container}>
          <Text>Yükleniyor...</Text>
        </View>
      );
    }
  
    const { profilePictureUrl, username, namesurname } = userData;
    
    if (!useruid && !comment) {
      return (
        <View style={styles.container}>
          <Text>Yükleniyor...</Text>
        </View>
      );
    }

    const navigateProfile = ({ useruid }) => {
        onCommentPress();
        navigation.navigate('ProfileScreen', { useruid });
    }

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigateProfile({ useruid })}><Image
      style={styles.profilePicture}
      source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
    />
    <View style={{ marginLeft: 10, flex: 1 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{namesurname}</Text>
      <Text style={{ color: 'gray', fontSize: 12 }}>{username}</Text>
    </View>
    <AntDesign name="right" size={20} style={{ marginLeft: 20, color: 'black' }} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
})