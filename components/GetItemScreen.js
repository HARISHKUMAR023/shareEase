
import React, { useState, useEffect } from 'react';
import { View, Text,StyleSheet,ScrollView,Share,ImageBackground  } from 'react-native';
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
      setItems(fetchedItems);
    });
  
    
    return () => unsubscribe();
  }, []);
  
  const handleCall = phoneNumber => {
    if (phoneNumber) {
      Communications.phonecall(phoneNumber, true);
    }
  };

  //share
  const handleShare = (item) => {
    Share.share({
      message: `Check out this item: ${item.itemname} - ${item.itemDescription} - ${item.phoneNumber}- ShareEase`,
    });
  };
  return (
   

    <ScrollView style={styles.container}>
      {items.map((item, index) => (
        <View key={index}>
          <Card style={tw`bg-orange-500 mt-4`}>
            <Card.Content>
              <Title style={styles.title}>{item.itemname}</Title>
              <Paragraph style={styles.title}>{item.itemDescription}</Paragraph>
              <Paragraph style={styles.title}>Location: {item.location}</Paragraph>
              <Paragraph style={styles.title}>Donor: {item.Donatername}</Paragraph>
              <Paragraph style={styles.title}>
                Posted Date and Time: {item.postedDateTime ? 
                  new Date(item.postedDateTime.seconds * 1000 + item.postedDateTime.nanoseconds / 1000000).toLocaleString() : 
                  'N/A'}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button style={styles.callButton} onPress={() => handleCall(item.phoneNumber)}>
                <Text style={styles.buttonText}>Call</Text>
              </Button>
              <Button style={styles.shareButton} onPress={() => handleShare(item)}>
                <Text style={styles.buttonText}>Share</Text>
              </Button>
            </Card.Actions>
          </Card>
        </View>
      ))}
    </ScrollView>
 


  );
};






export default GetItemScreen;
const styles = StyleSheet.create({
  container: {
   height:900,
    backgroundColor: 'white',
      padding: 16,
      
      
  },
  card:{
    marginTop:30,
    marginBottom: 20,
    backgroundColor:'#4c4f4f',
    color:'#f0f2f2'},
    callButton: {
      backgroundColor: '#e80765', 
      fontWeight: 'bold', 
      
    },
    shareButton: {
      backgroundColor: '#0523eb', 
      fontWeight: 'bold',
      color: 'white'
    },
    buttonText: {
      color: 'white', 
      fontWeight: 'bold'
      
    },
    title:{
      color:'white',
      fontWeight:'500'
    }
  
});
