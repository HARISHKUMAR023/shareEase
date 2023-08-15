import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';

// Import your screen components
import HomeScreen from './components/HomeScreen';
import PostItemForm from './components/PostItemForm';
import GetItemScreen from './components/GetItemScreen';

const Tab = createMaterialBottomTabNavigator();

import { MaterialCommunityIcons } from '@expo/vector-icons';

// ...

const App = () => {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Tab.Navigator
          activeColor="#e91e63"
          shifting={true}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="PostItem"
            component={PostItemForm}
            options={{
              tabBarLabel: 'Post Item',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="plus" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="GetItem"
            component={GetItemScreen}
            options={{
              tabBarLabel: 'Get Item',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="bell" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};


export default App;
