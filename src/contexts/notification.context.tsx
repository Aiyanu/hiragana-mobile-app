"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Platform } from "react-native"
import type { NotificationContextType, NotificationSettings } from "../types"

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const STORAGE_KEY = "hiragana_notification_settings"

const DEFAULT_SETTINGS: NotificationSettings = {
    dailyReminders: false,
    streakNotifications: false,
    motivationalMessages: false,
    reminderTime: { hour: 19, minute: 0 }, // 7 PM default
}

const MOTIVATIONAL_MESSAGES = [
    "Keep your streak alive! Practice Hiragana now",
    "Your brain is ready for some Hiragana practice!",
    "A few minutes of practice can make a big difference!",
    "Don't break your streak! Time for Hiragana practice",
    "Your future self will thank you for practicing today!",
    "Consistency is key! Let's practice some Hiragana",
    "Every character you learn brings you closer to fluency!",
]

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true, // Added missing required properties
        shouldShowList: true,
    }),
})

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)
    const [hasPermissions, setHasPermissions] = useState<boolean>(false)
    const [isInitialized, setIsInitialized] = useState<boolean>(false)

    useEffect(() => {
        initializeNotifications()
    }, [])

    const loadSettings = async (): Promise<void> => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setSettings({ ...DEFAULT_SETTINGS, ...parsed })
            }
        } catch (error) {
            console.error("Error loading notification settings:", error)
        }
    }

    const saveSettings = async (newSettings: NotificationSettings): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
        } catch (error) {
            console.error("Error saving notification settings:", error)
        }
    }

    const checkPermissions = async (): Promise<void> => {
        const { status } = await Notifications.getPermissionsAsync()
        setHasPermissions(status === "granted")
    }

    const requestPermissions = async (): Promise<boolean> => {
        if (!Device.isDevice) {
            console.log("Must use physical device for Push Notifications")
            return false
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        if (finalStatus !== "granted") {
            console.log("Failed to get push token for push notification!")
            setHasPermissions(false)
            return false
        }

        setHasPermissions(true)

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            })
        }

        return true
    }

    const updateSettings = async (newSettings: Partial<NotificationSettings>): Promise<void> => {
        const updatedSettings = { ...settings, ...newSettings }
        setSettings(updatedSettings)
        await saveSettings(updatedSettings)

        // Reschedule notifications with new settings
        await cancelAllNotifications()
        if (hasPermissions) {
            await scheduleNotifications()
        }
    }

    const cancelAllNotifications = async (): Promise<void> => {
        await Notifications.cancelAllScheduledNotificationsAsync()
    }

    const initializeNotifications = async (): Promise<void> => {
        try {
            await loadSettings()
            await checkPermissions()
            setIsInitialized(true)

            // Auto-schedule notifications if permissions are already granted
            const { status } = await Notifications.getPermissionsAsync()
            if (status === "granted") {
                await scheduleNotifications()
            }
        } catch (error) {
            console.error("Error initializing notifications:", error)
            setIsInitialized(true)
        }
    }

    const scheduleNotifications = async (): Promise<void> => {
        if (!hasPermissions || !isInitialized) return

        try {
            await cancelAllNotifications()

            // Schedule daily reminder
            if (settings.dailyReminders) {
                const dailyReminderRequest: Notifications.NotificationRequestInput = {
                    content: {
                        title: "Time to Practice Hiragana!",
                        body: "Keep your learning streak alive with a quick practice session.",
                        sound: true,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DAILY,
                        hour: settings.reminderTime.hour,
                        minute: settings.reminderTime.minute,
                        repeats: true,
                    } as Notifications.DailyTriggerInput,
                }
                await Notifications.scheduleNotificationAsync(dailyReminderRequest)
            }

            // Schedule streak maintenance notifications
            if (settings.streakNotifications) {
                const streakHour = settings.reminderTime.hour === 20 ? 21 : 20

                const streakReminderRequest: Notifications.NotificationRequestInput = {
                    content: {
                        title: "Don't Break Your Streak!",
                        body: "You haven't practiced today. Keep your streak going!",
                        sound: true,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DAILY,
                        hour: streakHour,
                        minute: 0,
                        repeats: true,
                    } as Notifications.DailyTriggerInput,
                }
                await Notifications.scheduleNotificationAsync(streakReminderRequest)
            }

            // Schedule motivational messages
            if (settings.motivationalMessages) {
                const daysOfWeek = [1, 3, 5] // Monday, Wednesday, Friday

                for (let i = 0; i < daysOfWeek.length; i++) {
                    const day = daysOfWeek[i]
                    const randomHour = Math.floor(Math.random() * 4) + 16 // Between 4-8 PM
                    const randomMinute = Math.floor(Math.random() * 60)
                    const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]

                    const motivationalRequest: Notifications.NotificationRequestInput = {
                        content: {
                            title: "Motivation Boost!",
                            body: randomMessage,
                            sound: true,
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                            weekday: day,
                            hour: randomHour,
                            minute: randomMinute,
                            repeats: true,
                        } as Notifications.WeeklyTriggerInput,
                    }
                    await Notifications.scheduleNotificationAsync(motivationalRequest)
                }
            }

            console.log("Notifications scheduled successfully")
        } catch (error) {
            console.error("Error scheduling notifications:", error)
        }
    }

    const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
        try {
            const scheduled = await Notifications.getAllScheduledNotificationsAsync()
            console.log("Currently scheduled notifications:", scheduled.length)
            return scheduled
        } catch (error) {
            console.error("Error getting scheduled notifications:", error)
            return []
        }
    }

    const value: NotificationContextType = {
        settings,
        updateSettings,
        requestPermissions,
        hasPermissions,
        scheduleNotifications,
        cancelAllNotifications,
        getScheduledNotifications,
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications(): NotificationContextType {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}
