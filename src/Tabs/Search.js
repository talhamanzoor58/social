import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

let userId = '';
let profilePic = '';
let name = '';

const Search = () => {
  const [userList, setUserList] = useState([]);
  const [onFollowClick, setOnFollowClick] = useState(false);

  useEffect(() => {
    getUsers();
  }, [onFollowClick]);

  const getUsers = async () => {
    try {
      let tempUsers = [];
      userId = await AsyncStorage.getItem('userId');
      name = await AsyncStorage.getItem('name');
      profilePic = await AsyncStorage.getItem('profilePic');
      
      const usersSnapshot = await firestore().collection('Users').get();
      
      usersSnapshot.docs.forEach(item => {
        if (item.data().userId !== userId) {
          tempUsers.push(item);
        }
      });
      setUserList(tempUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const followUser = async (item) => {
    try {
      let tempFollowers = item._data.followers || [];
      let following = [];
      
      const currentUserSnapshot = await firestore().collection('Users').doc(userId).get();
      following = currentUserSnapshot.data().following || [];
      
      const isFollowing = following.some(f => f.userId === item._data.userId);
      
      // Toggle Follow/Unfollow for current user
      if (isFollowing) {
        following = following.filter(f => f.userId !== item._data.userId); // Unfollow
      } else {
        following.push({
          userId: item._data.userId,
          profilePic: item._data.profilePic,
          name: item._data.name,
        }); // Follow
      }
      
      // Update the user's following list in Firestore
      await firestore().collection('Users').doc(userId).update({ following });
      
      // Toggle follower list of the followed user
      const existingFollower = tempFollowers.some(f => f.userId === userId);
      if (existingFollower) {
        tempFollowers = tempFollowers.filter(f => f.userId !== userId);
      } else {
        tempFollowers.push({ userId, profilePic, name });
      }
      
      await firestore().collection('Users').doc(item._data.userId).update({ followers: tempFollowers });
      
      setOnFollowClick(!onFollowClick);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const getFollowStatus = (followers) => {
    return followers.some(follower => follower.userId === userId);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={userList}
        renderItem={({ item }) => {
          return (
            <View style={styles.userContainer}>
              <View style={styles.userInfo}>
                <Image
                  source={
                    item._data.profilePic === ''
                      ? require('../Images/userP.png')
                      : { uri: item._data.profilePic }
                  }
                  style={styles.profilePic}
                />
                <Text style={styles.userName}>{item._data.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.followButton}
                onPress={() => followUser(item)}
              >
                <Text style={styles.followButtonText}>
                  {getFollowStatus(item._data.followers) ? 'Follow' : 'UnFollow'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    width: '100%',
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 5,
    elevation: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  followButton: {
    marginRight: 20,
    backgroundColor: '#0099ff',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  followButtonText: {
    marginLeft: 10,
    marginRight: 10,
    color: 'white',
    fontWeight: '600',
  },
});

export default Search;