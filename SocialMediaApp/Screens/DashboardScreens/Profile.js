import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { auth, getAllPosts, getUserData } from '../../firebase';
import * as SecureStore from 'expo-secure-store';
import { useUserContext } from '../../UserContext';
import { unregisterIndieDevice } from 'native-notify';

const screenwidth = Dimensions.get('screen').width;

export default function Profile({navigation}) {
  const user = auth.currentUser;
  
  const [refreshing, setRefreshing] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const {profilePictureUrl, setProfilePictureUrl} = useUserContext();
  const {username, setUsername} = useUserContext();
  const {nameSurname, setNameSurname} = useUserContext();
  const {myPrivacy, setMyPrivacy} = useUserContext();
  const {biography, setBiography} = useUserContext();
  const {followers, setFollowers} = useUserContext();
  const {followings, setFollowings} = useUserContext();
  const { handleReset } = useUserContext();

  useEffect(() => {
    const getData = async () => {
      const usersdata = await getUserData(user.uid);
      if(usersdata){
        setUsername(usersdata.username);
        setNameSurname(usersdata.namesurname);
        setMyPrivacy(usersdata.myPrivacy);
        setBiography(usersdata.biography);
        setFollowers(usersdata.followers);
        setFollowings(usersdata.followings);
        setProfilePictureUrl(usersdata.profilePictureUrl);
      }
      const userposts = await getAllPosts(user.uid);
      setImages(userposts.reverse());
      setRefreshing(false);
    };
    if(refreshing){
      getData();
    }
  }, [refreshing])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const navigatePostScreen = ({ useruid, posttime, fromPage }) => {
    navigation.navigate('PostScreen', { useruid, posttime, fromPage });
  };
  
  const navigateSettings = () => {
    navigation.navigate('Settings');
  }

  const navigateFollowers = () => {
    navigation.navigate('Followers', { followers });
  };

  const navigateFollowing = () => {
    navigation.navigate('Following', { followings });
  }

  const navigateEditInformation = (profilePictureUrl, namesurname, username, biography) => {
    navigation.navigate('EditInformation', { profilePictureUrl, namesurname, username, biography });
  }

  const navigateLogin = () => {
    unregisterIndieDevice(user.uid, 23219, '9bI6BBJvF01eIrM8FAoiPw');
    auth
        .signOut()
        .then(() => {
            console.log('User signed out!');
            SecureStore.deleteItemAsync('email');
            SecureStore.deleteItemAsync('password');
            SecureStore.deleteItemAsync('rememberMe');
            navigation.navigate('Login');
            handleReset();
        })
        .catch(error => {
            console.error('Sign out error', error);
        });
  };

  const handleExit = () => {
    Alert.alert(
        'Çıkış Yap',
        'Hesaptan çıkmak istediğinize emin misiniz?',
        [
            { text: 'Hayır', style: 'cancel' },
            { text: 'Evet', onPress: () => { navigateLogin();} }
        ]
    );
    return true;
  };

  const openModal = () => {
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.topContainer}>
        <Text style={{fontSize:22, fontWeight:'bold'}}>
          {username}  {myPrivacy ? 
                        <FontAwesome name="lock" size={20} />
                        :
                        <FontAwesome name="unlock" size={20} />
                        }
        </Text>
        <TouchableOpacity onPress={navigateSettings}>
          <AntDesign name="setting" size={25} style={{marginRight:3}}/>
        </TouchableOpacity>
      </View>
      <View style={styles.midContainer}>
        <TouchableOpacity onPress={openModal}>
        <Image
          style={styles.profilePicture}
          source={profilePictureUrl ? { uri: profilePictureUrl } : require('../../assets/Images/userphoto.jpg')}
        />
        </TouchableOpacity>
        <View style={{flexDirection:'row', marginHorizontal:30, justifyContent:'space-between', flex:1}}>
          <View style={styles.midRightContainer}>
            <Text style={styles.numbers}>{images.length}</Text>
            <Text>gönderi</Text>
          </View>
          <TouchableOpacity style={styles.midRightContainer} onPress={navigateFollowers}>
            <Text style={styles.numbers}>{followers.length}</Text>
            <Text>takipçi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.midRightContainer} onPress={navigateFollowing}>
            <Text style={styles.numbers}>{followings.length}</Text>
            <Text>takip</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.midContainer2}>
        <Text style={{fontWeight:'bold'}}>{nameSurname}</Text>
        <Text>{biography}</Text>
      </View>
      <View style={styles.midContainer3}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigateEditInformation(
          profilePictureUrl, nameSurname, username, biography
        )}
        >
          <Text style={{fontWeight:'bold', fontSize:17}}>Bilgileri Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleExit}>
          <Text style={{fontWeight:'bold', fontSize:17}}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>
      <View style={styles.bottomContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            onPress={() => navigatePostScreen({ useruid: user.uid, posttime: image.posttime, fromPage: 'Profile' })}
            key={index}
          >
            <Image
            style={styles.posts}
            source={!(image.posttype === "video") ? { uri: image.posturl } : require('../../assets/Images/videophoto.png')}
            />
          </TouchableOpacity>
        ))}
      </View>


      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <Image
              style={styles.fullImage}
              source={profilePictureUrl ? { uri: profilePictureUrl } : require('../../assets/Images/userphoto.jpg')}
            />
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'white',
  },
  topContainer:{
    padding:15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  midContainer:{
    flexDirection:'row',
    alignItems:'center',
    paddingLeft:15,
  },
  midContainer2:{
    paddingLeft:20,
    marginVertical:5,
  },
  midContainer3:{
    paddingHorizontal:20,
    marginTop:5,
    marginBottom:5,
    justifyContent:'space-around',
    flexDirection:'row',
  },
  midRightContainer:{
    alignItems:'center',
  },
  bottomContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom:50,
  },
  profilePicture:{
    width:80,
    height:80,
    borderRadius:40,
  },
  numbers:{
    fontWeight:'bold',
    fontSize:17,
  },
  posts:{
    width: screenwidth * 0.325,
    height: screenwidth * 0.325,
    margin: screenwidth * 0.004,
  },
  button:{
    width: screenwidth * 0.4,
    height: 30,
    backgroundColor:'#EAE1E1',
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center',
  },
  line:{
    width:screenwidth * 0.8,
    borderWidth:1,
    marginLeft: screenwidth * 0.1,
    marginVertical:10,
    borderColor:'#EAE1E1',
  },
  modalBackground:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer:{
    width: '100%',
    height: '100%',
  },
  fullImage:{
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  backButtonContainer:{
    paddingVertical: Dimensions.get('window').height * 0.025,
  },
  backButton:{
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
