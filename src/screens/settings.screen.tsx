"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { useAuth } from "../contexts/auth.context"
import { useNotifications } from "../contexts/notification.context"
import type { CharacterType } from "../types"

export default function SettingsScreen() {
    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const [questionsPerSession, setQuestionsPerSession] = useState(5)
    const [questionsInput, setQuestionsInput] = useState("5")
    const [selectedCharacterTypes, setSelectedCharacterTypes] = useState<CharacterType[]>(["hiragana"])
    const [showCharacterSettings, setShowCharacterSettings] = useState(false)

    const { settings, updateSettings, requestPermissions, hasPermissions } = useNotifications()
    const { user, logout } = useAuth()

    useEffect(() => {
        loadQuestionsPerSession()
        loadCharacterTypeSettings()
    }, [])

    const loadQuestionsPerSession = async () => {
        try {
            const saved = await AsyncStorage.getItem("questionsPerSession")
            if (saved) {
                const value = Number.parseInt(saved)
                setQuestionsPerSession(value)
                setQuestionsInput(value.toString())
            }
        } catch (error) {
            console.log("Error loading questions per session:", error)
        }
    }

    const loadCharacterTypeSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem("selectedCharacterTypes")
            if (saved) {
                setSelectedCharacterTypes(JSON.parse(saved))
            }
        } catch (error) {
            console.log("Error loading character type settings:", error)
        }
    }

    const updateQuestionsPerSession = async (value: number) => {
        try {
            await AsyncStorage.setItem("questionsPerSession", value.toString())
            setQuestionsPerSession(value)
        } catch (error) {
            console.log("Error saving questions per session:", error)
        }
    }

    const updateCharacterTypeSettings = async (types: CharacterType[]) => {
        try {
            await AsyncStorage.setItem("selectedCharacterTypes", JSON.stringify(types))
            setSelectedCharacterTypes(types)
            Alert.alert("Settings Saved", "Your character type preferences have been updated.", [{ text: "OK" }])
        } catch (error) {
            console.log("Error saving character type settings:", error)
            Alert.alert("Error", "Failed to save character type settings. Please try again.", [{ text: "OK" }])
        }
    }

    const toggleCharacterType = (type: CharacterType) => {
        if (selectedCharacterTypes.includes(type)) {
            if (selectedCharacterTypes.length === 1) return
            const newTypes = selectedCharacterTypes.filter((t) => t !== type)
            updateCharacterTypeSettings(newTypes)
        } else {
            const newTypes = [...selectedCharacterTypes, type]
            updateCharacterTypeSettings(newTypes)
        }
    }

    const getCharacterTypeInfo = (type: CharacterType) => {
        switch (type) {
            case "hiragana":
                return { label: "ひらがな", description: "Basic Japanese phonetic script" }
            case "katakana":
                return { label: "カタカナ", description: "Script for foreign words" }
            case "kanji":
                return { label: "漢字", description: "Chinese characters with meaning" }
            default:
                return { label: type, description: "" }
        }
    }

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
        Alert.alert("Time Picker", "Time picker would be implemented here", [{ text: "OK" }])
    }

    const handleLogout = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: logout },
        ])
    }

    const handleQuestionsInputChange = (text: string) => {
        setQuestionsInput(text)
        const value = Number.parseInt(text)
        if (!isNaN(value) && value >= 1 && value <= 50) {
            updateQuestionsPerSession(value)
        }
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

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Questions per Session</Text>
                        <TextInput
                            style={styles.numberInput}
                            value={questionsInput}
                            onChangeText={handleQuestionsInputChange}
                            keyboardType="numeric"
                            maxLength={2}
                            placeholder="5"
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem} onPress={() => setShowCharacterSettings(!showCharacterSettings)}>
                        <Text style={styles.settingLabel}>Default Character Types</Text>
                        <View style={styles.characterTypesPreview}>
                            <Text style={styles.settingValue}>{selectedCharacterTypes.length} selected</Text>
                            <Text style={styles.expandIcon}>{showCharacterSettings ? "▲" : "▼"}</Text>
                        </View>
                    </TouchableOpacity>

                    {showCharacterSettings && (
                        <View style={styles.characterSettingsContainer}>
                            <Text style={styles.characterSettingsTitle}>Select Character Types for Practice</Text>
                            <Text style={styles.characterSettingsSubtitle}>
                                Choose which character types to include in your practice sessions by default
                            </Text>

                            {(["hiragana", "katakana", "kanji"] as CharacterType[]).map((type) => {
                                const isSelected = selectedCharacterTypes.includes(type)
                                const typeInfo = getCharacterTypeInfo(type)
                                const isDisabled = selectedCharacterTypes.length === 1 && isSelected

                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.characterTypeOption,
                                            isSelected && styles.selectedCharacterTypeOption,
                                            isDisabled && styles.disabledCharacterTypeOption,
                                        ]}
                                        onPress={() => toggleCharacterType(type)}
                                        disabled={isDisabled}
                                    >
                                        <View style={styles.characterTypeContent}>
                                            <View style={styles.characterTypeHeader}>
                                                <Text style={styles.characterTypeLabel}>{typeInfo.label}</Text>
                                                <Text style={[styles.characterTypeTag, isSelected && styles.selectedCharacterTypeTag]}>
                                                    {type.toUpperCase()}
                                                </Text>
                                            </View>
                                            <Text
                                                style={[styles.characterTypeDescription, isSelected && styles.selectedCharacterTypeDescription]}
                                            >
                                                {typeInfo.description}
                                            </Text>
                                        </View>

                                        <View style={[styles.characterTypeCheckbox, isSelected && styles.checkedCharacterTypeCheckbox]}>
                                            {isSelected && <Text style={styles.checkmark}>✓</Text>}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}

                            <Text style={styles.characterSettingsNote}>
                                At least one character type must be selected. Changes are saved automatically and will apply to your
                                next practice session.
                            </Text>
                        </View>
                    )}
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
        paddingTop: 20,
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
    numberInput: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        fontSize: 16,
        color: "#374151",
        textAlign: "center",
        minWidth: 50,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    characterTypesPreview: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    expandIcon: {
        fontSize: 12,
        color: "#6b7280",
    },
    characterSettingsContainer: {
        backgroundColor: "#f9fafb",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    characterSettingsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 4,
    },
    characterSettingsSubtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 16,
    },
    characterTypeOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e5e7eb",
        backgroundColor: "#ffffff",
        marginBottom: 12,
    },
    selectedCharacterTypeOption: {
        borderColor: "#6366f1",
        backgroundColor: "#eef2ff",
    },
    disabledCharacterTypeOption: {
        opacity: 0.6,
    },
    characterTypeContent: {
        flex: 1,
    },
    characterTypeHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    characterTypeLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        marginRight: 8,
    },
    characterTypeTag: {
        fontSize: 10,
        fontWeight: "600",
        color: "#6b7280",
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    selectedCharacterTypeTag: {
        color: "#6366f1",
        backgroundColor: "#ddd6fe",
    },
    characterTypeDescription: {
        fontSize: 12,
        color: "#9ca3af",
    },
    selectedCharacterTypeDescription: {
        color: "#6366f1",
    },
    characterTypeCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#d1d5db",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
    checkedCharacterTypeCheckbox: {
        backgroundColor: "#6366f1",
        borderColor: "#6366f1",
    },
    checkmark: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
    },
    characterSettingsNote: {
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 8,
        fontStyle: "italic",
    },
})
