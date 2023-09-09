// NGOScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import tw from 'twrnc';
const NGOScreen = () => {
  const [ngoList, setNgoList] = useState([]);

  useEffect(() => {
    console.log('Fetching NGO data...');
    const fetchNGOs = async () => {
      const q = query(collection(db, 'ngos'), where('verified', '==', true));
      const querySnapshot = await getDocs(q);
      const ngoData = [];
      querySnapshot.forEach((doc) => {
        ngoData.push(doc.data());
      });
      setNgoList(ngoData);
    };

    fetchNGOs();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {ngoList.map((ngo, index) => (
        <View key={index} style={tw` mt-6 text-white flex flex-row p-5  rounded-lg bg-orange-500 `}>
          <View style={tw`w-48`}>
          <Text style={tw`text-white font-semibold text-base`}>{ngo.name}</Text>
          <Text style={tw`text-white font-normal text-base `}>{ngo.description}</Text>
          <Text style={tw`text-white font-semibold text-base`}>Contact: {ngo.contact}</Text>
          <Text style={tw`text-white font-semibold text-base`}>Location: {ngo.location}</Text>
          </View>
          
          <View style={tw`pl-8`}>
          {ngo.logoUrl && <Image source={{ uri: ngo.logoUrl }} style={tw`w-24 h-24 rounded-full `} />}
          </View>
          
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card:{
backgroundColor:'red',
marginTop:30,
display:'flex'

  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  contact: {
    fontSize: 16,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
   
  },
});

export default NGOScreen;
