import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../firebase';

export default function UserFollowBox({ useruid }) {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  console.log("useruid: " + useruid)

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

  const navigateProfileScreen = () => {
    navigation.navigate('ProfileScreen', { useruid: useruid });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={navigateProfileScreen}>
      <Image
        style={styles.profilePicture}
        source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
      />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{namesurname}</Text>
        <Text style={{ color: 'gray', fontSize: 14 }}>{username}</Text>
      </View>
      <AntDesign name="right" size={20} style={{ marginLeft: 20, color: 'black' }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
