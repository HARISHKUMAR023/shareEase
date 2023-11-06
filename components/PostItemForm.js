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
import { Audio } from 'expo-av';
import { v4 as uuidv4 } from 'uuid';
import * as ImagePicker from 'expo-image-picker';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [uadress, setuadress] = useState('');
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
  const successSound = new Audio.Sound();

  const playSuccessSound = async () => {
    try {
      await successSound.loadAsync(require('../assets/music/done.mp3'));
      await successSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
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
                  id: uniqueIdentifier,
                  itemname: itemName,
                  itemDescription: itemDescription,
                  Donatername: Donatername,
                  category: selectedCategory,
                  location: ulocation,
                  phoneNumber: phoneNumber,
                  selectedDateTime: selectedDateTime,
                  postedDateTime: currentDateTime,
                  uadress:uadress,
                  fileRef: downloadURL || '',
                  status: 'available',
                });
  
                setItemName('');
                setItemDescription('');
                setDonatername('');
                setSelectedCategory(''); // Reset selectedCategory to empty string
                setulocation('');
                setPhoneNumber('');
                setSelectedDateTime(null);
                setTemporaryImage(null);
                setuadress('');
                setPosting(false);
                setSnackbarVisible(true);
                playSuccessSound(); 
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
    <View style={tw``}>
      <View style={tw`bg-pink-500 p-2 my-6`}>
        <StatusBar 
          barStyle="light-content"
          // backgroundColor="#2dd4bf"
        />
        <Text style={tw`text-white text-lg pl-2 font-bold`}>ShareEasy</Text>
      </View>
      <ScrollView style={tw`mb-25 p-3 `}>
        <View style={tw` p-10 py-7 rounded-lg p-6 `}>
        <View style={tw`mt-4 rounded text-black border-2 border-pink-500 bg-white`}>
<Optionbtn 
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
</View>
          <TextInput
              style={tw` mt-4 rounded text-black border-2 border-pink-500 bg-white` }
            label="Item Name"
            value={itemName}
            onChangeText={(text) => setItemName(text)}
          />


{selectedCategory === 'cookedfood' && (
            <View style={tw`mt-4 rounded text-black border-2 border-pink-500 bg-white`}>
               <Datedis 
              selectedDateTime={selectedDateTime}
              setSelectedDateTime={setSelectedDateTime}
            />
            </View>
           
          )}
          <TextInput
            label="Item Description"
            value={itemDescription}
            onChangeText={(text) => setItemDescription(text)}
            style={tw`mt-4 rounded text-black border-2 border-pink-500 bg-white` }
          />
          <TextInput
            label="Donater name"
            value={Donatername}
            onChangeText={(text) => setDonatername(text)}
            style={tw`mt-4 rounded text-black border-2 border-pink-500 bg-white`}
          />
          <TextInput
            label="Location"
            value={ulocation}
            onChangeText={(text) => setulocation(text)}
            style={tw`mt-4 rounded text-black border-2 border-pink-500 bg-white`}
          />
           <TextInput
            label="Address"
            value={uadress}
            onChangeText={(text) => setuadress(text)}
            style={tw`mt-4 rounded text-black border-2 border-pink-500 bg-white`}
          />
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            style={tw`mb-4 mt-4 rounded text-black border-2 border-pink-500 bg-white`}
          />

          
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

<Pressable style={tw`bg-black p-3 rounded mb-2 `} onPress={pickImage}>
<View style={tw`flex-row items-center justify-center`}>
                <Text style={tw`font-semibold text-slate-50 text-center mr-2`}>select image</Text>
                <Image source={require('../assets/icons/upload.png')} style={tw`w-8 h-8 ml-2`} />
              </View>
     
    </Pressable>
    <Pressable style={tw`bg-pink-500 p-3 rounded `} onPress={handlePostItem}>
    <View style={tw`flex-row items-center justify-center`}>
                <Text style={tw`font-semibold text-slate-50 text-center mr-2`}disabled={posting}>Share Item</Text>
                <Image source={require('../assets/icons/volunter.png')} style={tw`w-8 h-8 ml-2`} />
              </View>
     
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