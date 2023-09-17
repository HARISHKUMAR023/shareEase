import React, { useState } from 'react';
import { View, Text,Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 

const Datedis = ({ selectedDateTime, setSelectedDateTime }) => {
    const [show, setShow] = useState(false);
  
    const onChange = (event, selectedTime) => {
      setShow(false);
      setSelectedDateTime(selectedTime);
    };
  
    const showTimePicker = () => {
      setShow(true);
    };
  
    return (
      <View>
        <Button onPress={showTimePicker} title="Select Cooking Time" />
        <Text>Selected Cooking Time: {selectedDateTime?.toLocaleTimeString()}</Text>
        {show && (
          <DateTimePicker
            testID="timePicker"
            value={selectedDateTime || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    );
  };
  
  
  export default Datedis;