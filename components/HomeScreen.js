import React, { useState, useEffect } from 'react';
import { View,Modal,TextInput, Text, StyleSheet, ScrollView, Share, ImageBackground, Pressable,Linking } from 'react-native';
import { collection,serverTimestamp,doc, getDocs, query, where, onSnapshot,updateDoc } from 'firebase/firestore';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

import Communications from 'react-native-communications';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import { db, storage } from '../firebaseConfig';

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const handleDirection = (item) => {
    alert("This feature is not available yet. Please check back later.");
  };

  useEffect(() => {
    console.log('Fetching data...');
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const fetchedItems = snapshot.docs.map((doc) => doc.data());
      setItems(fetchedItems);
    });

    return () => unsubscribe();
  }, []);

  const handleCall = phoneNumber => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handlePickup = (item) => {
    setModalVisible(true);
  };

  const handleConfirmation = async () => {
    if (code === '0203') {
      try {
        const updatedItem = items.find((item) => item.id === itemId); // Change item.id to itemId
        if (updatedItem) {
          await updateDoc(doc(db, 'items', updatedItem.id), {
            status: 'Pickup',
            updatedAt: serverTimestamp(),
          });
          setModalVisible(false);
        } else {
          alert('Item not found.');
        }
      } catch (error) {
        console.error('Error updating item status:', error);
        // Handle the error as needed
      }
    } else {
      alert('Invalid code. Please try again.');
    }
  };
  
  

  const pickup = (text) =>{

  
  }

  const handleShare = (item) => {
    Share.share({
      message: `Check out this item: ${item.itemname} - ${item.itemDescription} - ${item.phoneNumber}- ShareEase`,
    });
  };

  const filteredItems = items.filter((item) => {
    return item.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View>
      {/* <View style={tw`bg-pink-600 p-2 my-6`}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#007ACC"
        />
        <Text style={tw`text-white text-lg pl-2 font-bold`}>ShareEasy</Text>
      </View> */}

      <Searchbar
        placeholder="Search by location"
        onChangeText={(query) => setSearchQuery(query)}
        value={searchQuery}
        placeholderTextColor="white"
        iconColor="white"
        style={tw`mx-3 mt-10 bg-pink-500 text-blue-600`}
      />

      <ScrollView style={tw`mb-30`}>
        {filteredItems.map((item, index) => (
          <View key={index}>
            <Card style={tw`bg-slate-100 mt-4 m-3`}>
              <Card.Content>
              <Text style={tw`font-semibold text-lg tracking-tight text-black capitalize mb-2`}>{item.status}</Text>
                <Image source={{ uri: item.fileRef }} style={tw`rounded w-80 h-44`} />

                <Title style={tw`font-bold text-lg tracking-tight text-black capitalize`}>{item.itemname}</Title>

                <Paragraph style={tw`font-semibold text-lg tracking-tight text-black capitalize`}>{item.itemDescription}</Paragraph>
                <Paragraph style={tw`font-semibold text-lg tracking-tight text-black capitalize`}>Location: {item.location}</Paragraph>
                <Paragraph style={tw`font-semibold text-lg tracking-tight text-black capitalize`}>Donor: {item.Donatername}</Paragraph>
                <Paragraph style={tw`font-semibold text-lg tracking-tight text-black capitalize`}>
                  Posted Date and Time: {item.postedDateTime ?
                    new Date(item.postedDateTime.seconds * 1000 + item.postedDateTime.nanoseconds / 1000000).toLocaleString() :
                    'N/A'}
                </Paragraph>
              </Card.Content>
              <Card.Actions>
              <Pressable style={tw`bg-pink-600 p-3 rounded`} onPress={() => handlePickup(item)}>
              <Text mode="contained" style={tw`font-semibold text-slate-50 text-center`}>
                Pickup
              </Text>
            </Pressable>
                {/* <Pressable style={tw`bg-pink-600 p-3 rounded`} onPress={() => handleDirection(item)}>
                  <Text mode="contained" style={tw`font-semibold text-slate-50 text-center`}>Direction</Text>
                </Pressable> */}
                <Pressable style={tw`bg-green-600 p-3 rounded`} onPress={() => handleCall(item.phoneNumber)}>
                <View style={tw`flex-row items-center justify-center`}>
                <Text style={tw`font-semibold text-slate-50 text-center mr-2`}>Call</Text>
                <Image source={require('../assets/icons/call.png')} style={tw`w-6 h-6 ml-0.5`} />
              </View>
                  
                  
                </Pressable>
                <Pressable style={tw`bg-rose-600 p-3 rounded`} onPress={() => handleShare(item)}>
                <View style={tw`flex-row items-center justify-center`}>
                <Text style={tw`font-semibold text-slate-50 text-center mr-2`}>Share</Text>
                <Image source={require('../assets/icons/share.png')} style={tw`w-6 h-6 ml-0.5`} />
              </View>
                  
                </Pressable>
              </Card.Actions>
            </Card>
          </View>
        ))}
      </ScrollView>
 {/* Modal for code input */}

 <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={tw`flex-1 justify-center items-center bg-gray-500 bg-opacity-50`}>
          <View style={tw`bg-white p-4 rounded w-80`}>
            <Text style={tw`text-lg font-semibold text-center`}>Enter code:</Text>
            <TextInput
              style={tw`border border-gray-400 p-2 mt-2`}
              value={code}
              onChangeText={(text) => setCode(text)}
            />
            <Pressable style={tw`bg-pink-600 p-3 rounded mt-4`} onPress={() => handleConfirmation()}>
              <Text mode="contained" style={tw`font-semibold text-slate-50 text-center`}>
                Confirm Code
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: 900,
    backgroundColor: 'white',
    padding: 16,
  },
  card: {
    marginTop: 30,
    marginBottom: 20,
  },
});