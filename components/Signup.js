import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Pressable, Text, ScrollView , ActivityIndicator} from 'react-native'; // Import ScrollView
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import * as Location from 'expo-location';
import * as Geocoding from 'expo-location'; // Import Geocoding from Expo's package
import tw from 'twrnc';

const Signupscreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Changed to phoneNumber
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const isButtonDisabled = !(name && phoneNumber && email && password && pincode);

  const handleSignup = async () => {
    if (isButtonDisabled) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields.');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Phone number should be exactly 10 digits.');
      return;
    }
    
    setIsLoading(true); // Show loading indicator when signup starts

    const auth = getAuth();
    try {
      // Simulate a delay (remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data including the pincode and phoneNumber
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        email: email,
        phoneNumber: phoneNumber, // Changed to phoneNumber
        pincode: pincode,
      });

      console.log('User signed up successfully');
    } catch (error) {
      console.error('Signup error:', error);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email Already in Use', 'The provided email is already registered. Please use a different email.');
      } else {
        Alert.alert('Signup Error', 'An error occurred while trying to sign up. Please try again.');
      }
    } finally {
      setIsLoading(false); // Hide loading indicator after signup completes (success or error)
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Location Permission', 'Location permission is required to fetch the pincode.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const result = await Geocoding.reverseGeocodeAsync({ latitude, longitude });

      if (result[0]) {
        setPincode(result[0].postalCode || 'N/A');
      } else {
        setPincode('N/A');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Handle location retrieval error here
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
 
      <View style={tw`bg-slate-50 p-10 py-2 mt-8 rounded-lg`}>
        <Text style={tw`font-bold text-2xl text-black text-center`}  >Signup</Text>
        <Image
          source={require('../assets/signup.jpg')}
          style={tw ` w-60 h-60 `}
        />
        {isLoading && (
      <View style={tw`z-40 flex justify-center items-center`}>
        <ActivityIndicator size="large" color="#56e41d" />
      </View>
    )}
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={tw`p-2 rounded text-stone-950 border-2 border-lime-600`}
        />
        <TextInput
          placeholder="Phone Number" // Updated placeholder
          value={phoneNumber} // Updated to phoneNumber
          onChangeText={setPhoneNumber} // Updated to setPhoneNumber
          style={tw`p-2 mt-2 rounded text-stone-950 border-2 border-lime-600`}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={tw`p-2 mt-2 rounded text-stone-950 border-2 border-lime-600`}
        />
            
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={tw`p-2 mt-2 rounded text-stone-950 border-2 border-lime-600`}
        />
        <TextInput
          placeholder="Pincode"
          value={pincode}
          onChangeText={setPincode}
          style={tw`p-2 mt-2 rounded text-stone-950 border-2 border-lime-600`}
        />
        <View style={tw`mb-5 mt-5 `}>
          <Pressable
            style={[tw`bg-lime-500 p-3 rounded`, isButtonDisabled && tw`opacity-50`]}
            onPress={handleSignup}
            
            disabled={isButtonDisabled}
          >
            <Text style={tw`font-semibold text-slate-50 text-center `}>Sign up</Text>
          </Pressable>
        </View>
        <Pressable style={tw`bg-lime-500 p-3 rounded mb-4 `} onPress={() => navigation.navigate('Login')}>
          <Text style={tw`font-semibold text-slate-50 text-center `}>Back to Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Allow content to grow inside the ScrollView
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: "#e80765",
  },
});

export default Signupscreen;
