import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, RefreshControl, Button, Alert } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Post from '../../Components/Post';
import { useUserContext } from '../../UserContext';
import { auth, getAllPosts, getUserData } from '../../firebase';

export default function Home({ navigation }) {

  const [refreshing, setRefreshing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(5);

  const { setProfilePictureUrl } = useUserContext();
  const { setUsername } = useUserContext();
  const { setNameSurname } = useUserContext();
  const { setMyPrivacy } = useUserContext();
  const { setBiography } = useUserContext();
  const { setFollowers } = useUserContext();
  const { setFollowings } = useUserContext();
  const { setMyFavorites } = useUserContext();

  useEffect(() => {
    const getData = async () => {
      setRefreshing(false);
      setLoading(true);
      const user = auth.currentUser;
      const useruid = user.uid;
      try {
        const usersdata = await getUserData(useruid);
        if (usersdata) {
          setUsername(usersdata.username);
          setNameSurname(usersdata.namesurname);
          setMyPrivacy(usersdata.myPrivacy);
          setBiography(usersdata.biography);
          setFollowers(usersdata.followers);
          setFollowings(usersdata.followings);
          setProfilePictureUrl(usersdata.profilePictureUrl);
          setMyFavorites(usersdata.myFavorites);

          const fetchAllPosts = async () => {
            let allFetchedPosts = [];
            for (const followingId of usersdata.followings) {
              const userPosts = await getAllPosts(followingId);
              const postsWithTimes = userPosts.map(post => ({
                followingId: followingId,
                posttime: post.posttime,
                ...post
              }));
              allFetchedPosts = [...allFetchedPosts, ...postsWithTimes];
            }
            const myPosts = await getAllPosts(useruid);
            const myPostsWithTimes = myPosts.map(post => ({
              followingId: useruid,
              posttime: post.posttime,
              ...post
            }));
            allFetchedPosts = [...allFetchedPosts, ...myPostsWithTimes];
            allFetchedPosts.sort((a, b) => new Date(b.posttime) - new Date(a.posttime));
            return allFetchedPosts;
          };
          setAllPosts([]);
          setPosts([]);
          setVisiblePosts(5);
          const fetchedPosts = await fetchAllPosts();
          setAllPosts(fetchedPosts);
          setPosts(fetchedPosts.slice(0, visiblePosts));
        }
        setLoading(false);
      } catch (error) {
        console.error('Veri alımı sırasında bir hata oluştu:', error);
      }
    };

    if (refreshing) {
      getData();
    }
  }, [refreshing, visiblePosts]);

  const navigateMessage = () => {
    navigation.navigate('Message');
  }

  const navigateNotification = () => {
    navigation.navigate('NotificationScreen');
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const loadMorePosts = () => {
    const newVisiblePosts = visiblePosts + 5;
    setVisiblePosts(newVisiblePosts);
    setPosts(allPosts.slice(0, newVisiblePosts)); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image style={styles.image} source={require('../../assets/Images/home_icon.png')} />
        <TouchableOpacity style={{ paddingRight: 10, flex:1, flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}} onPress={navigateNotification}>
          <MaterialIcons name="notifications-none" size={30} style={{ color: 'black' }} />
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingRight: 10, flexDirection:'row', alignItems:'center'}} onPress={navigateMessage}>
          <AntDesign name="message1" size={26} style={{ color: 'black' }} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!(posts.length == 0) ?
        <>
        {posts.map((post, index) => (
          <Post
            key={index}
            useruid={post.followingId}
            posttime={post.posttime}
            fromPage="Home"
          />
        ))}
        </>
        :
        <>
          {!loading ?
          <View>
            <Text style={{alignSelf:'center', marginTop:30, fontWeight:'bold', fontSize:18}}>Hiç Gönderi Yok !</Text>
            <Text style={{alignSelf:'center', fontWeight:'bold', fontSize:18, textAlign:'center'}}>
              Gönderi paylaşabilir veya başka kullanıcıları takip edebilirsin
            </Text>
          </View>
          :
          <>
            <View>
              <Text style={{alignSelf:'center', marginTop:30, fontWeight:'bold', fontSize:20}}>Yükleniyor...</Text>
            </View>
          </>
          }
        </>
        }
        {visiblePosts < allPosts.length && (
          <Button title="Daha Fazla" onPress={loadMorePosts} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    backgroundColor: 'white',
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  image: {
    width: 80,
    height: 50,
  },
  scrollView: {
    flex: 1,
    marginTop: 60,
  },
});