import { createClient } from "@supabase/supabase-js";
import { AppState } from 'react-native'
import "react-native-url-polyfill/auto";
import AsyncStorage from '@react-native-async-storage/async-storage'
const supabaseUrl = "https://xjbdjsqthtufqezfrugy.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmRqc3F0aHR1ZnFlemZydWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2Njg0MjgsImV4cCI6MjAyODI0NDQyOH0.B3ABkV7qpQJ9M3w5GujJ3lxr-kUyaBKb1mHUpXw3np8"
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})


AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})