

//   ikonlarla çalıştım ama her istediğim olmadığı için bıraktım

import React from "react";
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
                    /* tabBarLabel: 'Ana sayfa', */
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: ({focused, color, size }) => (
                        <Ionicons name={focused ? "home-sharp" : "home-outline"} color={"black"} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    /* tabBarLabel: 'Ara', */
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: ({focused, color, size }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} color={"black"} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={Explore}
                options={{
                    /* tabBarLabel: 'Keşfet', */
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: ({focused, color, size }) => (
                        <MaterialIcons name="explore" color={focused ? "black" : "grey"} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="AddMedia"
                component={AddMedia}
                options={{
                    /* tabBarLabel: 'Medya Yükle', */
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: ({focused, color, size }) => (
                        <MaterialIcons name={focused ? "add-circle" : "add-circle-outline"} color={"black"} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                /* children={() => <Profile myuid="123" />} */
                component={Profile}
                options={{
                    /* tabBarLabel: 'Profil', */
                    tabBarLabel: () => null,
                    headerShown: false,
                    tabBarIcon: ({focused, color, size }) => (
                        <FontAwesome name="user" color={focused ? "black" : "grey"} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default Dashboard;
