import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

export default function WritingBox({ profilePictureUrl }) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animation]);

  const dotOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.yourmessageContainer}>
        <Image
          style={styles.profilePicture}
          source={profilePictureUrl ? { uri: profilePictureUrl } : require('../assets/Images/userphoto.jpg')}
        />
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity, marginLeft: 5 }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity, marginLeft: 5 }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yourmessageContainer: {
    width: 75,
    height:30,
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
    marginLeft: 35,
    marginTop:3,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#EAE1E1',
  },
  dotsContainer: {
    flexDirection: 'row',
    paddingHorizontal:3,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    left: -35,
    bottom: 0,
  },
});
