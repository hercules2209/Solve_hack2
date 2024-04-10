import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../../store";
import React from "react";
import { useState } from "react";
export const UserContext = React.createContext();

export default function Layout() {

  // const [userinfo, setUserinfo] = useState(null)
  // const getUser = async () => {
  //   const { data: { user } } = await supabase.auth.getUser()
  //   // await AsyncStorage.setItem("id", user.id)
  //   if (user) {
  //     console.log("Document data:", user.email);
  //     setUserinfo(user);
  //   }
  //   else {
  //     console.log("No such document!");
  //   }
  // }
  // useEffect(() => {
  //   getUser();
  // }, []);

  return (
    <Provider store={store}>

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="hotel" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="order" />
        <Stack.Screen name="sports" />
        <Stack.Screen name="gym" />
        <Stack.Screen name="confirm" />
        <Stack.Screen name="profile" />
      </Stack>
    </Provider>
  );
}
