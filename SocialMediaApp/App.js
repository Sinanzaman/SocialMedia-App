import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { UserProvider } from './UserContext';

import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Forget from './Screens/Forget';
import Dashboard from './Screens/Dashboard';
import PostScreen from './Screens/PostScreen';
import NotificationScreen from './Screens/NotificationScreen';
import Message from './Screens/Message';
import ProfileScreen from './Screens/ProfileScreen';
import MessageScreen from './Screens/MessageScreen';
import Settings from './Screens/Settings';
import Followers from './Screens/Followers';
import Following from './Screens/Following';
import RequestScreen from './Screens/RequestScreen';
import EditInformation from './Screens/EditInformation';
import AccountInformation from './Screens/AccountInformation';
import FavoritePosts from './Screens/FavoritePosts';
import AccountPrivacy from './Screens/AccountPrivacy';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}}/> 
        <Stack.Screen name="Forget" component={Forget} options={{headerShown:false}}/>
        <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}}/>
        <Stack.Screen name="PostScreen" component={PostScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Message" component={Message}options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
        <Stack.Screen name="NotificationScreen" component={NotificationScreen}options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MessageScreen" component={MessageScreen} options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
        <Stack.Screen name="Settings" component={Settings} options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
        <Stack.Screen name="Followers" component={Followers} options={{headerShown:false}}/>
        <Stack.Screen name="Following" component={Following} options={{headerShown:false}}/>
        <Stack.Screen name="RequestScreen" component={RequestScreen} options={{headerShown:false}}/>
        <Stack.Screen name="EditInformation" component={EditInformation} options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
        <Stack.Screen name="AccountInformation" component={AccountInformation} options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
        <Stack.Screen name="FavoritePosts" component={FavoritePosts} options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
        <Stack.Screen name="AccountPrivacy" component={AccountPrivacy} options={{
          headerShown:false,
          animation:'slide_from_right',
          }}/>
      </Stack.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}