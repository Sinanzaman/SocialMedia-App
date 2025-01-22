import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, TextInput, ScrollView, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { SetMyPost } from '../../firebase';

const screenWidth = Dimensions.get('screen').width;

export default function AddMedia({ navigation }) {
  const [desc, setDesc] = useState("");
  const [blobFileimage, setBlobFileimage] = useState(null);
  const [blobFileVideo, setBlobFileVideo] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState([1, 1]);

  const handleSharePhoto = async () => {
    const posttime = new Date().toISOString();
    const callback = await SetMyPost(posttime, desc, blobFileimage, aspectRatio, "photo");
    setDesc("");
    setBlobFileimage(null);
    setPhotoUrl(null);
    setAspectRatio([1, 1]);
    if (callback) {
      navigation.navigate('Profile');
      Alert.alert('Yükleme Başarılı');
    } else {
      Alert.alert('Yükleme Başarısız, Tekrar Deneyiniz');
    }
  };

  const handleShareVideo = async () => {
    const posttime = new Date().toISOString();
    const callback = await SetMyPost(posttime, desc, blobFileVideo, aspectRatio, "video");
    setDesc("");
    setBlobFileVideo(null);
    setVideoUrl(null);
    setAspectRatio([1, 1]);
    if (callback) {
      navigation.navigate('Profile');
      Alert.alert('Yükleme Başarılı');
    } else {
      Alert.alert('Yükleme Başarısız, Tekrar Deneyiniz');
    }
  };

  const pickPhoto = async (aspectRatio) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const response = await fetch(selectedFile.uri);
        const blob = await response.blob();
        setBlobFileimage(blob);
        setPhotoUrl(selectedFile.uri);
        setAspectRatio(aspectRatio);
      }
    } catch (error) {
      console.log('Medya seçme hatası:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const pickVideo = async (aspectRatio) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: aspectRatio,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const response = await fetch(selectedFile.uri);
        const blob = await response.blob();
        setBlobFileVideo(blob);
        setVideoUrl(selectedFile.uri);
        setAspectRatio(aspectRatio);
      }
    } catch (error) {
      console.log('Medya seçme hatası:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const deletePhoto = () => {
    setBlobFileimage(null);
    setPhotoUrl(null);
    setDesc("");
    setAspectRatio([1, 1]);
  }

  const deleteVideo = () => {
    setBlobFileVideo(null);
    setVideoUrl(null);
    setDesc("");
    setAspectRatio([1, 1]);
  }

  const dynamicMediaStyle = {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9 * (aspectRatio[1] / aspectRatio[0]),
    marginTop: 50,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.mediaContainer}>
        {photoUrl ? (
          <Image
            style={dynamicMediaStyle}
            source={{ uri: photoUrl }}
            resizeMode='cover'
          />
        ) : videoUrl ? (
          <Video
            style={dynamicMediaStyle}
            source={{ uri: videoUrl }}
            resizeMode='cover'
            useNativeControls
            isLooping
          />
        ) : (
          <Image
            style={dynamicMediaStyle}
            source={require('../../assets/Images/userphoto.jpg')}
            resizeMode='cover'
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'white' }}>
              {blobFileimage || blobFileVideo ? "Medyayı Değiştir" : "Medya Seç"}
            </Text>
          </TouchableOpacity>
          {(blobFileimage || blobFileVideo) &&
            <TouchableOpacity style={styles.button} onPress={blobFileimage ? deletePhoto : deleteVideo}>
              <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'white' }}>{"Medyayı Sil"}</Text>
            </TouchableOpacity>
          }
        </View>
        {(blobFileimage || blobFileVideo) &&
          <TextInput
            style={styles.descInput}
            multiline={true}
            placeholder='Açıklama...'
            maxLength={300}
            numberOfLines={9}
            value={desc}
            onChangeText={setDesc}
          />
        }
        {(blobFileimage || blobFileVideo) &&
          <TouchableOpacity style={[styles.button, { marginBottom: 50 }]} onPress={blobFileimage ? handleSharePhoto : handleShareVideo}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'white' }}>Paylaş</Text>
          </TouchableOpacity>
        }
      </View>

      {/* Modal for aspect ratio selection */}
      <Modal
        animationType="slide"
        statusBarTranslucent={true}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Çerçeve Oranı Seçiniz</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => pickPhoto([1, 1])}>
              <Text style={styles.modalButtonText}>1x1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => pickPhoto([3, 4])}>
              <Text style={styles.modalButtonText}>4x3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => pickPhoto([9, 14])}>
              <Text style={styles.modalButtonText}>9x14</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => pickPhoto([16, 9])}>
              <Text style={styles.modalButtonText}>16x9</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => pickVideo([16, 9])}>
              <Text style={styles.modalButtonText}>16x9 video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => pickVideo([3, 4])}>
              <Text style={styles.modalButtonText}>3x4 video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  mediaContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    width: screenWidth * 0.4,
    height: 30,
    backgroundColor: '#0597F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  descInput: {
    height: 100,
    width: '90%',
    fontSize: 15,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: screenWidth * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#0597F2',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});