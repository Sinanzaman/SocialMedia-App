import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal, TextInput, Alert, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { getUserData, getPost, DeleteMyPost, LikePost, UnlikePost, AddFavorite, Deletefavorite, auth, updateMyPost, SetComment, SendPostLikeNotification, SendPostCommentNotification } from '../firebase';
import CommentBox from './CommentBox';
import LikeBox from './LikeBox';
import { Video } from 'expo-av';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

export default function Post({ useruid, posttime, fromPage }) {
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [postUrl, setPostUrl] = useState(null);
  const [postType, setPostType] = useState(null);
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [desc, setDesc] = useState('');
  const [editdesc, setEditDesc] = useState('');
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [aspectRatio, setAspectRatio] = useState([1,1]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [visibleLike, setVisibleLike] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [likeModalVisible, setLikeModalVisible] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);
  const navigation = useNavigation();

  const user = auth.currentUser;

  useEffect(() => {
    const getData = async () => {
      const postData = await getPost(useruid, posttime);
      const usersdata = await getUserData(useruid);
      const currentusersdata = await getUserData(user.uid);
      if (postData && usersdata && currentusersdata) {
        setProfilePictureUrl(usersdata.profilePictureUrl);
        setPostUrl(postData.posturl);
        setPostType(postData.type);
        setUsername(usersdata.username);
        setCurrentUsername(currentusersdata.username);
        setDesc(postData.desc);
        setLikes(postData.likes);
        setComments(postData.comments);
        setAspectRatio(postData.aspectRatio);

        setIsLiked(postData.likes.includes(user.uid));
        setIsFavorited(postData.favorited.includes(user.uid));
      }
    };
    getData();
  }, []);

  const getChanges = async () =>{
    const user = auth.currentUser;
    const postData = await getPost(useruid, posttime);
    if (postData) {
      setComments(postData.comments);
      setLikes(postData.likes);
      setIsLiked(postData.likes.includes(user.uid));
      setIsFavorited(postData.favorited.includes(user.uid));
    }
  }
  
  const navigateBack = () => {
    navigation.goBack();
    if(isPlaying){
      handlePlayPause();
    }
  }

  const navigateProfile = ({ useruid }) => {
    navigation.navigate('ProfileScreen', { useruid });
    if(isPlaying){
      handlePlayPause();
    }
  }

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  const handleCommentModalToggle = async () => {
    setCommentModalVisible(!commentModalVisible);
    await getChanges();
  };

  const handleCommentDelete = async () => {
    await getChanges();
  };

  const handleLikeModalToggle = () => {
    setLikeModalVisible(!likeModalVisible);
  };

  const handleEditPost = () => {
    handleModalToggle();
    setEditDesc(desc);
    setIsUpdating(true);
  }

  const handleExitEditPost = () => {
    setIsUpdating(false);
  }

  const handleDeletePost = async () => {
    setIsDeleted(true);
    handleModalToggle();
    await DeleteMyPost(posttime, postUrl);
    if (fromPage === 'Home' || fromPage === 'Explore' || fromPage === 'Search') {
    }else{
      navigateBack();
    }
  };

  const handleLike = async ({useruid, posttime}) => {
    await LikePost(useruid, posttime);
    SendPostLikeNotification(useruid, currentUsername)
    setIsLiked(!isLiked);
    await getChanges();
  }

  const handleUnlike = async ({useruid, posttime}) => {
    await UnlikePost(useruid, posttime);
    setIsLiked(!isLiked);
    await getChanges();
  }

  const handleAddFavorite = async ({useruid, posttime}) => {
    await AddFavorite(useruid, posttime);
    setIsFavorited(!isFavorited);
    await getChanges();
  }

  const handleDeletefavorite = async ({useruid, posttime}) => {
    await Deletefavorite(useruid, posttime);
    setIsFavorited(!isFavorited);
    await getChanges();
  }

  const handleSendComment = async () => {
    await SetComment(useruid, posttime, newComment );
    SendPostCommentNotification(useruid, currentUsername, newComment);
    await getChanges();
    setNewComment('');
  }

  const handleDoubleTap = ({ useruid, posttime }) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      if (!isLiked) {
        setVisibleLike(true);
        setTimeout(() => {
          setVisibleLike(false);
          handleLike({ useruid, posttime });
        }, 500);
      }else{
        setVisibleLike(true);
        setTimeout(() => {
          setVisibleLike(false);
        }, 500);
      }
    } else {
      setLastTap(now);
    }
  };  

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day} ${month} ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleUpdate = () => {
    const callback = updateMyPost(posttime, editdesc);
    setDesc(editdesc);
    if(callback){
      handleExitEditPost();
      Alert.alert('Güncelleme Başarılı');
    }else{
      Alert.alert('Güncelleme Başarısız, Tekrar Deneyiniz');
    };
  };

  const renderCommentsItem = ({ item }) => (
    <CommentBox 
      useruid={useruid}
      postowner={item.postowner}
      posttime={posttime}
      comment={item.comment}
      commentowner={item.commentowner}
      profilePictureUrl={item.profilePictureUrl}
      username={item.username}
      onCommentPress={() => handleCommentModalToggle()}
      onDeletePress={() => handleCommentDelete()}
    />
  );

  const renderLikesItem = ({ item }) => (
    <LikeBox
      useruid={item}
      onCommentPress={() => handleLikeModalToggle()}
    />
  );

  const dynamicImageStyle = {
    width: screenWidth ,
    height: screenWidth * (aspectRatio[1] / aspectRatio[0]),
    resizeMode: 'cover',
  };

  const dynamicMediaContainerStyle = {
    width: '100%',
    height: screenWidth * (aspectRatio[1] / aspectRatio[0]),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  if(isUpdating){
    return(
    <>
    {
      <View style={styles.postContainer}>
        <Image
          style={dynamicImageStyle}
          source={postUrl ? { uri: postUrl } : require('../assets/Images/userphoto.jpg')}
        />
        <View style={styles.descContainer}>
          <Text style={{ fontWeight: 'bold' }}>Açıklamayı Düzelt : </Text>
        </View>
        <TextInput
              style={{height: 130, width: '100%', fontSize: 15 }}
              multiline={true}
              placeholder='Açıklama...'
              maxLength={300}
              numberOfLines={9}
              value={editdesc}
              onChangeText={(text) => setEditDesc(text)}
            />
        <View style={{flexDirection:'row', justifyContent:"space-around"}}>
        <TouchableOpacity style={[styles.button, { marginBottom: 30 }]} onPress={handleExitEditPost}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'white' }}>İptal Et</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginBottom: 30 }]} onPress={handleUpdate}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'white' }}>Güncelle</Text>
        </TouchableOpacity>
        </View>
      </View>
    }
    </>);
  }
  else
  {



    return (
      <>
        {username && comments && likes && !isDeleted &&
          <View style={styles.postContainer}>
            <View style={styles.topContainer}>
              <TouchableOpacity
              onPress={() => navigateProfile({ useruid })}
              >
                <Image
                  style={styles.profileImage}
                  source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
                />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <TouchableOpacity
                onPress={() => navigateProfile({ useruid })}
                >
                  <Text style={{ fontWeight: 'bold' }}>{username}</Text>
                </TouchableOpacity>
                <Text>{formatDateTime(posttime)}</Text>
              </View>
              <View>
                {user.uid === useruid &&
                <TouchableOpacity onPress={handleModalToggle}>
                  <MaterialCommunityIcons name="dots-horizontal" size={20} style={{ marginRight: 3, padding: 6 }} />
                </TouchableOpacity>
                }
              </View>
            </View>
            <View style={dynamicMediaContainerStyle}>
              <TouchableOpacity
              activeOpacity={1}
              onPress={() => handleDoubleTap({ useruid, posttime })}
              style={styles.touchableImage}
              >
                {!(postType == "video") &&
                  <Image
                    style={dynamicImageStyle}
                    source={postUrl ? { uri: postUrl } : require('../assets/Images/userphoto.jpg')}
                  />
                }
                {(postType == "video") &&
                  <TouchableOpacity activeOpacity={1} onPress={handlePlayPause}>
                    <Video
                      style={dynamicImageStyle}
                      source={{ uri: postUrl }}
                      resizeMode='cover'
                      ref={videoRef}
                      shouldPlay={isPlaying}
                      isLooping
                    />
                  </TouchableOpacity>
                }
                {!isPlaying && postType == "video" && 
                <TouchableOpacity style={{position:'absolute'}} onPress={handlePlayPause}>
                  <FontAwesome name="play" size={60} color={"white"} 
                  style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.9)',
                  textShadowRadius: 25,
                }} />
                </TouchableOpacity>
                }
                {visibleLike && <AntDesign name="heart" size={120} color={"red"} style={{ position:'absolute', }} />}
              </TouchableOpacity>
            </View>
            <View style={styles.buttonsContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {isLiked ?
                <TouchableOpacity onPress={() => handleUnlike({ useruid, posttime })}>
                  <AntDesign name="heart" size={25} color={"red"} style={{ paddingVertical: 4, paddingRight: 8, paddingLeft:3 }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => handleLike({ useruid, posttime })}>
                  <AntDesign name="hearto" size={25} style={{ paddingVertical: 4, paddingRight: 8, paddingLeft:3 }} />
                </TouchableOpacity>
                }
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={handleCommentModalToggle}>
                  <MaterialCommunityIcons name="comment-outline" size={25} style={{ padding: 4, paddingHorizontal: 8 }} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="send" size={25} style={{ padding: 4, paddingHorizontal: 8 }} />
                </TouchableOpacity>
              </View>
              <View>
                {isFavorited ?
                <TouchableOpacity onPress={() => handleDeletefavorite({ useruid, posttime })}>
                    <FontAwesome name="star" size={25} style={{ paddingVertical: 4, paddingLeft: 8 }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => handleAddFavorite({ useruid, posttime })}>
                  <FontAwesome name="star-o" size={25} style={{ paddingVertical: 4, paddingLeft: 8 }} />
                </TouchableOpacity>
                }
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={handleLikeModalToggle}>
                <Text style={{ marginRight: 5, fontWeight: 'bold' }}>{likes.length + " beğeni"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCommentModalToggle}>
                <Text style={{ marginRight: 5, fontWeight: 'bold' }}>{comments.length + " yorum"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.descContainer}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{`${username} `}</Text>{desc}
              </Text>
            </View>
  
            {/* Settings Modal */}
            <Modal
              transparent={true}
              visible={modalVisible}
              onRequestClose={handleModalToggle}
              animationType="slide"
            >
              <TouchableOpacity style={styles.modalContainer} onPress={handleModalToggle}>
                <View style={styles.modalContent}>
                  <TouchableOpacity onPress={handleDeletePost} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Sil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleEditPost} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Güncelle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleModalToggle} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Comments Modal */}
            <Modal
              transparent={true} 
              visible={commentModalVisible}
              onRequestClose={handleCommentModalToggle}
              animationType="slide"
              statusBarTranslucent={true}
            >
              <View style={styles.commentModalContainer}>
                <TouchableOpacity
                  style={{width: '100%', height: '30%'}}
                  onPress={handleCommentModalToggle}
                >
                </TouchableOpacity>
                <View style={styles.commentModalContent}>
                  <Text style={{marginBottom:5}}>{comments.length} yorum</Text>
                  <View style={styles.writeCommentContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Yorumunuzu yazın..."
                      value={newComment}
                      onChangeText={setNewComment}
                      multiline={true}
                      maxLength={400}
                    />
                    {newComment &&
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendComment}
                        >
                        <Text style={styles.sendButtonText}>Gönder</Text>
                      </TouchableOpacity>
                    }
                  </View>
                {comments.length ?
                <>
                <FlatList
                  style={{width:'100%'}}
                  data={comments}
                  renderItem={renderCommentsItem}
                  keyExtractor={(item, index) => index.toString()}
                />
                </>
                :
                <Text style={{fontWeight:'bold'}}>Hiç Yorum Yok</Text>
                }
                </View>
              </View>
            </Modal>

            {/* Likes Modal */}
            <Modal
              transparent={true} 
              visible={likeModalVisible}
              onRequestClose={handleLikeModalToggle}
              animationType="slide"
              statusBarTranslucent={true}
            >
              <View style={styles.commentModalContainer}>
                <TouchableOpacity
                  style={{width: '100%', height: '30%'}}
                  onPress={handleLikeModalToggle}
                >
                </TouchableOpacity>
                <View style={styles.commentModalContent}>
                  <Text>{likes.length} beğeni</Text>
                {likes.length ?
                <FlatList
                  style={{width:'100%'}}
                  data={likes}
                  renderItem={renderLikesItem}
                  keyExtractor={(item, index) => index.toString()}
                />
                :
                <Text style={{fontWeight:'bold', marginTop:10}}>Hiç Beğeni Yok</Text>
                }
                </View>
              </View>
            </Modal>
          </View>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 6,
  },
  mediaContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 6,
  },
  mediaImage: {
    width: '100%',
    height: screenHeight * 0.5,
    resizeMode: 'cover',
  },
  touchableImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descContainer: {
    flexDirection: 'row',
    marginVertical: 3,
    alignItems: 'center',
  },
  topContainer: {
    marginLeft: 5,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  commentModalContent: {
    width: '100%',
    height: '70%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    marginVertical: 10,
    padding: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: screenWidth * 0.4,
    height: 30,
    backgroundColor: '#0597F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  writeCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  commentInput: {
    flex: 1,
    height: 'auto',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
