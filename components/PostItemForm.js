import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Optionbtn from './Optionbtn';
import Datedis from './Datetime';
import { useNavigation, useRoute } from '@react-navigation/native';

const PostItemForm = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [Donatername, setDonatername] = useState('');
  const [ulocation, setulocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [posting, setPosting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve the itemLocation parameter from the route
  const { itemLocation } = route.params || {};

  useEffect(() => {
    // If itemLocation is available, you can use it
    if (itemLocation) {
      // Do something with itemLocation.latitude and itemLocation.longitude
      // Example: setulocation(`Latitude: ${itemLocation.latitude}, Longitude: ${itemLocation.longitude}`);
    }
  }, [itemLocation]);

  const validateInput = () => {
    if (!itemName) {
      Alert.alert('Validation Error', 'Item Name is required.');
      return false;
    }
  
    if (!itemDescription) {
      Alert.alert('Validation Error', 'Item Description is required.');
      return false;
    }
  
    if (!Donatername) {
      Alert.alert('Validation Error', 'Donater Name is required.');
      return false;
    }
  
    if (!ulocation) {
      Alert.alert('Validation Error', 'Location is required.');
      return false;
    }
  
    if (!phoneNumber) {
      Alert.alert('Validation Error', 'Phone Number is required.');
      return false;
    }
  
    // Add phone number validation
    const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number format
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return false;
    }
  
    if (!selectedCategory) {
      Alert.alert('Validation Error', 'Category is required.');
      return false;
    }
  
    if (selectedCategory === 'cookedfood' && !selectedDateTime) {
      Alert.alert('Validation Error', 'Date and Time is required for the "cookedfood" category.');
      return false;
    }
  
    return true;
  };
  

  const handlePostItem = async () => {
    if (posting) {
      // Don't allow posting while another item is being posted
      return;
    }
    
    const isValid = validateInput();

    if (isValid) {
      Alert.alert(
        'Confirm Posting',
        'Are you sure the entered details are correct?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Post', onPress: () => postItem() },
        ],
        { cancelable: false }
      );
    }
  };

  const postItem = async () => {
    try {
      setPosting(true);
      const currentDateTime = new Date();
      await addDoc(collection(db, 'items'), {
        itemname: itemName,
        itemDescription: itemDescription,
        Donatername: Donatername,
        category: selectedCategory,
        location: ulocation,
        phoneNumber: phoneNumber,
        selectedDateTime: selectedDateTime,
        postedDateTime: currentDateTime,
        itemLocation: itemLocation, // Include the item location
      });

      // Reset state variables here
      setItemName('');
      setItemDescription('');
      setDonatername('');
      setSelectedCategory('');
      setulocation('');
      setPhoneNumber('');
      setSelectedDateTime(null);
      setPosting(false);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error posting item:', error);
      setPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Item Name"
        value={itemName}
        onChangeText={(text) => setItemName(text)}
        // style={styles.inp}
      />
      <TextInput
        label="Item Description"
        value={itemDescription}
        onChangeText={(text) => setItemDescription(text)}
        style={styles.input}
      />
      <TextInput
        label="Donater name"
        value={Donatername}
        onChangeText={(text) => setDonatername(text)}
        style={styles.input}
      />
      <TextInput
        label="Location"
        value={ulocation}
        onChangeText={(text) => setulocation(text)}
        style={styles.input}
      />
      <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        style={styles.input}
      />

      {selectedCategory === 'cookedfood' && (
        <Datedis
          selectedDateTime={selectedDateTime}
          setSelectedDateTime={setSelectedDateTime}
        />
      )}

      <Button
        mode="contained"
        style={styles.getLocationButton}
        onPress={() => navigation.navigate('Map')}
        disabled={posting}
      >
        Get Item Location
      </Button>

      <Optionbtn
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      <Button
        mode="contained"
        style={styles.post}
        onPress={handlePostItem}
        disabled={posting}
      >
        Post Item
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'OK',
          onPress: () => {},
        }}
      >
        {selectedCategory ? 'Item posted successfully.' : 'Please select a category.'}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  post: {
    backgroundColor: '#e80765',
  }
 
});

export default PostItemForm;
