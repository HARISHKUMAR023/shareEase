import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigation = useNavigation();

  const handleSelectLocation = () => {
    if (selectedLocation) {
      // Navigate back to the PostItemForm screen and pass the selected location
      navigation.navigate('PostItem', { itemLocation: selectedLocation });
    } else {
      // Display an error message or handle the case where no location is selected
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={(event) => {
          // Get the latitude and longitude of the selected location
          const { latitude, longitude } = event.nativeEvent.coordinate;
          setSelectedLocation({ latitude, longitude });
        }}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>
      <Button
        mode="contained"
        style={styles.selectButton}
        onPress={handleSelectLocation}
      >
        Select Location
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
  },
  selectButton: {
    margin: 16,
  },
});
