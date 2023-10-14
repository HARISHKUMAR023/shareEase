import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, ImageBackground, Pressable } from 'react-native';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from '../firebaseConfig';
import Communications from 'react-native-communications';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

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
      Communications.phonecall(phoneNumber, true);
    }
  };

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
        style={tw`mx-3 mt-10`}
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
                <Pressable style={tw`bg-pink-600 p-3 rounded`} onPress={() => handleDirection(item)}>
                  <Text mode="contained" style={tw`font-semibold text-slate-50 text-center`}>Direction</Text>
                </Pressable>
                <Pressable style={tw`bg-green-600 p-3 rounded`} onPress={() => handleCall(item.phoneNumber)}>
                  <Text mode="contained" style={tw`font-semibold text-slate-50 text-center`}>Call</Text>
                </Pressable>
                <Pressable style={tw`bg-rose-600 p-3 rounded`} onPress={() => handleShare(item)}>
                  <Text mode="contained" style={tw`font-semibold text-slate-50 text-center`}>Share</Text>
                </Pressable>
              </Card.Actions>
            </Card>
          </View>
        ))}
      </ScrollView>
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