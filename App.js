import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthStack from './components/AuthStack';
import HomeScreen from './components/HomeScreen';
import PostItemForm from './components/PostItemForm';
import GetItemScreen from './components/GetItemScreen';
import NGOScreen from './components/Ngocontact';
import LogoutScreen from './components/Logout';
import Main from './components/Main';
import { auth } from './firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapScreen from './components/Mapscreen';
import tw from 'twrnc';
import 'react-native-gesture-handler';
import ProfileScreen from './components/Profilescreen';
import { View } from 'react-native-web';
const Tab = createMaterialBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  // const iconColor = 'black';
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    
    <NavigationContainer>
      <PaperProvider>
     
        {user ? (
          <Tab.Navigator
            activeColor="black"
            shifting={true}
            barStyle={tw`bg-white border-t border-gray-200`}
            tabBarActiveTintColor="red"
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="PostItem"
              component={PostItemForm}
              options={({ route }) => ({
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="plus" color={color} size={26} />
                ),
              })}
            />
            <Tab.Screen
              name="Ngocontact"
              component={NGOScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-multiple-check" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="GetItem"
              component={GetItemScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="bell" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="SignOut"
              component={LogoutScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="logout" color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <AuthStack />
        )}
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;