// Logout.js

import React from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from "firebase/auth";

const HandleSignOut = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
};

const LogoutScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Are you sure you want to sign out?</Text>
      <Button style={styles.btn} color={'#e80765'}  title="Sign Out" onPress={HandleSignOut} />
      <Button style={styles.btn} color={'#e80765'} title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default LogoutScreen;
const styles = StyleSheet.create({
  container: {
    marginTop:30,
   height:900,
    backgroundColor: 'white',
      padding: 16,
      display:'flex',
      },
  btn:{
    marginBottom:20,
    backgroundColor:'#e80765'
  }
  
  
});