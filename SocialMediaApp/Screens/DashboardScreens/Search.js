import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import UserFollowBox from '../../Components/UserFollowBox';
import { db } from '../../firebase';

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error('Kullanıcı verilerini çekerken bir hata oluştu: ', error);
      }
    };

    fetchUsers();
  }, [searchText]);

  const renderItem = ({ item }) => (
    <UserFollowBox useruid={item.id} />
  );

  const handleClean = () => {
    setSearchText("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
        <TextInput 
          placeholder="Ara..." 
          style={styles.searchInput} 
          placeholderTextColor="gray"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText &&
        <TouchableOpacity onPress={handleClean}>
          <Text>Temizle</Text>
        </TouchableOpacity>
        }
      </View>
      <View style={styles.resultsContainer}>
        {searchText ? 
        <>
        {!(filteredUsers.length == 0) ?
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          :
          <Text>Kullanıcı Bulunamadı</Text>
        }
        </>
        :
        <>
          <Text>Kullanıcı Arayın</Text>
        </>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  resultsContainer: {
    marginTop: 20,
  },
});
