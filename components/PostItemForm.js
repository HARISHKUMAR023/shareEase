import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Optionbtn from './Optionbtn';
import Datedis from './Datetime'; // Import the Datedis component

const PostItemForm = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [Donatername, setDonatername] = useState('');
  const [ulocation, setulocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null); // New state for selected date and time
  const [posting, setPosting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handlePostItem = async () => {
    if (!selectedCategory) {
      setSnackbarVisible(true);
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
      });

      // Reset state variables here
      setItemName('');
      setItemDescription('');
      setDonatername('');
      setSelectedCategory('');
      setulocation('');
      setPhoneNumber('');
      setSelectedDateTime(null); // Reset selected date and time
      setPosting(false);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error posting item:', error);
      setPosting(false);
    }
  };

  const validateInput = () => {
    if (
      !itemName ||
      !itemDescription ||
      !Donatername ||
      !ulocation ||
      !phoneNumber

    ) {
      Alert.alert('Validation Error', 'All fields are required.');
      return false;
    }

    // You can add more validation checks here

    return true;
  };

  return (
    <View style={styles.container}>
      <TextInput 
        label="Item Name"
        value={itemName}
        onChangeText={text => setItemName(text)}
        style={styles.inp}
      />
      <TextInput
        label="Item Description"
        value={itemDescription}
        onChangeText={text => setItemDescription(text)}
        style={styles.input}
      />
      <TextInput
        label="Donater name"
        value={Donatername}
        onChangeText={text => setDonatername(text)}
        style={styles.input}
      />
      <TextInput
        label="Location"
        value={ulocation}
        onChangeText={text => setulocation(text)}
        style={styles.input}
      />
      <TextInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
        style={styles.input}
      />

      {/* Render Datedis component for "cookedfood" category */}
      {selectedCategory === 'cookedfood' && (
        <Datedis
          selectedDateTime={selectedDateTime}
          setSelectedDateTime={setSelectedDateTime}
        />
      )}

      <Optionbtn setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />

      <Button
        mode="contained"
        style={styles.post}
        onPress={handlePostItem}
        loading={posting}
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
      {/* ... (Snackbar and other components) */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 900,
    backgroundColor: 'white',
    padding: 16,
  },
  inp:{ marginTop:30,
    marginBottom: 10,
    height: 50,
    borderColor: 'gray',
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  input: {
   
    marginBottom: 10,
    height: 50,
    borderColor: 'gray',
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  post: {
    backgroundColor: '#e80765',
  },
});

export default PostItemForm;
