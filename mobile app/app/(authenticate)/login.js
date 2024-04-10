import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  AppState,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regno, setRegno] = useState('')

  const router = useRouter();
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        // console.log(token)
        if (token) {
          router.replace("/(home)")
        }
      } catch (error) {
        // console.log(error)
      }
    }

    checkLogin();
  }, [])
  // async function signUpWithEmail() {
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email: email,
  //     password: password
  //   })
  //   if (data) {
  //     const token = data?.session?.access_token;
  //     AsyncStorage.setItem("authToken", token)
  //     AsyncStorage.setItem("user", data?.user);
  //     console.log(data);
  //     router.replace("/(home)")
  //   }
  // }


  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    // AsyncStorage.setItem("regno", regno)
    if (error) Alert.alert(error.message)
    else {
      const token = data?.session?.access_token;
      // const a = data?.session?.user.id
      // const { data, error } = await supabase
      //   .from('profiles').select().eq('id', a)
      // if (!data) {
      //   console.log(error)
      //   const { error } = await supabase
      //     .from('profiles')
      //     .insert({ id: a, regno: regno })
      // }
      AsyncStorage.setItem("authToken", token)
      router.replace("/(home)")
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ marginTop: 100 }}>
        <Text style={{ fontSize: 35, textAlign: "center", fontWeight: "bold" }}>
          Welcome to VITrack
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginTop: 12,
              color: "#075eec",
            }}
          >
            Log in to your account
          </Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="person"
              size={24}
              color="gray"
            />
            <TextInput
              value={regno}
              onChangeText={(text) => setRegno(text)}
              style={{ color: "black", marginVertical: 10, width: 300 }}
              placeholder="Enter your registration number"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{ color: "black", marginVertical: 10, width: 300 }}
              placeholder="Enter your college email"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="black"
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{ color: "black", marginVertical: 10, width: 300 }}
              secureTextEntry={true}
              autoCapitalize={'none'}
              placeholder="Enter your VTOP password"
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <Text>Keep me Logged In</Text>
          <Text>Forgot Password</Text>
        </View>

        <Pressable
          onPress={signInWithEmail}
          style={{
            width: 200,
            backgroundColor: "#075eec",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
            marginTop: 50
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, color: "white" }}>Login</Text>
        </Pressable>

        {/* <Pressable onPress={() => router.replace("/register")} style={{ marginTop: 15 }}>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>Don't have an Account? Sign Up</Text>
        </Pressable> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

