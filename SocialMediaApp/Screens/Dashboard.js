import React from "react";
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Home from "./DashboardScreens/Home";
import Search from "./DashboardScreens/Search";
import Explore from "./DashboardScreens/Explore";
import AddMedia from "./DashboardScreens/AddMedia";
import Profile from "./DashboardScreens/Profile";

const Tab = createBottomTabNavigator();

const Dashboard = () => {
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Çıkış Yap',
                    'Uygulamayı kapatmak istediğinize emin misiniz?',
                    [
                        { text: 'Hayır', style: 'cancel' },
                        { text: 'Evet', onPress: () => BackHandler.exitApp() }
                    ]
                );
                return true;
            };
    
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Ana sayfa',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarLabel: 'Ara',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="search1" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={Explore}
                options={{
                    tabBarLabel: 'Keşfet',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="explore" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="AddMedia"
                component={AddMedia}
                options={{
                    tabBarLabel: 'Medya Yükle',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="add-circle" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Profil',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default Dashboard;
