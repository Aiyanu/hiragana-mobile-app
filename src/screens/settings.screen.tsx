"use client"

import { useState } from "react"
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../contexts/auth.context"
import { useNotifications } from "../contexts/notification.context"

export default function SettingsScreen() {
    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const { settings, updateSettings, requestPermissions, hasPermissions } = useNotifications()
    const { user, logout } = useAuth()

    const handleNotificationToggle = async (setting: keyof typeof settings, value: boolean) => {
        if (value && !hasPermissions) {
            const granted = await requestPermissions()
            if (!granted) {
                Alert.alert(
                    "Permission Required",
                    "Please enable notifications in your device settings to receive reminders.",
                    [{ text: "OK" }],
                )
                return
            }
        }

        await updateSettings({ [setting]: value })
    }

    const handleReminderTimeChange = () => {
        // In a real app, you would show a time picker here
        Alert.alert("Time Picker", "Time picker would be implemented here", [{ text: "OK" }])
    }

    const handleLogout = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: logout },
        ])
    }

    const formatTime = (hour: number, minute: number): string => {
        const period = hour >= 12 ? "PM" : "AM"
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
        const displayMinute = minute.toString().padStart(2, "0")
        return `${displayHour}:${displayMinute} ${period}`
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Name</Text>
                        <Text style={styles.settingValue}>{user?.name}</Text>
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Email</Text>
                        <Text style={styles.settingValue}>{user?.email}</Text>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Practice Settings</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Voice Recognition</Text>
                        <Switch
                            value={voiceEnabled}
                            onValueChange={setVoiceEnabled}
                            trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                            thumbColor={voiceEnabled ? "#ffffff" : "#f3f4f6"}
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Character Categories</Text>
                        <Text style={styles.settingValue}>All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>

                    {!hasPermissions && (
                        <View style={styles.permissionWarning}>
                            <Text style={styles.permissionWarningText}>
                                Enable notifications to receive daily reminders and streak alerts.
                            </Text>
                            <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
                                <Text style={styles.permissionButtonText}>Enable Notifications</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Daily Reminders</Text>
                        <Switch
                            value={settings.dailyReminders}
                            onValueChange={(value) => handleNotificationToggle("dailyReminders", value)}
                            trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                            thumbColor={settings.dailyReminders ? "#ffffff" : "#f3f4f6"}
                        />
                    </View>

                    {settings.dailyReminders && (
                        <TouchableOpacity style={styles.settingItem} onPress={handleReminderTimeChange}>
                            <Text style={styles.settingLabel}>Reminder Time</Text>
                            <Text style={styles.settingValue}>
                                {formatTime(settings.reminderTime.hour, settings.reminderTime.minute)}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Streak Notifications</Text>
                        <Switch
                            value={settings.streakNotifications}
                            onValueChange={(value) => handleNotificationToggle("streakNotifications", value)}
                            trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                            thumbColor={settings.streakNotifications ? "#ffffff" : "#f3f4f6"}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Motivational Messages</Text>
                        <Switch
                            value={settings.motivationalMessages}
                            onValueChange={(value) => handleNotificationToggle("motivationalMessages", value)}
                            trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
                            thumbColor={settings.motivationalMessages ? "#ffffff" : "#f3f4f6"}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Version</Text>
                        <Text style={styles.settingValue}>1.0.0</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 30,
        textAlign: "center",
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 16,
    },
    settingItem: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    settingLabel: {
        fontSize: 16,
        color: "#374151",
    },
    settingValue: {
        fontSize: 16,
        color: "#6b7280",
    },
    logoutButton: {
        backgroundColor: "#ef4444",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },
    logoutButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    permissionWarning: {
        backgroundColor: "#fef3c7",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: "center",
    },
    permissionWarningText: {
        fontSize: 14,
        color: "#92400e",
        textAlign: "center",
        marginBottom: 12,
    },
    permissionButton: {
        backgroundColor: "#f59e0b",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
    },
})
