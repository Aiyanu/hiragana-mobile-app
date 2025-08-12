"use client"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
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
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: "#6366f1",
                    tabBarInactiveTintColor: "#6b7280",
                    headerStyle: {
                        backgroundColor: "#f8fafc",
                    },
                    headerTitleStyle: {
                        fontWeight: "bold",
                        color: "#1f2937",
                    },
                }}
            >
                <Tab.Screen
                    name="Practice"
                    component={FlashcardScreen}
                    options={{
                        tabBarLabel: "Practice",
                        headerTitle: "Hiragana Practice",
                    }}
                />
                <Tab.Screen
                    name="Learn"
                    component={LearningScreen}
                    options={{
                        tabBarLabel: "Learn",
                        headerTitle: "Learn Characters",
                    }}
                />
                <Tab.Screen
                    name="Progress"
                    component={ProgressScreen}
                    options={{
                        tabBarLabel: "Progress",
                        headerTitle: "Your Progress",
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        tabBarLabel: "Settings",
                        headerTitle: "Settings",
                    }}
                />
            </Tab.Navigator>
        </View>
    )
}

export default function Page() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <ProgressProvider>
                    <AppContent />
                </ProgressProvider>
            </NotificationProvider>
        </AuthProvider>
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
