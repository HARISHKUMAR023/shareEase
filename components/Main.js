import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const Main = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

//   const handleScroll = (event) => {
//     const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
//     const isScrolledToRight = contentOffset.x + layoutMeasurement.width >= contentSize.width;
//     if (isScrolledToRight) {
//       navigation.navigate('Login');
//     }
//   };

  return (
    <View style={tw`flex-1 items-center pt-8`}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // onScroll={handleScroll}
      >
        <View style={tw`flex-1 items-center justify-center p-8`}>
          <Image source={require('../assets/people.png')} style={tw`w-60 h-60 mb-4`} />
          <View style={tw`px-10`}>
            <Text style={tw`font-semibold text-2xl text-black text-center mb-4`}>Welcome To Our App </Text>
            <Text style={tw`font-bold text-2xl text-black text-center`}>
              Share
              <Text style={tw`font-bold text-2xl text-pink-500`}>{'Easy'}</Text>
            </Text>
    <View style={tw`flex-row items-center justify-center`}>
            <Image source={require('../assets/dots.gif')} style={tw`h-20 w-20 mb-4`} />

           </View>
            
          </View>
        </View>

        {/* second screen */}
        <View style={tw`flex-1 items-center justify-center p-8`}>
          <Image source={require('../assets/delivery-location.png')} style={tw`w-60 h-60 mb-4`} />
          <View style={tw`px-8`}>
            <Text style={tw`font-semibold text-2xl text-black text-center mb-4`}>Trusted  and Reliable Sharing</Text>
            <Text style={tw`font-light text-sm text-black text-center mb-4`}>we make a living by what we get</Text>
            <Pressable style={tw`bg-pink-500 px-24 py-4 rounded`} onPress={() => navigation.navigate('Login')}>
              <View style={tw`flex-row items-center justify-center`}>
                <Text style={tw`font-semibold text-slate-50 text-center mr-2`}>Get Started</Text>
                <MaterialIcons style={tw`bg-black rounded p-0.5`} name="arrow-forward" size={24} color="white" />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Main;