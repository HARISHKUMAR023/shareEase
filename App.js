import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthStack from './components/AuthStack';
import HomeScreen from './components/HomeScreen';
import PostItemForm from './components/PostItemForm';
import GetItemScreen from './components/GetItemScreen';
import LogoutScreen from './components/Logout'; // Import the LogoutScreen component
import { auth } from './firebaseConfig'; // Import the firebase configuration
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons

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
              name="PostItem"
              component={PostItemForm}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="plus" color={color} size={26} />
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
              component={LogoutScreen} // Use the LogoutScreen component here
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
