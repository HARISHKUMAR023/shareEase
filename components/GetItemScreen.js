
import React, { useState, useEffect } from 'react';
import { View,List ,Image, Text,StyleSheet,ScrollView,Share,ImageBackground  } from 'react-native';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { db } from '../firebaseConfig';
import Communications from 'react-native-communications';

import tw from 'twrnc';
const GetItemScreen = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log('Fetching data...');
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const fetchedItems = snapshot.docs.map((doc) => doc.data());
      const currentDayItems = fetchedItems.filter((item) => {
        const postedDate = new Date(item.postedDateTime.seconds * 1000 + item.postedDateTime.nanoseconds / 1000000);
        const currentDate = new Date();
        return postedDate.toDateString() === currentDate.toDateString();
      });
      setItems(currentDayItems);
    });

    return () => unsubscribe();
  }, []);
  
  

 
  return (
   
<ScrollView style={tw`h-full bg-white p-4 mt-8`}>
  {items.length > 0 ? (
    items.map((item, index) => (
      <View key={index}>
        <Card style={tw`rounded-lg shadow-lg overflow-hidden bg-black  mt-2 w-full h-24`}>
          <Card.Content style={tw`flex flex-row-reverse justify-between items-center`}>
            <Image source={require('../assets/icons/notification.gif')} style={tw`w-8 h-8 ml-0.5`} />
            <View style={tw`flex`}>
              <Title style={tw`text-white font-medium`}><Image source={require('../assets/icons/item.png')} style={tw`w-6 h-6 mr-0.8`} />{item.itemname}</Title>
              <View style={tw`text-white mb-1 flex flex-row-reverse`}>
                <Text style={tw`text-white pt-0.8 pl-0.2`}>{item.location}</Text>
                <Image source={require('../assets/icons/location.gif')} style={tw`w-6 h-6 ml-0.2`} />
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    ))
  ) : (
    <View style={tw`flex items-center justify-center h-full`}>
      <Text style={tw`text-gray-500 text-lg`}>No posts were posted today 😔🫤</Text>
    </View>
  )}
</ScrollView>
 


  );
};






export default GetItemScreen;
const styles = StyleSheet.create({

 
  
});
