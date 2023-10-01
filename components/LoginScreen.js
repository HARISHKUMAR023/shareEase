import React, { useState } from 'react';
import { View, TextInput, Button,Image, StyleSheet,Pressable,Text } from 'react-native';
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
      <View style={tw`bg-slate-50 p-10 py-7 rounded-lg`}>
        <Text style={tw`font-bold text-2xl text-black text-center`}  >Login</Text>
  
      <Image
  source={require('../assets/login.gif')} 
  style={ tw ` w-60 h-60 ` } 
/>


      <TextInput 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={tw`p-2 rounded text-stone-950 border-2 border-lime-600`}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={tw`p-2 rounded border-2 border-lime-600 mt-3`}
      />
      <View style={tw`mb-5 mt-5 `}>
      {/* <Button style={tw``} title="login" onPress={handleLogin}></Button>  */}
      <Pressable style={tw`bg-lime-500 p-3 rounded `} onPress={handleLogin}>
      <Text style={tw`font-semibold text-slate-50 text-center `}>Login</Text>
    </Pressable>
      </View>
      
      
      <Pressable style={tw`bg-lime-500 p-3 rounded `} onPress={() => navigation.navigate('Signup')}>
      <Text style={tw`font-semibold text-slate-50 text-center `}>Sign Up</Text>
    </Pressable>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:"#e80765",
  }
});

export default LoginScreen;
