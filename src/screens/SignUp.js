import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomInput from '../Common/CustomInput';
import CustomButton from '../Common/CustomButton';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
let token = '';
const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  useEffect(() => {
    getEfCm();
  }, []);

  const getEfCm = async () => {
    token = await messaging().getToken();
    console.log(token);
  };

  const saveDAata = () => {
    let id=uuid.v4()
      firestore()
      .collection('Users')
      .doc(id)
      .set({
        name: name,
        number: number,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        userId:id,
        followers:[],
        following:[],
        posts:[],
        profilePic:'',
        bio:''
      })
      .then(() => {
        console.log('User added!');
      });
    firestore()
      .collection('tokens')
      .add({
        token: token,
      })
      .then(() => {
        console.log('User added!');
        saveLocalData();
        navigation.goBack();
      });
  };

  const saveLocalData = async () => {
    await AsyncStorage.setItem('NAME', name);
    await AsyncStorage.setItem('EMAIL', email);
  };
  return (
    <View style={{flex: 1}}>
      <Image source={require('../Images/InstaLogo.png')} style={styles.Image} />
      <Text style={styles.text}>Create New Account</Text>
      <CustomInput
        placeholder="Full Name"
        value={name}
        icon={require('../Images/user.png')}
        onChangeText={text => setName(text)}
      />
      <CustomInput
        placeholder="Phone Number"
        value={number}
        icon={require('../Images/otp.png')}
        onChangeText={text => setNumber(text)}
        keyboardType={'number-pad'}
      />
      <CustomInput
        placeholder={'Email'}
        value={email}
        icon={require('../Images/mail.png')}
        onChangeText={text => setEmail(text)}
      />
      <CustomInput
        placeholder={'Password'}
        valule={password}
        icon={require('../Images/padlock.png')}
        onChangeText={text => setPassword(text)}
        type={'password'}
      />
      <CustomInput
        placeholder={'Confirm Password'}
        valule={confirmPassword}
        icon={require('../Images/padlock.png')}
        onChangeText={text => setConfirmPassword(text)}
        type={'password'}
      />
      <CustomButton
        title="Sign Up"
        bgColor={'dodgerblue'}
        txtcolor={'white'}
        onPress={() => {
          saveDAata();
        }}
      />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    marginTop: 30,
    color: 'black',
    fontWeight: '600',
    fontSize: 22,
  },
  Image: {
    height: 86,
    width: 86,
    alignSelf: 'center',
    borderRadius: 43,
    marginTop: 50,
  },
});
