import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, ScrollView,
RefreshControl, Modal, Pressable, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getAllPosts, getUserData, AddFollowing, DeleteFollowing, auth, AddFollowingRequest, DeleteFollowingRequest,
AcceptRequest, RejectRequest, DeleteFollower, SendRequestNotification, SendRequestAcceptedNotification} from '../firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserContext } from '../UserContext';

const screenwidth = Dimensions.get('screen').width;

export default function ProfileScreen({navigation, route}) {
  const { useruid } = route.params;
  const [refreshing, setRefreshing] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingmodalVisible, setSettingModalVisible] = useState(false);
  const [userData, setUserData] = useState();
  const [images, setImages] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingMe, setIsFollowingMe] = useState(false);
  const [userPrivacy, setUserPrivacy] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isThereRequest, setIsThereRequest] = useState(false);

  const { username: myusername, followings: myfollowings } = useUserContext();

  const user = auth.currentUser;

  useEffect(() => {
    const getData = async () => {
      const usersdata = await getUserData(useruid);
      const mydata = await getUserData(user.uid);
      if(usersdata){
        setUserData(usersdata);
        setIsFollowing(usersdata.followers.includes(user.uid));
        setIsFollowingMe(usersdata.followings.includes(user.uid));
        setUserPrivacy(usersdata.myPrivacy);
        setRequestSent(usersdata.followingRequests.includes(user.uid));
        setIsThereRequest(mydata.followingRequests.includes(useruid));
      }
      const userposts = await getAllPosts(useruid);
      setImages(userposts.reverse());
      setRefreshing(false);
    };
    getData();
  }, [refreshing, useruid])

  const navigateBack = () => {
    navigation.goBack();
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const navigatePostScreen = ({ useruid, posttime, fromPage }) => {
    navigation.navigate('PostScreen', { useruid, posttime, fromPage });
  };

  const navigateFollowers = (followers) => {
    navigation.navigate('Followers', { followers });
  };

  const navigateFollowing = (followings) => {
    navigation.navigate('Following', { followings });
  }

  const handleAddFollowingRequest = async ({useruid}) => {
    setRequestSent(true);
    SendRequestNotification(useruid, myusername);
    await AddFollowingRequest(useruid);
    setRefreshing(true);
  }

  const handleDeleteFollowingRequest = async ({useruid}) => {
    setRequestSent(false);
    await DeleteFollowingRequest(useruid);
    setRefreshing(true);
  }

  const handleAcceptRequest = async ({useruid}) => {
    await AcceptRequest(useruid);
    SendRequestAcceptedNotification(useruid, myusername);
    setRefreshing(true);
  }
  
  const handleRejectRequest = async ({useruid}) => {
    await RejectRequest(useruid);
    setRefreshing(true);
  }

  const handleAddFollowing = async ({useruid}) => {
    await AddFollowing(useruid);
    setRefreshing(true);
  }

  const handleDeleteFollowing = async ({useruid}) => {
    await DeleteFollowing(useruid);
    setRefreshing(true);
  }

  const handleDeleteFollower = async ({ useruid }) => {
    Alert.alert(
      'Takipten Çıkar',
      'Bu kişiyi takipten çıkarmak istediğinize emin misiniz?',
      [
          { text: 'Hayır', style: 'cancel' },
          { text: 'Evet', onPress: async () => {
              setSettingModalVisible(false);
              await DeleteFollower(useruid);
              setRefreshing(true);
            },
          }
      ]
    );
  };

  const navigateMessageScreen = ({ useruid: useruid }) => {
    navigation.navigate('MessageScreen', { useruid });
  }

  const openModal = () => {
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const openSettingModal = () => {
    setSettingModalVisible(true);
  }

  const closeSettingModal = () => {
    setSettingModalVisible(false);
  }

  const navigateEditInformation = (profilePictureUrl, namesurname, username, biography) => {
    navigation.navigate('EditInformation', { profilePictureUrl, namesurname, username, biography });
  }

  return (
  <>
  {userData && images &&
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.backButtonContainer}>
          <TouchableOpacity style={{flexDirection:'row', alignItems:'center' }} onPress={navigateBack}>
              <View style={styles.backButton}>
                  <AntDesign name="left" size={20} />
              </View>
              <Text style={{marginLeft:5, fontWeight:'bold', flex:1}}>{userData.username}</Text>
              {(useruid !== user.uid) &&
                <TouchableOpacity onPress={openSettingModal}>
                  <MaterialCommunityIcons name="dots-horizontal" size={20} style={{ marginRight: 3, padding: 6 }} />
                </TouchableOpacity>
              }
          </TouchableOpacity>
      </View>
      <View style={styles.midContainer3}>
      {isThereRequest &&
        <>
          <TouchableOpacity
            style={[styles.button,{backgroundColor:'#0195F7'}]}
            onPress={() => handleAcceptRequest({ useruid: useruid })}
            >
            <Text style={{fontWeight:'bold', fontSize:17}}>İsteği Onayla</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRejectRequest({ useruid: useruid })}
            >
            <Text style={{fontWeight:'bold', fontSize:17}}>Reddet</Text>
          </TouchableOpacity>
        </>
      }
      </View>
      <View style={styles.midContainer}>
        <TouchableOpacity onPress={openModal}>
          <Image
            style={styles.profilePicture}
            source={userData.profilePictureUrl ? { uri: userData.profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
          />
        </TouchableOpacity>
        <View style={{flexDirection:'row', marginHorizontal:30, justifyContent:'space-between', flex:1}}>
          <View style={styles.midRightContainer}>
            <Text style={styles.numbers}>{images.length}</Text>
            <Text>gönderi</Text>
          </View>
          <TouchableOpacity
          style={styles.midRightContainer}
          onPress={() => navigateFollowers(userData.followers)}
          disabled={!(isFollowing || !userPrivacy || (userPrivacy && isFollowing) || (useruid === user.uid))}
          >
            <Text style={styles.numbers}>{userData.followers.length}</Text>
            <Text>takipçi</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={styles.midRightContainer}
          onPress={() => navigateFollowing(userData.followings)}
          disabled={!(isFollowing || !userPrivacy || (userPrivacy && isFollowing) || (useruid === user.uid))}
          >
            <Text style={styles.numbers}>{userData.followings.length}</Text>
            <Text>takip</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.midContainer2}>
        <Text style={{fontWeight:'bold'}}>{userData.namesurname}</Text>
        <Text>{userData.biography ? userData.biography : ""}</Text>
      </View>
      <View style={styles.midContainer3}>
        {!(useruid === user.uid) ?
        <>
        {!isFollowing ?
        <>
        {userPrivacy ?
          <>
          {!requestSent ?
            <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddFollowingRequest({ useruid: useruid })}
            >
              <Text style={{fontWeight:'bold', fontSize:17}}>İstek Gönder</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
            style={styles.button}
            onPress={() => handleDeleteFollowingRequest({ useruid: useruid })}
            >
              <Text style={{fontWeight:'bold', fontSize:17}}>İstek Gönderildi</Text>
            </TouchableOpacity>
          }
          </>
          :
          <TouchableOpacity
          style={styles.button}
          onPress={() => handleAddFollowing({ useruid: useruid })}
          >
            <Text style={{fontWeight:'bold', fontSize:17}}>Takip Et</Text>
          </TouchableOpacity>
        }
        </>
        :
        <TouchableOpacity
        style={styles.button}
        onPress={() => handleDeleteFollowing({ useruid: useruid })}
        >
          <Text style={{fontWeight:'bold', fontSize:17}}>Takipten Çık</Text>
        </TouchableOpacity>
        }
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigateMessageScreen({ useruid: useruid })}
        >
          <Text style={{fontWeight:'bold', fontSize:17}}>Mesaj</Text>
        </TouchableOpacity>
        </>
        :
        <>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigateEditInformation(
          userData.profilePictureUrl, userData.namesurname, userData.username, userData.biography
        )}
        >
          <Text style={{fontWeight:'bold', fontSize:17}}>Bilgileri Düzenle</Text>
        </TouchableOpacity>
        </>
        }
      </View>
      <View style={styles.line}></View>
      {(isFollowing || !userPrivacy || (userPrivacy && isFollowing) || (useruid === user.uid)) ?
        <View style={styles.bottomContainer}>
          {images.map((image, index) => (
            <TouchableOpacity
            onPress={() => navigatePostScreen({ useruid: useruid, posttime: image.posttime, fromPage: 'ProfileScreen' })}
            key={index}
            >
              <Image
              style={styles.posts}
              source={!(image.posttype === "video") ? { uri: image.posturl } : require('../assets/Images/videophoto.png')}
              />
            </TouchableOpacity>
          ))}
        </View>
        :
        <View style={{alignItems:'center', marginTop: screenwidth * 0.1}}>
          <FontAwesome name="lock" size={50} />
          <Text style={{fontWeight:'bold'}}>Kullanıcı Profili Gizli</Text>
          <Text style={{fontWeight:'bold'}}>Görüntülemek için Takip Edin</Text>
        </View>
      }

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
              source={userData.profilePictureUrl ? { uri: userData.profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
            />
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={settingmodalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSettingModal}
        statusBarTranslucent={true}
      >
        <TouchableOpacity style={styles.modalContainer2} onPress={closeSettingModal}>
          <View style={styles.modalContent2}>
            {isFollowingMe &&
            <TouchableOpacity
            style={styles.modalButton2}
            onPress={() => handleDeleteFollower({ useruid: useruid })}
            >
              <Text style={{color:'red', fontWeight:'bold'}}>Takipçiyi Çıkar</Text>
            </TouchableOpacity>
            }
            <TouchableOpacity
            style={styles.modalButton2}
            onPress={() => navigateMessageScreen({ useruid: useruid })}
            >
              <Text style={{fontWeight:'bold'}}>Mesaj Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.modalButton2}
            onPress={() => navigation.navigate('Following', { myfollowings })}          // burası hatalı, düzelt
            >
              <Text style={{fontWeight:'bold'}}>Profili Paylaş</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
    }</>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
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
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-around',
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
    marginRight:15,
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
  modalContainer2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent2: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton2: {
    marginVertical: 10,
    padding: 5,
    width: '100%',
    alignItems: 'center',
  },
})
