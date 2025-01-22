import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserMessageBox from '../Components/UserMessageBox';
import { auth, db } from '../firebase';

const screenwidth = Dimensions.get('screen').width;
const screenheight = Dimensions.get('screen').height;

export default function Message({navigation}) {
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [myMessages, setMyMessages] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (searchText) {
          const querySnapshot = await db.collection('users').get();
          const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            user.namesurname.toLowerCase().includes(searchText.toLowerCase())
          );
          setFilteredUsers(filtered);
          console.log("filtered users : " + filtered)
        } else {
          setFilteredUsers([]);
        }
        
      } catch (error) {
        console.error('Kullanıcı verilerini çekerken bir hata oluştu: ', error);
      }
    };
    fetchUsers();
  }, [searchText]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        if (!userData || !userData.messageids) {
          console.error('Kullanıcı verileri veya messageids bulunamadı.');
          return;
        }
        setMyMessages(userData.messageids);
      } catch (error) {
        console.error('Kullanıcı verilerini çekerken bir hata oluştu: ', error);
      }
    };
    fetchUsers();
  }, [searchText]);

  const renderItem = ({ item }) => (
    <UserMessageBox
      useruid={item}
    />
  );

  const renderSearch = ({ item }) => (
    <UserMessageBox
      useruid={item.id}
    />
  );

  const navigateBack = () => {
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
        <View style={styles.backButton}>
          <AntDesign name="left" size={20} />
        </View>
        <Text style={{marginLeft:5, fontWeight:'bold'}}>Mesajlar</Text>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={{ height: 50, width: '70%', fontSize: 15, flex:1}}
          placeholder={'Ara...'}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
        onPress={() => {setSearchText("");}}
        style={{ height: 45, alignItems: 'center', justifyContent: 'center' }}
        >
          <MaterialCommunityIcons name="delete" size={26} style={{ color: 'black'}} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.label}>Mesajlar</Text>
        {!searchText ?
          <FlatList
            data={myMessages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          :
          <FlatList
            data={filteredUsers}
            renderItem={renderSearch}
            keyExtractor={(item, index) => index.toString()}
          />
        }
      </View>
      <View style={{width:'100%',marginVertical:2}}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
  },
  backButtonContainer:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical: Dimensions.get('window').height * 0.02,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    width: screenwidth * 0.88,
    height: screenheight * 0.045,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  label:{
    fontSize:25,
    fontWeight:'bold',
    paddingLeft:15,
    marginVertical:10,
  },
})