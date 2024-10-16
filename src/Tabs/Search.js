import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, {onSnapshot} from '@react-native-firebase/firestore';
let userId = '';
const Search = () => {
  const [userList, setUserList] = useState([]);
  const [onFollowClick, setOnFollowClick] = useState(false);
  useEffect(() => {
    getUsers();
  }, [onFollowClick]);

  const getUsers = async () => {
    let tempUsers = [];
    userId = await AsyncStorage.getItem('userId');
    firestore()
      .collection('Users')

      // .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        querySnapshot._docs.map(item => {
          if (item._data.userId !== userId) {
            tempUsers.push(item);
          }
        });
        setUserList(tempUsers);
      });
  };
  const followUser = async item => {
    let tempFollowers = item._data.followers;
    // let following = [];
    // firestore()
    //   .collection('Users')
    //   .doc(userId)
    //   .get()
    //   .then(snapshot => {
    //     following = snapshot.data().following;
    //   });
      

    // if (following.length > 0) {
    //   following.map(item2 => {
    //     if (item2 == item._data.userId) {
    //       let index1 = following.indexOf(item._data.userId);
    //       if (index1 > -1) {
    //         following.splice(index1, 1);
    //       } else {
    //         following.push(item._data.userId);
    //       }
    //     } else {
    //       following.push(item._data.userId);
    //     }
    //   });
    // } else{
    //   following.push(item._data.userId);

    // }
    // firestore()
    //   .collection('Users')
    //   .doc(userId)
    //   .update({
    //     following: following,
    //   })
    //   .then(resp => {})
    //   .catch(error => {
    //     console.log(error);
    //   });

    let following = [];
firestore()
  .collection('Users')
  .doc(userId)
  .get()
  .then(snapshot => {
    following = snapshot.data().following || [];  // Use snapshot.data() to get fields

    // Check if the user is already being followed
    const isFollowing = following.includes(item._data.userId);

    if (isFollowing) {
      // Unfollow: Remove the user from following list
      const index1 = following.indexOf(item._data.userId);
      if (index1 > -1) {
        following.splice(index1, 1);  // Remove the user
      }
    } else {
      // Follow: Add the user to the following list
      following.push(item._data.userId);
    }

    // Update Firestore with the new following list
    return firestore()
      .collection('Users')
      .doc(userId)
      .update({
        following: following,
      });
  })
  .then(resp => {
    console.log('Successfully updated following list');
  })
  .catch(error => {
    console.error('Error updating following list:', error);
  });


    if (tempFollowers.length > 0) {
      tempFollowers.map(item1 => {
        if (item1 === userId) {
          let index = tempFollowers.indexOf(userId);
          if (index > -1) {
            tempFollowers.splice(index, 1);
          }
        } else {
          tempFollowers.push(userId);
        }
      });
    } else {
      tempFollowers.push(userId);
    }
    firestore()
      .collection('Users')
      .doc(item._data.userId)
      .update({
        followers: tempFollowers,
      })
      .then(resp => {})
      .catch(error => {
        console.log(error);
      });
    setOnFollowClick(!onFollowClick);
    getUsers();
  };

  const getFollowStatus = followers => {
    let status = false;

    followers.map(item => {
      if (item == userId) {
        status = true;
      } else {
        status = false;
      }
    });

    return status;
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={userList}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: '100%',
                height: 70,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#fff',
                marginTop: 5,
                elevation: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={
                    item._data.profilePic == ''
                      ? require('../Images/userP.png')
                      : {uri: item._data.profilePic}
                  }
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    marginRight: 10,
                    marginLeft: 20,
                  }}
                />
                <Text style={{fontSize: 16, fontWeight: '600'}}>
                  {item._data.name}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  backgroundColor: '#0099ff',
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 6,
                }}
                onPress={() => {
                  followUser(item);
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    color: 'white',
                    fontWeight: '600',
                  }}>
                  {getFollowStatus(item._data.followers)
                    ? 'Unfollow'
                    : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
