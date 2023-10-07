import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView,ActivityIndicator,Pressable } from 'react-native';
import { TextInput, Button, Text, Snackbar, ProgressBar } from 'react-native-paper';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Optionbtn from './Optionbtn';
import Datedis from './Datetime';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import 'react-native-get-random-values';
import { Image } from 'expo-image';
import { v4 as uuidv4 } from 'uuid';
import * as ImagePicker from 'expo-image-picker';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

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
  const [temporaryImage, setTemporaryImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileRef, setFileRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const storageRef = getStorage();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setTemporaryImage(selectedAsset.uri);
      } else {
        console.log('Image selection was canceled.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

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

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid phone number.'
      );
      return false;
    }

    if (!selectedCategory) {
      Alert.alert('Validation Error', 'Category is required.');
      return false;
    }

    if (selectedCategory === 'cookedfood' && !selectedDateTime) {
      Alert.alert(
        'Validation Error',
        'Date and Time is required for the "cookedfood" category.'
      );
      return false;
    }

    return true;
  };

  const handlePostItem = async () => {
    if (posting) {
      return;
    }
    setIsLoading(true);
    const isValid = validateInput();
  
    if (isValid) {
      if (!temporaryImage) {
        Alert.alert('Error', 'Please select an image before posting.');
        setIsLoading(false);
        return;
      }
  
      setFileRef(''); // Reset fileRef to empty string before posting a new item
      Alert.alert(
        'Confirm Posting',
        'Are you sure the entered details are correct?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Post',
            onPress: async () => {
              try {
                setPosting(true);
                const currentDateTime = new Date();
  
                // Upload the selected image before posting
                const uniqueIdentifier = uuidv4();
                const imageBlob = await uriToBlob(temporaryImage);
                const storageRef = ref(storage, `items/${uniqueIdentifier}`);
                await uploadBytes(storageRef, imageBlob, {
                  onUploadProgress: (progress) => {
                    setUploadProgress(progress.bytesTransferred / progress.totalBytes);
                  },
                });
  
                const downloadURL = await getDownloadURL(storageRef);
                await addDoc(collection(db, 'items'), {
                  itemname: itemName,
                  itemDescription: itemDescription,
                  Donatername: Donatername,
                  category: selectedCategory,
                  location: ulocation,
                  phoneNumber: phoneNumber,
                  selectedDateTime: selectedDateTime,
                  postedDateTime: currentDateTime,
                  fileRef: downloadURL || '',
                });
  
                setItemName('');
                setItemDescription('');
                setDonatername('');
                setSelectedCategory(''); // Reset selectedCategory to empty string
                setulocation('');
                setPhoneNumber('');
                setSelectedDateTime(null);
                setTemporaryImage(null);
  
                setPosting(false);
                setSnackbarVisible(true);
              } catch (error) {
                console.error('Error posting item:', error);
                setPosting(false);
              }finally {
                setIsLoading(false); // Hide loading indicator after signup completes (success or error)
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  

  return (
    <View style={tw`bg-emerald-100`}>
      <View style={tw`bg-emerald-800 p-2 my-6`}>
        <StatusBar 
          barStyle="light-content"
          // backgroundColor="#2dd4bf"
        />
        <Text style={tw`text-white text-lg pl-2 font-bold`}>ShareEasy</Text>
      </View>
      <ScrollView style={tw`mb-25 p-3 bg-emerald-100`}>
        <View style={tw`bg-emerald-100 p-10 py-7 rounded-lg p-6 `}>
          <TextInput
              style={tw`mt-3 bg-slate-50 rounded text-stone-950 border-2 border-lime-600` }
            label="Item Name"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
          />

          <TextInput
            label="Item Description"
            value={itemDescription}
            onChangeText={(text) => setItemDescription(text)}
            style={tw`mt-3 bg-slate-50 rounded text-stone-950 border-2 border-emerald-100` }
          />
          <TextInput
            label="Donater name"
            value={Donatername}
            onChangeText={(text) => setDonatername(text)}
            style={tw`mt-3 bg-slate-50 rounded text-stone-950 border-2 border-lime-600`}
          />
          <TextInput
            label="Location"
            value={ulocation}
            onChangeText={(text) => setulocation(text)}
            style={tw`mt-3 bg-slate-50 rounded text-stone-950 border-2 border-lime-600`}
          />
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            style={tw`mt-3 bg-slate-50 rounded text-stone-950 border-2 border-lime-600`}
          />

          {selectedCategory === 'cookedfood' && (
            <View style={tw`mt-3 bg-slate-50 rounded text-stone-950 border-2 border-lime-600`}>
               <Datedis 
              selectedDateTime={selectedDateTime}
              setSelectedDateTime={setSelectedDateTime}
            />
            </View>
           
          )}
<View style={tw`my-3 bg-slate-50 rounded text-stone-950 border-2 border-lime-600`}>
<Optionbtn 
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
</View>
          

          {temporaryImage && (
            <View>
              <Image
                source={{ uri: temporaryImage }}
                style={{ width: 200, height: 200 }}
              />
            </View>
          )}
            {isLoading && (
      <View style={tw`z-40 flex justify-center items-center`}>
        <ActivityIndicator size="large" color="#56e41d" />
      </View>
    )}

<Pressable style={tw`bg-teal-400 p-3 rounded mb-2 `} onPress={pickImage}>
      <Text mode="contained" style={tw`font-semibold text-slate-50 text-center  `}> Pick Image</Text>
    </Pressable>
    <Pressable style={tw`bg-teal-300 p-3 rounded `} onPress={handlePostItem}>
      <Text mode="contained" disabled={posting} style={tw`font-semibold text-slate-50 text-center `}> Post Item</Text>
    </Pressable>
        
        
          <View style={styles.snackbarContainer}>
            <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={3000}
              style={{ elevation: 0, backgroundColor: 'white' }}
            >
              <View style={[styles.snackbarContent, { justifyContent: 'center', alignItems: 'center' }]}>
              <Image
               source={require('../assets/success.gif')} 
                style={{ width: 270, height: 280 }}
              />
              </View>
            </Snackbar>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  post: {
    backgroundColor: '#e80765',
  },
  pickImage: {
    backgroundColor: '#007ACC',
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
  },
  snackbarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    
    backgroundColor: 'white'
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PostItemForm;