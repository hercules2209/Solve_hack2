import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Image,
    Switch,
} from 'react-native';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { supabase } from "../../supabase";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultPhotoUrl = "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
const SECTIONS = [
    {
        header: 'Preferences',
        icon: 'settings',
        items: [
            { icon: 'globe', color: '#fe9400', label: 'Language', type: 'link' },
            {
                icon: 'moon',
                color: '#007afe',
                label: 'Dark Mode',
                value: false,
                type: 'boolean',
            },
            { icon: 'navigation', color: '#32c759', label: 'Location', type: 'link' },
        ],
    },
    {
        header: 'Content',
        icon: 'align-center',
        items: [
            { icon: 'save', color: '#32c759', label: 'Saved', type: 'link' },
            { icon: 'download', color: '#fd2d54', label: 'Downloads', type: 'link' },
        ],
    },
    {
        header: 'Help',
        icon: 'help-circle',
        items: [
            { icon: 'log-out', color: '#007afe', label: 'Sign Out', type: 'signout' },
            { icon: 'flag', color: '#8e8d91', label: 'Report Bug', type: 'link' },
            { icon: 'mail', color: '#007afe', label: 'Contact Us', type: 'link' },
        ],
    },
];

export default function Profile() {
    const [regno, setRegno] = useState('')
    const [fname, setFname] = useState('')
    const onSignOut = () => {
        supabase.auth.signOut();
        AsyncStorage.removeItem("authToken");
        router.replace('/login');
    };

    const [userInfo, setUserInfo] = useState('')
    // const getUser = async () => {
    //     const { data: { user } } = await supabase.auth.getUser()
    //     if (user) {
    //         console.log("Document data:", user.email);
    //         // console.log(user.id)
    //         setUserInfo(user);
    //     } else {
    //         console.log("No such document!");
    //     }
    // }
    const getRegno = async () => {
        const id = await AsyncStorage.getItem("id")
        console.log(id)
        const { data, error } = await supabase.from('profiles').select().eq('id', id)
        if (data) {
            const x = data[0].regno
            // setRegno(x);
        }
    }

    // useEffect(() => {
    //     getUser();
    // }, []);
    useEffect(() => {
        getRegno();
    }, []);



    return (
        <View className="flex-1" style={{ backgroundColor: '#fff' }}>
            <StatusBar style='auto' />
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.profile}>
                    <TouchableOpacity>
                        <View style={styles.profileAvatarWrapper}>
                            <Image
                                alt=""
                                source={{
                                    uri: defaultPhotoUrl
                                }}
                                style={styles.profileAvatar}
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    // handle onPress
                                }}>
                                <View style={styles.profileAction}>
                                    <FeatherIcon color="#fff" name="edit-3" size={15} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.profileBody}>
                        <Text style={styles.profileName}>{userInfo.displayName ? userInfo.displayName : "Hitesh Krishna"}</Text>
                        <Text style={styles.profileAddress}>
                            22BAI1036
                        </Text>
                    </View>
                </View>
                {SECTIONS.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        <Text style={styles.sectionHeader}>{header}</Text>
                        {items.map(({ label, icon, type, value, color }, index) => {
                            if (type != 'signout') {
                                return (
                                    <TouchableOpacity
                                        key={label}
                                        onPress={() => {
                                        }}>
                                        <View style={styles.row}>
                                            <View style={[styles.rowIcon, { backgroundColor: color }]}>
                                                <FeatherIcon color="#fff" name={icon} size={18} />
                                            </View>
                                            <Text style={styles.rowLabel}>{label}</Text>
                                            <View style={styles.rowSpacer} />
                                            {type === 'boolean' && <Switch value={value} />}
                                            {type === 'link' && (
                                                <FeatherIcon
                                                    color="#000"
                                                    name="chevron-right"
                                                    size={22}
                                                />
                                            )}
                                            {type === 'signout' && (
                                                // <TouchableOpacity
                                                //     onPress={onSignOut}>
                                                <FeatherIcon
                                                    color="#0c0c0c"
                                                    name="chevron-right"
                                                    size={22}

                                                />
                                                // </TouchableOpacity>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                            else {
                                return (
                                    <TouchableOpacity
                                        key={label}
                                        onPress={
                                            onSignOut
                                        }>
                                        <View style={styles.row}>
                                            <View style={[styles.rowIcon, { backgroundColor: color }]}>
                                                <FeatherIcon color="#fff" name={icon} size={18} />
                                            </View>

                                            <Text style={styles.rowLabel}>{label}</Text>

                                            <View style={styles.rowSpacer} />

                                            {/* {type === 'boolean' && <Switch value={value} />}

                                        {type === 'link' && (
                                            <FeatherIcon
                                                color="#000"
                                                name="chevron-right"
                                                size={22}
                                            />
                                        )}
                                        {type === 'signout' && (
                                            // <TouchableOpacity
                                            //     onPress={onSignOut}>
                                            <FeatherIcon
                                                color="#0c0c0c"
                                                name="chevron-right"
                                                size={22}

                                            />
                                            // </TouchableOpacity>
                                        )} */}
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
    },
    section: {
        paddingHorizontal: 24,
    },
    sectionHeader: {
        paddingVertical: 12,
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
    },
    profile: {
        padding: 24,
        backgroundColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileAvatar: {
        width: 172,
        height: 172,
        borderRadius: 9999,
    },
    profileAvatarWrapper: {
        position: 'relative',
    },
    profileAction: {
        position: 'absolute',
        right: -4,
        bottom: -10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 9999,
        backgroundColor: '#007bff',
    },
    profileName: {
        marginTop: 20,
        fontSize: 29,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
    },
    profileAddress: {
        marginTop: 5,
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 50,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
    },
    rowIcon: {
        width: 32,
        height: 32,
        borderRadius: 9999,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: '400',
        color: '#0c0c0c',
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
});