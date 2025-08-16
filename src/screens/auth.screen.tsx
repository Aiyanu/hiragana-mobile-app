"use client"

import type React from "react"
import { useState } from "react"
import { StyleSheet, View } from "react-native"
import LoginScreen from "./login.screen"
import RegisterScreen from "./register.screen"

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <View style={styles.container}>
            {isLogin ? (
                <LoginScreen onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
                <RegisterScreen onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
    },
})

export default AuthScreen
