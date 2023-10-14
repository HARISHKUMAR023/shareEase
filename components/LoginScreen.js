import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import tw from 'twrnc';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Error: ${errorCode} ${errorMessage}`);
      });
  };

  return (
    <View style={styles.container}>
      <View style={tw`p-10 py-7 rounded-lg`}>
        <Text style={tw`font-bold mt-12 text-3xl text-black text-center`}>
          Share
          <Text style={tw`font-bold text-3xl text-pink-500`}>{'Easy'}</Text>
        </Text>
        <Text style={tw`font-bold mt-6 text-2xl text-black text-center`}>Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={tw`p-4 mt-4 rounded text-black border-2 border-pink-500`}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={tw`p-4 rounded border-2 border-pink-500 mt-10`}
        />
        <View style={tw`mb-5 mt-5`}>
          <Pressable style={tw`bg-pink-500 p-4 rounded mt-4`} onPress={handleLogin}>
            <Text style={tw`font-semibold text-slate-50 text-center`}>Login</Text>
          </Pressable>
        </View>

        <View style={tw`flex-row justify-center items-center mt-4`}>
          <Text style={tw`font-normal text-lg text-black`}>Or sign in with:</Text>
          <Pressable onPress={() => alert('This feature will be added soon')}>
            <Image source={require('../assets/icons/google.png')} style={tw`w-8 h-8 ml-2`} />
          </Pressable>
          <Pressable onPress={() => alert('This feature will be added soon')}>
            <Image source={require('../assets/icons/facebook.png')} style={tw`w-8 h-8 ml-2`} />
          </Pressable>
        </View>

        <Text style={tw`font-normal mt-12 text-lg text-black text-center`}>
          You don't have an account?{' '}
          <Text onPress={() => navigation.navigate('Signup')} style={tw`font-semibold text-lg text-pink-500`}>
            {'Signup'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LoginScreen;