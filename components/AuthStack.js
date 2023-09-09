import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignupScreen from './Signup';


const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen  name="Login" component={LoginScreen} options={{ headerShown: false }}  />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}  />
    </Stack.Navigator>
  );
};

export default AuthStack;
