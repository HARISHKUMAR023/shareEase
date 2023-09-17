import React, { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const SetLocationScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Function to handle location selection
  const handleLocationSelect = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  // Function to handle saving the selected location
  const handleSaveLocation = () => {
    if (selectedLocation) {
      // You can save the selectedLocation.latitude and selectedLocation.longitude to your database
      // Implement your database logic here

      // Navigate back to the previous screen (e.g., the item posting screen)
      navigation.goBack();
    } else {
      // Display an error message or prompt the user to select a location
      alert('Please select a location before saving.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Pickup Location</Text>
      <MapView
        style={styles.map}
        onPress={handleLocationSelect}
        initialRegion={{
          latitude: 0, // Initial map center latitude
          longitude: 0, // Initial map center longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>
      <Button title="Save Location" onPress={handleSaveLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  map: {
    flex: 1,
  },
});

export default SetLocationScreen;
