import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Link, useLocalSearchParams, router } from "expo-router";
import FeatherIcon from 'react-native-vector-icons/Feather';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from "../../supabase";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';


const items = [
  {
    icon: 'dumbbell',
    label: 'Gym Bookings',
    company: 'Book your slot in the gym',
    jobType: 'Full Time',
    years: '2019-2023',
  }
];
const items1 = [
  {
    icon: 'sports-tennis',
    label: 'Sports & Recreation',
    company: 'Reserve sports items and play your favourite sports',
    jobType: 'Full Time',
    years: '2019-2023',
  }
];

const CARD_WIDTH = Math.min(Dimensions.get('screen').width * 0.75, 400);
export default function Example() {
  const [fname, setFname] = useState('')
  const [regno, setRegno] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch();
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    await AsyncStorage.setItem("id", user.id)
    if (user) {
      console.log("Document data:", user.email);
      setUserInfo(user);
    }
    else {
      console.log("No such document!");
    }
  }
  //  
  return (
    <ScrollView style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.top}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.push('/profile')
            }}>
            <Image
              alt=""
              source={{
                uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80',
              }}
              style={styles.avatar} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon color="#1a2525" name="bell" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Hello, Hitesh</Text>
          <Text style={styles.greetingText}>Hope you're doing well</Text>
        </View>
        {/* <View style={styles.search}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9695b0"
            style={styles.searchInput}
          />
          <View style={styles.searchFloating}>
            <TouchableOpacity>
              <View style={styles.searchButton}>
                <FeatherIcon name="search" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View> */}
        {/* {AsyncStorage.getItem("flag") == "true" && */}
        <TouchableOpacity style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>Next booking</Text>
            <Text style={styles.bannerText}>
              Your next booking starts in{' '}
              <Text style={{ fontWeight: 'bold', color: '#000' }}>16</Text>{' '}
              minutes
            </Text>
          </View>
          <FeatherIcon name="arrow-right" color="#fff" size={30} />
        </TouchableOpacity>
        {/* } */}
      </View>
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>Bookings</Text>
          {/* <TouchableOpacity>
            <Text style={styles.contentLink}>See all</Text>
          </TouchableOpacity> */}
        </View>
        <View>
          <ScrollView
            contentContainerStyle={styles.listContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {items.map(({ icon, label, company, jobType, years }, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push('/gym')
                }}
              >
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardIcon}>
                      <MaterialCommunityIcons
                        color="#000"
                        name={icon}
                        size={24} />
                    </View>

                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{label}</Text>

                      <Text style={styles.cardSubtitle}>{company}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardFooterText}>{jobType}</Text>

                    <Text style={styles.cardFooterText}>{years}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView
            contentContainerStyle={styles.listContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {items1.map(({ icon, label, company, jobType, years }, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push('/sports')
                }}>
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardIcon}>
                      <MaterialIcons
                        color="#000"
                        name={icon}
                        size={24} />
                    </View>

                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{label}</Text>

                      <Text style={styles.cardSubtitle}>{company}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardFooterText}>{jobType}</Text>

                    <Text style={styles.cardFooterText}>{years}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  top: {
    paddingHorizontal: 24,
    paddingVertical: 38,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  /** Greeting */
  greeting: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    marginBottom: 12,
  },
  greetingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a2525',
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a2525',
    marginTop: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 14,
    backgroundColor: '#a5e45b',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bannerTitle: {
    fontSize: 22,
    color: '#000',
    fontWeight: '700',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 15,
    color: '#2f5107',
    fontWeight: '400',
  },
  /** Search */
  search: {
    position: 'relative',
  },
  searchInput: {
    height: 56,
    backgroundColor: '#f3f3f6',
    paddingHorizontal: 16,
    color: '#1a2525',
    fontSize: 18,
    borderRadius: 9999,
  },
  searchFloating: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  searchButton: {
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: '#5bd2bc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Content */
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a2525',
  },
  contentLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2525',
  },
  contentPlaceholder: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flex: 1,
    borderRadius: 8,
  },
  card: {
    width: CARD_WIDTH,
    // borderWidth: 14,
    borderHeight: 14,
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 12,
    backgroundColor: '#000',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 120,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff1f5',
  },
  cardBody: {
    paddingLeft: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 18,
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: '#778599',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cardFooterText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: '#778599',
  },
});


