"use client"

import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

import LearningScreen from "@/src/screens/learning.screen"
import { AuthProvider, useAuth } from "../src/contexts/auth.context"
import { NotificationProvider } from "../src/contexts/notification.context"
import { ProgressProvider } from "../src/contexts/progress.context"
import AuthScreen from "../src/screens/auth.screen"
import FlashcardScreen from "../src/screens/flashcard.screen"
import ProgressScreen from "../src/screens/progress.screen"
import SettingsScreen from "../src/screens/settings.screen"

const Tab = createBottomTabNavigator()

const AppContent = () => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        )
    }

    if (!user) {
        return <AuthScreen />
    }

    return (
        <>
            <StatusBar style="auto" />
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: "#6366f1",
                    tabBarInactiveTintColor: "#6b7280",
                    headerShown: false,
                    // headerStyle: {
                    //     backgroundColor: "#f8fafc",
                    // },
                    // headerTitleStyle: {
                    //     fontWeight: "bold",
                    //     color: "#1f2937",
                    // },
                    // use tabBarStyle for bottom tab bar appearance
                    tabBarStyle: { backgroundColor: "#ffffff" },
                }}
            >
                <Tab.Screen
                    name="Practice"
                    component={FlashcardScreen}
                    options={{
                        tabBarLabel: "Practice",
                        headerTitle: "Hiragana Practice",
                        tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />
                    }}
                />
                <Tab.Screen
                    name="Learn"
                    component={LearningScreen}
                    options={{
                        tabBarLabel: "Learn",
                        headerTitle: "Learn Characters",
                        tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
                    }}
                />
                <Tab.Screen
                    name="Progress"
                    component={ProgressScreen}
                    options={{
                        tabBarLabel: "Progress",
                        headerTitle: "Your Progress", tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: "Settings",
                        headerTitle: "Settings",
                        tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />
                    }}
                />
            </Tab.Navigator>
        </>
    )
}

/**
 * Page accepts a possible `style` prop from the router — we apply it to a real View
 * so it won't be forwarded to any Fragments (which triggers the warning).
 *
 * Note: do NOT add another NavigationContainer here when using expo-router.
 */
export default function Page({ style }: { style?: any }) {
    return (
        <View style={[styles.container, style]}>
            <AuthProvider>
                <NotificationProvider>
                    <ProgressProvider>
                        <AppContent />
                    </ProgressProvider>
                </NotificationProvider>
            </AuthProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
    },
})
