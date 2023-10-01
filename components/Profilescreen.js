import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import the necessary Firestore functions
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
const Profilescreen = ({ navigation }) => {
  const [items,usesitem ] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;
// console.log(user)
  useEffect(() => {
    if (user) {
      // User is signed in, fetch profile data
      const fetchUserData = async () => {
        try {
          // Fetch user data from Firestore using the user's UID
        //   const userDocRef = doc(db, 'users', user.uid);
        // //   console.log(userDocRef)
        //   const userDocSnapshot = await getDoc(userDocRef);
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usesitem  = snapshot.docs.map((doc) => doc.data());
            // usesitem (usesitem);
            // console.log(usesitem)
          });
         
        // const docSnap = await getDoc(docRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setName(items.name);
            setPhoneNumber(userData.phoneNumber);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle error
        }
      };

      // Call the function to fetch user data when the screen loads
      fetchUserData();
    } else {
      // User is not signed in, handle accordingly (e.g., redirect to login)
    }
  }, [user]); // Dependency on the 'user' object

//   const handleUpdateProfile = async () => {
//     try {
//       // Check if the user document exists in Firestore
//       const userDocRef = doc(db, 'users', user.uid);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         // Update user data in Firestore
//         await updateDoc(userDocRef, {
//           name: name,
//           phoneNumber: phoneNumber,
//         });

//         // Navigate back to the previous screen or to the home screen
//         navigation.goBack();
//       } else {
//         console.error('User document does not exist.');
//         // Handle the case where the document does not exist (e.g., create a new document or display an error message)
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       // Handle other errors
//     }
//   };

  return (
    <View>
      <Text>Update Profile</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      {/* <Button title="Update Profile" onPress={handleUpdateProfile} /> */}
    </View>
  );
};

export default Profilescreen;
