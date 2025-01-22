import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Post from '../Components/Post';
import { auth, getUserData } from '../firebase';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

export default function FavoritePosts({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [myFavorites, setMyFavorites] = useState([]);

    const user = auth.currentUser;

    const getData = async () => {
        setMyFavorites([]);
        try {
            const usersdata = await getUserData(user.uid);
            if (usersdata && Array.isArray(usersdata.myFavorites)) {
                usersdata.myFavorites.sort((a, b) => new Date(b.posttime) - new Date(a.posttime));
                setMyFavorites(usersdata.myFavorites);
            }
        } catch (error) {
            console.error('Veriler alınırken bir hata oluştu: ', error);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        if (refreshing) {
            getData();
        }
    }, [refreshing]);

    useFocusEffect(
        React.useCallback(() => {
            getData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
    };

    const navigateBack = () => {
        navigation.navigate('Settings');
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <TouchableOpacity style={styles.backButtonContainer} onPress={navigateBack}>
                <View style={styles.backButton}>
                    <AntDesign name="left" size={20} />
                </View>
                <Text style={{ marginLeft: 5, fontWeight: 'bold' }}>Ayarlara Dön</Text>
            </TouchableOpacity>
            {myFavorites.length === 0 ? (
                <Text style={styles.emptyText}>Kaydedilenler boş</Text>
            ) : (
                myFavorites.map((myFavorite, index) => (
                    <Post
                        key={index}
                        useruid={myFavorite.postuid}
                        posttime={myFavorite.posttime}
                        fromPage="Home"
                    />
                ))
            )}
            <View style={{ paddingBottom: 60 }}></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30,
    },
    backButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: screenHeight * 0.02,
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
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});
