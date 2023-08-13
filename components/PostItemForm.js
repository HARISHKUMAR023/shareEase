import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig'; 
// Adjust the path based on your project structure
import { doc, setDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import Optionbtn from './Optionbtn';
// import AntDesign from '@expo/vector-icons/AntDesign';
const PostItemForm = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [Donatername, setDonatername] = useState('');
  const [ulocation, setulocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handlePostItem = async () => {
    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }
    try {
      await addDoc(collection(db, 'items'), {
        itemname: itemName,
        itemDescription: itemDescription,
        Donatername :Donatername,
        category: selectedCategory, 
        location:ulocation,
      });
      // Item posted successfully
      console.log('Item posted successfully');
      setItemName('');
      setItemDescription('');
      setDonatername('');
      setSelectedCategory(null); 
      setulocation('');
      // Show a success alert
      Alert.alert('Thankyou '+ Donatername , 'It going to helpful');
    } catch (error) {
      console.error('Error posting item:', error);
  
      // Show an error alert
      Alert.alert('Error', 'An error occurred while posting the item.');
    }
  };
  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Item Name"
        value={itemName}
        onChangeText={text => setItemName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Item Description"
        value={itemDescription}
        onChangeText={text => setItemDescription(text)}
        style={styles.input}
      />
       <TextInput
        placeholder="Donater name"
        value={Donatername}
        onChangeText={text => setDonatername(text)}
        style={styles.input}
      />
        <TextInput
        placeholder="Location"
        value={ulocation}
        onChangeText={text => setulocation(text)}
        style={styles.input}
      />
     <Optionbtn setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      <Button title="Post Item" onPress={handlePostItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   height:900,
    backgroundColor: 'white',
      padding: 16,
  },
  input: {
    marginBottom: 10,
    // padding: 10,
    height: 50,
    borderColor: 'gray',
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    
  },
});

export default PostItemForm;
