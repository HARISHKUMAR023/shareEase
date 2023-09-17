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
import { auth } from './firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapScreen from './components/Mapscreen';
import tw from 'twrnc';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TapGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
const Tab = createMaterialBottomTabNavigator();

const App = () => {
  const [user, setUser] = useState(null);

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
    // <TapGestureHandler>
    //   <RotationGestureHandler>
    <NavigationContainer>
      <PaperProvider>
        {user ? (
          <Tab.Navigator
            activeColor="#e91e63"
            shifting={true}
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
              name="Map"
              component={MapScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="map" color={color} size={26} />
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
    // </RotationGestureHandler>
    // </TapGestureHandler>
     
  );
};

export default App;
