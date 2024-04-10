import React, { useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Alert,
    TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Link, useLocalSearchParams, router } from "expo-router";
import { supabase } from '../../supabase';
import { StatusBar } from 'expo-status-bar';


const data1 = [
    { label: 'Gymkhana', value: '1' },
    { label: 'A Block', value: '2' },
    { label: 'B Block', value: '3' },
    { label: 'C Block', value: '4' },
    { label: 'D Block', value: '5' },
];
const slot = [
    { label: '6:00-7:00', value: '1' },
    { label: '7:00-8:00', value: '2' },
    { label: '17:00-18:00', value: '3' },
    { label: '18:00-19:00', value: '4' },
    { label: '19:00-20:00', value: '5' },
];

export default function Example() {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [err, setErr] = useState(true)

    async function handleItem() {
        const { data, error } = await supabase.from('GymDB').select('available_slots').eq('location', data1[value1 - 1].label).eq('time', slot[value2 - 1].label).single()
        if (error) { console.log(error) }
        // console.log(data[value1 - 1].label)
        // console.log(data)
        const x = data.available_slots - 1

        // console.log(x)
        if (data) {
            const { error2 } = await supabase
                .from('GymDB')
                .update({ available_slots: x })
                .eq('location', data1[value1 - 1].label).eq('time', slot[value2 - 1].label)


            if (error2) {
                console.log(error)
                Alert.alert('No free slots are avaialble. Plese try again')
            }
            else {

                const { data: { user } } = await supabase.auth.getUser()
                const z = user.id
                console.log(z)
                const { data, error2 } = await supabase.from('University').select().eq('id', z)
                const rfid = data[0].Stu_RFID
                const { error3 } = await supabase
                    .from('GymWaiting')
                    .insert({ RFID: rfid, location: data1[value1 - 1].label, time: slot[value2 - 1].label, status: false })
                router.push('/confirm')
            }
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <StatusBar style='auto' />
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                    <View style={styles.header}>
                        <View style={styles.headerBack}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <FeatherIcon
                                    color="#1D2A32"
                                    name="chevron-left"
                                    size={30} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.title}>Gym Booking</Text>

                        <Text style={styles.subtitle}>
                            Fill in the fields below to proceed with your booking.
                        </Text>
                    </View>
                    <View style={styles.form}>
                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Location</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={data1}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select item"
                                searchPlaceholder="Search..."
                                value={value1}
                                onChange={item => {
                                    setValue1(item.value);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                                )}
                            />
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.inputLabel}>Choose your slot</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={slot}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select item"
                                searchPlaceholder="Search..."
                                value={value2}
                                onChange={item => {
                                    setValue2(item.value);
                                }}
                                renderLeftIcon={() => (
                                    <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                                )}
                            />
                        </View>

                        <View style={styles.formAction}>
                            <TouchableOpacity
                                onPress={handleItem}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Confirm your booking</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                {/* <TouchableOpacity
                    onPress={() => {
                        // handle link
                    }}
                    style={{ marginTop: 'auto' }}>
                    <Text style={styles.formFooter}>
                        Already have an account?{' '}
                        <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
                    </Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'black',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginRight: 2,
        marginLeft: 2
        // borderWidth: 
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    container: {
        paddingVertical: 24,
        paddingHorizontal: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    title: {
        fontSize: 31,
        fontWeight: '700',
        color: '#1D2A32',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
    },
    /** Header */
    header: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    headerBack: {
        padding: 8,
        paddingTop: 0,
        position: 'relative',
        marginLeft: -16,
        marginBottom: 6,
    },
    /** Form */
    form: {
        marginBottom: 24,
        paddingHorizontal: 24,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    formAction: {
        marginTop: 4,
        marginBottom: 16,
    },
    formFooter: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        letterSpacing: 0.15,
    },
    /** Input */
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#075eec',
        borderColor: '#075eec',
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
});