import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MessageBox from '../Components/MessageBox';
import { auth, db, getUserData, SendMessageNotification, SetMessage, SetMessageWriting } from '../firebase';
import WritingBox from '../Components/WritingBox';
import { useUserContext } from '../UserContext';

const screenwidth = Dimensions.get('screen').width;
const screenheight = Dimensions.get('screen').height;

export default function MessageScreen({ navigation, route }) {
  const [messageInputText, setMessageInputText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const { useruid } = route.params;
  const scrollViewRef = useRef(null);
  const { username: myusername } = useUserContext();

  const { profilePictureUrl, namesurname, username } = userData || {};

  useEffect(() => {
    const userId = auth.currentUser.uid;

    const fetchUserData = async () => {
      const data = await getUserData(useruid);
      setUserData(data);
    };

    const messageDoc1 = db.collection('messages').doc(`${userId}_${useruid}`);
    const messageDoc2 = db.collection('messages').doc(`${useruid}_${userId}`);
    const messageDocIsWriting1 = db.collection('messages').doc(`${useruid}_${userId}`);
    const messageDocIsWriting2 = db.collection('messages').doc(`${userId}_${useruid}`);

    const unsubscribeMessages1 = messageDoc1.onSnapshot(doc => {
      if (doc.exists) {
        const sortedMessages = (doc.data().messages || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMessages(sortedMessages);
      }
    }, error => {
      console.error("Error fetching messages (doc1): ", error);
    });

    const unsubscribeMessages2 = messageDoc2.onSnapshot(doc => {
      if (doc.exists) {
        const sortedMessages = (doc.data().messages || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMessages(sortedMessages);
      }
    }, error => {
      console.error("Error fetching messages (doc2): ", error);
    });

    const unsubscribeIsWriting1 = messageDocIsWriting1.onSnapshot(doc => {
      if (doc.exists) {
        const isWriting = doc.data()[useruid] || false;
        setIsWriting(isWriting);
      }
    }, error => {
      console.error("Error fetching messages (doc1): ", error);
    });

    const unsubscribeIsWriting2 = messageDocIsWriting2.onSnapshot(doc => {
      if (doc.exists) {
        const isWriting = doc.data()[useruid] || false;
        setIsWriting(isWriting);
      }
    }, error => {
      console.error("Error fetching messages (doc1): ", error);
    });

    fetchUserData();

    return () => {
      unsubscribeMessages1();
      unsubscribeMessages2();
      unsubscribeIsWriting1();
      unsubscribeIsWriting2();
    };
  }, [useruid]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (messageInputText) {
      SetMessageWriting(useruid, true);
    } else {
      SetMessageWriting(useruid, false);
    }
  }, [messageInputText]);

  const navigateBack = () => {
    SetMessageWriting(useruid, false);
    navigation.goBack();
  }

  const handleSendMessage = () => {
    SetMessage(useruid, messageInputText, 'text');
    /* SendMessageNotification(useruid, myusername, messageInputText); */
    setMessageInputText("");
  }

  const navigateProfileScreen = () => {
    SetMessageWriting(useruid, false);
    navigation.navigate('ProfileScreen', { useruid: useruid });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.topContainer}>
        <View>
          <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
            <View style={styles.backButton}>
              <AntDesign name="left" size={20} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={navigateProfileScreen}>
          <Image
            style={styles.profilePicture}
            source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 15 }}>
          <TouchableOpacity onPress={navigateProfileScreen}>
            <Text style={{ fontWeight: 'bold' }}>{namesurname}</Text>
            <Text>{username}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        <View style={styles.midContainer}>
          <Image
            style={styles.profilePicture2}
            source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{namesurname}</Text>
          <TouchableOpacity style={styles.profileButton} onPress={navigateProfileScreen}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Profile Git</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.messageContainer}>
          {messages.map((msg, index) => (
            <MessageBox
            key={index}
            owner={msg.senderId === auth.currentUser.uid ? "mine" : "your"}
            text={msg.messageText}
            profilePictureUrl={profilePictureUrl}
            type={msg.messagetype}
            />
          ))}
        </View>
        {isWriting &&
          <WritingBox
            profilePictureUrl={profilePictureUrl}
          />
        }
      </ScrollView>
      <View style={styles.messageInputContainer}>
        <TextInput
          style={{ height: 50, width: '70%', fontSize: 15, flex: 1 }}
          placeholder={'Mesaj...'}
          value={messageInputText}
          onChangeText={(text) => {setMessageInputText(text);}}
        />
        {messageInputText ?
          <TouchableOpacity onPress={handleSendMessage}>
            <Text style={{ fontWeight: 'bold', paddingHorizontal: 10 }}>
              Gönder
            </Text>
          </TouchableOpacity>
          :
          <TouchableOpacity>
            <MaterialIcons name="add-circle" size={26} style={{ color: 'black' }} />
          </TouchableOpacity>
        }
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimensions.get('window').height * 0.03,
  },
  backButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginHorizontal: 15,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  midContainer: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileButton: {
    width: screenwidth * 0.3,
    height: 30,
    marginTop: 10,
    backgroundColor: '#EAE1E1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    flex:1,
    flexDirection:'column-reverse',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: screenwidth * 0.95,
    height: screenheight * 0.05,
    borderWidth: 1,
    borderColor: '#EAE1E1',
    borderRadius: screenheight * 0.025,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});
