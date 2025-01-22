import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import UserFollowBox from '../Components/UserFollowBox';

export default function RequestScreen({ route, navigation }) {
  const { requests } = route.params;

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
        <View style={styles.backButton}>
          <AntDesign name="left" size={20} />
        </View>
        <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>Takip İstekleri</Text>
      </TouchableOpacity>

      {Object.entries(requests).map(([index, useruid]) => (
        <UserFollowBox 
          key={index}
          useruid={useruid}
        />
      ))}

      <View style={{ marginBottom: 50 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
    paddingTop: 30,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Dimensions.get('window').height * 0.02,
  },
  backButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginLeft: 10,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
