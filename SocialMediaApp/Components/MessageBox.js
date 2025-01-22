import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserFollowBox from './UserFollowBox';

export default function MessageBox({owner, text, profilePictureUrl, type}) {

  const messageOwner = owner;
  const messageText = text;
  const messageprofilePictureUrl = profilePictureUrl;
  const messagetype = type;

  return (
    <View style={styles.container}>
      {messageOwner === "your" &&
        <>
        {messagetype === "text" &&
          <>
            <View style={styles.yourmessageContainer}>
              <Text style={styles.yourMessageText}>{messageText}</Text>
              <Image
                style={styles.profilePicture}
                source={messageprofilePictureUrl ? { uri: messageprofilePictureUrl } : require('../assets/Images/userphoto.jpg')}
              />
            </View>
          </>
        }
        {messagetype === "profile" &&
          <>
            <View style={styles.yourmessageContainer}>
              <UserFollowBox useruid={messageText} />
            </View>
          </>
        }
        </>
      }
      {messageOwner === "mine" &&
      <>
      {messagetype === "text" &&
        <View style={styles.mymessageContainer}>
          <Text style={styles.myMessageText}>{messageText}</Text>
        </View>
      }
      {messagetype === "profile" &&
        <>
          <View style={styles.mymessageContainer}>
            <UserFollowBox useruid={messageText} />
          </View>
        </>
      }
      </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
  yourmessageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
    marginLeft: 35,
    backgroundColor: '#EAE1E1',
  },
  mymessageContainer: {
    maxWidth: '75%',
    padding: 10,
    alignSelf: 'flex-end',
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    marginRight: 10,
    backgroundColor: '#3666E2',
  },
  yourMessageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'white',
    fontSize: 16,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    left: -35,
    bottom: 0,
  },
})
