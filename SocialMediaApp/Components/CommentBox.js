import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { auth, DeleteComment} from '../firebase';

export default function CommentBox({ useruid, postowner, posttime, comment, commentowner, profilePictureUrl, username, onCommentPress, onDeletePress }) {
    const navigation = useNavigation();

    const user = auth.currentUser;
    const myuid = user.uid;

    console.log(useruid, postowner, posttime, comment, commentowner, profilePictureUrl, username)
    
      if (!useruid && !comment) {
        return (
          <View style={styles.container}>
            <Text>Yükleniyor...</Text>
          </View>
        );
      }

    const navigateProfile = ({ commentowner }) => {
      onCommentPress();
      navigation.navigate('ProfileScreen', { useruid: commentowner });
    }

    const handleDeleteComment = async () => {
      await DeleteComment(useruid, postowner, posttime, comment, profilePictureUrl, username, commentowner);
      onDeletePress();
    }

  return (
    <View style={styles.container} >
        <TouchableOpacity style={{flexDirection:'row'}} onPress={() => navigateProfile({ commentowner })}>
            <Image
            style={styles.profilePicture}
            source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
            />
            <Text style={{ fontWeight: 'bold', paddingLeft:5, alignSelf:'center', flex:1}}>{username}</Text>
            {(myuid == postowner || myuid == commentowner) &&
              <TouchableOpacity
              style={{ fontWeight: 'bold', paddingLeft:5, alignSelf:'center'}}
              onPress={handleDeleteComment}
              >
                <Text>SİL</Text>
              </TouchableOpacity>
            }
        </TouchableOpacity>
        <View style={{flex:1, marginTop:2}}>
            <Text>{comment}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        height: 'auto',
        width:'100%',
        padding:5,
    },
    profilePicture:{
        width:30,
        height:30,
        borderRadius:15,
    },
})