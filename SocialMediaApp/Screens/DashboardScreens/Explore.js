import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import Post from '../../Components/Post';
import { getRandomUserData } from '../../firebase';

export default function Explore() {
  const [refreshing, setRefreshing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Yükleniyor durumu
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const start = async () => {
      setRefreshing(false);
      setLoading(true);
      setPosts([]); // İlk başta gönderileri temizle
      const newPosts = await getMorePosts(5); // İlk 5 gönderiyi al
      setPosts(newPosts);
      console.log(newPosts);
      setLoading(false);
    };
  
    if (refreshing) {
      start();
    }
  }, [refreshing]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  // Yeni gönderileri almak için fonksiyon
  const getMorePosts = async (count) => {
    const newPosts = [];
    while (newPosts.length < count) {
      const randomposts = await getRandomUserData();
      if (randomposts && !newPosts.some(post => post.useruid === randomposts[0].useruid && post.posttime === randomposts[0].posttime)) {
        newPosts.push(randomposts[0]); // Tekil gönderi ekle
      }
    }
    return newPosts;
  };

  const loadMorePosts = async () => {
    setLoadingMore(true); // Yükleniyor durumunu aktif et
    const morePosts = await getMorePosts(5); // Daha fazla gönderi al
    setPosts(prevPosts => [...prevPosts, ...morePosts]); // Mevcut gönderilere ekle
    setLoadingMore(false); // Yükleniyor durumunu pasif et
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!(posts.length === 0) ? (
        <>
          {posts.map((post, index) => (
            <Post
              key={index}
              useruid={post.useruid}
              posttime={post.posttime}
              fromPage="Explore"
            />
          ))}
          <TouchableOpacity onPress={loadMorePosts} style={styles.loadMoreButton} disabled={loadingMore}>
            {loadingMore ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loadMoreText}>Daha Fazla</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          {!loading ? (
            <View>
              <Text style={{alignSelf:'center', marginTop:30, fontWeight:'bold', fontSize:18}}>Hiç Gönderi Yok !</Text>
              <Text style={{alignSelf:'center', fontWeight:'bold', fontSize:18, textAlign:'center'}}>
                Gönderi paylaşabilir veya başka kullanıcıları takip edebilirsin
              </Text>
            </View>
          ) : (
            <View>
              <Text style={{alignSelf:'center', marginTop:30, fontWeight:'bold', fontSize:20}}>Yükleniyor...</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Dimensions.get('window').height * 0.02,
  },
  loadMoreButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadMoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
