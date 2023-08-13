import { StatusBar } from 'expo-status-bar';

import { StyleSheet,Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import GetItemScreen from './components/GetItemScreen';
import HomeScreen from './components/HomeScreen';
import PostItemForm from './components/PostItemForm';







const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PostItem" component={PostItemForm} />
        <Stack.Screen name="GetItem" component={GetItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
