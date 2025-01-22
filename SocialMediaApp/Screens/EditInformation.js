import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { SetBiography, SetNameSurname, SetUsername, SetUserProfilePicture } from '../firebase';

const screenwidth = Dimensions.get('screen').width;

export default function EditInformation({ navigation, route }) {
    const [namesurname, setNamesurname] = useState('');
    const [username, setUsername] = useState('');
    const [biography, setBiography] = useState('');
    const [blobFileimage, setBlobFileimage] = useState(null);
    const [profileImageUri, setProfileImageUri] = useState(null);

    useEffect(() => {
        const { namesurname, username, biography, profilePictureUrl } = route.params;
        if(namesurname){setNamesurname(namesurname);}
        if(username){setUsername(username)}
        if(biography){setBiography(biography)}
        if(profilePictureUrl){setProfileImageUri(profilePictureUrl)}
    }, [route.params])

    const navigateBack = () => {
        navigation.goBack();
    }

    const handleSave = () => {
        if (namesurname) { SetNameSurname(namesurname); }
        if (username && username.length >= 6) { SetUsername(username); }
        if (blobFileimage) { handleUploadProfilePicture() }
        SetBiography(biography);
        navigation.goBack();
        Alert.alert("Yükleme işlemi başarılı");
    }

    const pickProfilePicture = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            console.log(JSON.stringify(result));
            if (!result.canceled && result.assets.length > 0) {
                const selectedFile = result.assets[0];
                const response = await fetch(selectedFile.uri);
                const blob = await response.blob();
                setBlobFileimage(blob);
                setProfileImageUri(selectedFile.uri);
            } else {
                Alert.alert('Profil Resmi seçilmedi.');
            }
        } catch (error) {
            console.log('Profil Resmi seçme hatası:', error);
        }
    };

    const handleUploadProfilePicture = () => {
        if (!blobFileimage) {
            Alert.alert('Lütfen önce bir resim seçin.');
            return;
        }
        SetUserProfilePicture(blobFileimage, (isUploadCompleted) => {
            if (isUploadCompleted) {
                setBlobFileimage(null);
                setProfileImageUri(null);
            } else {
                Alert.alert('Resim yükleme sırasında bir hata oluştu.');
            }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
                <View style={styles.backButton}>
                    <AntDesign name="left" size={20} />
                </View>
                <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>Bilgileri Düzenle</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Image 
                    style={styles.profilePicture} 
                    source={profileImageUri ? { uri: profileImageUri } : require('../assets/Images/userphoto.jpg')} 
                />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity style={styles.changeButton} onPress={pickProfilePicture}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Resmi Değiştir</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <Text>Ad Soyad</Text>
                <TextInput
                    maxLength={30}
                    value={namesurname}
                    onChangeText={(text) => setNamesurname(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Kullanıcı Adı</Text>
                <TextInput
                    maxLength={20}
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Biyografi</Text>
                <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={4}
                    maxLength={300}
                    value={biography}
                    onChangeText={(text) => setBiography(text)}
                />
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 30 }}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Değişiklikleri Kaydet</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 5,
        marginTop: 30,
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
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginHorizontal: 25,
    },
    changeButton: {
        width: screenwidth * 0.4,
        height: 30,
        backgroundColor: '#F3D0D7',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingVertical: 2,
        width: screenwidth * 0.9,
        borderWidth: 1,
        borderColor: '#F3D0D7',
        borderRadius: 15,
        marginVertical: 6,
    },
    textInput: {
        height: 'auto',
        textAlignVertical: 'top',
    },
    saveButton: {
        width: screenwidth * 0.6,
        height: 30,
        backgroundColor: '#F3D0D7',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
