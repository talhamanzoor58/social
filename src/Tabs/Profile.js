import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Profile = () => {
  const [imageData, setImageData] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [uploadPicUrl, setUploadPicUrl] = useState('');
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    const userId = await AsyncStorage.getItem('userId');
    firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          setUploadPicUrl(documentSnapshot.data().profilePic);
        }
      });
  };
  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    setImageData(result);
  };
  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    setImageData(result);
  };
  const updateProfile = async () => {
    const reference = storage().ref(imageData.assets[0].fileName);
    // Path to existing file on filesystem
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log(url);
    saveProfileToStore(url);
  };
  const saveProfileToStore = async url => {
    const userId = await AsyncStorage.getItem('userId');

    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        profilePic: url,
      })
      .then(() => {
        console.log('Profile added!');
      });
  };
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.txt}>Profile</Text>
      </View>
      <TouchableOpacity style={styles.tch}>
        {/* Check for image conditions */}
        {!imagePicked && !uploadPicUrl ? (
          // Show default image if no image is picked and no profile pic exists
          <Image
            source={require('../Images/userP.png')}
            style={{height: 100, width: 100, borderRadius: 50}}
          />
        ) : imagePicked && imageData?.assets?.[0]?.uri ? (
          // Show the selected image from camera/gallery
          <Image
            source={{uri: imageData.assets[0].uri}}
            style={{height: 100, width: 100, borderRadius: 50}}
          />
        ) : uploadPicUrl ? (
          // Show the existing profile pic from Firestore if available
          <Image
            source={{uri: uploadPicUrl}}
            style={{height: 100, width: 100, borderRadius: 50}}
          />
        ) : (
          // Fallback: If no image is selected or profile pic is available, show default
          <Image
            source={require('../Images/userP.png')}
            style={{height: 100, width: 100, borderRadius: 50}}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tch2}
        onPress={() => {
          if (imagePicked == false) {
            openGallery();
            setImagePicked(true);
          } else {
            setImagePicked(false);
            updateProfile();
          }
        }}>
        <Text style={styles.txt2}>
          {imagePicked === true ? 'Save Profile' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#8e8e8e',
    flexDirection: 'row',
  },
  txt: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: '600',
  },
  tch: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  tch2: {
    borderWidth: 0.2,
    height: 40,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 20,
    borderColor: 'dodgerblue',
  },
  txt2: {
    fontWeight: '600',
    fontSize: 17,
    color: 'dodgerblue',
  },
});
