"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type {
    CharacterStat,
    CharacterStats,
    HiraganaCharacter,
    OverallProgress,
    ProgressContextType,
    SessionHistory,
} from "../types"

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
    const [overallProgress, setOverallProgress] = useState<OverallProgress>({
        dailyStreak: { studyDates: [], lastStudyDate: null, currentStreak: 0, longestStreak: 0, streakMilestones: [] },
        totalQuestions: 0,
        correctAnswers: 0,
        overallAccuracy: 0,
        currentStreak: 0,
        longestStreak: 0,
        charactersLearned: 0,
        totalStudyTime: 0,
        lastStudyDate: null,
    })
    const [characterStats, setCharacterStats] = useState<CharacterStats>({})
    const [hasStudiedToday, setHasStudiedToday] = useState<boolean>(false)
    const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getTodayDateString = (): string => {
        const today = new Date()
        return today.toISOString().split("T")[0]
    }

    const getYesterdayDateString = (): string => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return yesterday.toISOString().split("T")[0]
    }

    const updateDailyStreak = async (): Promise<OverallProgress> => {
        const today = getTodayDateString()
        const yesterday = getYesterdayDateString()

        const studyDates = overallProgress?.dailyStreak?.studyDates || []
        const lastStudyDate = overallProgress?.dailyStreak?.lastStudyDate
        const currentStreak = overallProgress?.dailyStreak?.currentStreak || 0
        const longestStreak = overallProgress?.dailyStreak?.longestStreak || 0
        const streakMilestones = overallProgress?.dailyStreak?.streakMilestones || []

        if (!studyDates.includes(today)) {
            const newStreak = lastStudyDate && lastStudyDate === yesterday ? currentStreak + 1 : 1

            const milestones = [3, 7, 14, 30, 50, 100, 200, 365]
            const currentMilestones = [...streakMilestones]

            for (const milestone of milestones) {
                if (newStreak >= milestone && !currentMilestones.includes(milestone)) {
                    currentMilestones.push(milestone)
                }
            }

            const updatedProgress: OverallProgress = {
                ...overallProgress,
                dailyStreak: {
                    studyDates: [...studyDates, today],
                    lastStudyDate: today,
                    currentStreak: newStreak,
                    longestStreak: Math.max(longestStreak, newStreak),
                    streakMilestones: currentMilestones,
                },
            }
            setOverallProgress(updatedProgress)
            return updatedProgress
        }
        return overallProgress
    }

    const saveProgressData = async (
        progress: OverallProgress,
        stats: CharacterStats,
        sessionHistory: SessionHistory[],
    ): Promise<void> => {
        await AsyncStorage.setItem("progress", JSON.stringify(progress))
        await AsyncStorage.setItem("characterStats", JSON.stringify(stats))
        await AsyncStorage.setItem("sessionHistory", JSON.stringify(sessionHistory))
    }

    const recordAnswer = async (
        character: HiraganaCharacter,
        isCorrect: boolean,
        responseTime?: number,
    ): Promise<void> => {
        const now = getTodayDateString()

        const updatedOverallProgress = await updateDailyStreak()

        const updatedCharacterStats: CharacterStats = {
            ...characterStats,
            [character.character]: {
                characterId: character.character,
                character: character.character,
                romaji: character.romaji,
                correctAnswers: isCorrect
                    ? (characterStats[character.character]?.correctAnswers || 0) + 1
                    : characterStats[character.character]?.correctAnswers || 0,
                totalAttempts: (characterStats[character.character]?.totalAttempts || 0) + 1,
                responseTimes: [...(characterStats[character.character]?.responseTimes || []), responseTime || 0],
                accuracy: Math.round(
                    ((isCorrect
                        ? (characterStats[character.character]?.correctAnswers || 0) + 1
                        : characterStats[character.character]?.correctAnswers || 0) /
                        ((characterStats[character.character]?.totalAttempts || 0) + 1)) *
                    100,
                ),
            },
        }

        const totalQuestions = updatedOverallProgress.totalQuestions + 1
        const correctAnswers = updatedOverallProgress.correctAnswers + (isCorrect ? 1 : 0)
        const overallAccuracy = Math.round((correctAnswers / totalQuestions) * 100)

        const finalOverallProgress: OverallProgress = {
            ...updatedOverallProgress,
            totalQuestions,
            correctAnswers,
            overallAccuracy,
            lastStudyDate: now,
            charactersLearned: Object.keys(updatedCharacterStats).length,
        }

        setCharacterStats(updatedCharacterStats)
        setOverallProgress(finalOverallProgress)

        await saveProgressData(finalOverallProgress, updatedCharacterStats, sessionHistory)
    }

    const getNextMilestone = (): number => {
        const currentStreak = overallProgress?.dailyStreak?.currentStreak || 0
        const milestones = [3, 7, 14, 30, 50, 100, 200, 365]

        for (const milestone of milestones) {
            if (currentStreak < milestone) {
                return milestone
            }
        }

        return Math.ceil((currentStreak + 1) / 100) * 100
    }

    const getStreakMessage = (): string => {
        const currentStreak = overallProgress?.dailyStreak?.currentStreak || 0

        if (currentStreak === 0) {
            return "Start your learning journey today!"
        } else if (currentStreak === 1) {
            return "Great start! Keep it up!"
        } else if (currentStreak < 7) {
            return "Building momentum!"
        } else if (currentStreak < 14) {
            return "You're on fire!"
        } else if (currentStreak < 30) {
            return "Incredible dedication!"
        } else if (currentStreak < 100) {
            return "You're a Hiragana master!"
        } else {
            return "Legendary streak!"
        }
    }

    const getProblematicCharacters = (): CharacterStat[] => {
        if (!characterStats || Object.keys(characterStats).length === 0) {
            return []
        }

        return Object.values(characterStats)
            .filter((stat: CharacterStat) => stat?.totalAttempts >= 3 && stat?.accuracy < 70)
            .sort((a: CharacterStat, b: CharacterStat) => (a?.accuracy || 0) - (b?.accuracy || 0))
            .slice(0, 10)
    }

    const getTopPerformingCharacters = (): CharacterStat[] => {
        if (!characterStats || Object.keys(characterStats).length === 0) {
            return []
        }

        return Object.values(characterStats)
            .filter((stat: CharacterStat) => stat?.totalAttempts >= 3 && stat?.accuracy >= 80)
            .sort((a: CharacterStat, b: CharacterStat) => (b?.accuracy || 0) - (a?.accuracy || 0))
            .slice(0, 10)
    }

    const resetProgress = async (): Promise<void> => {
        const initialProgress: OverallProgress = {
            dailyStreak: {
                studyDates: [],
                lastStudyDate: null,
                currentStreak: 0,
                longestStreak: 0,
                streakMilestones: [],
            },
            totalQuestions: 0,
            correctAnswers: 0,
            overallAccuracy: 0,
            currentStreak: 0,
            longestStreak: 0,
            charactersLearned: 0,
            totalStudyTime: 0,
            lastStudyDate: null,
        }

        setOverallProgress(initialProgress)
        setCharacterStats({})
        setSessionHistory([])

        await AsyncStorage.removeItem("progress")
        await AsyncStorage.removeItem("characterStats")
        await AsyncStorage.removeItem("sessionHistory")
    }

    const recordSession = async (session: Omit<SessionHistory, "id" | "date" | "charactersStudied">): Promise<void> => {
        const newSession: SessionHistory = {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            charactersStudied: characterStats ? Object.keys(characterStats).slice(-10) : [],
            ...session,
        }

        const currentHistory = sessionHistory || []
        const updatedHistory = [newSession, ...currentHistory].slice(0, 50)
        setSessionHistory(updatedHistory)

        await saveProgressData(overallProgress, characterStats, updatedHistory)
    }

    useEffect(() => {
        const loadProgressData = async (): Promise<void> => {
            try {
                setIsLoading(true)
                const progressData = await AsyncStorage.getItem("progress")
                const characterStatsData = await AsyncStorage.getItem("characterStats")
                const sessionHistoryData = await AsyncStorage.getItem("sessionHistory")

                setOverallProgress(
                    progressData
                        ? JSON.parse(progressData)
                        : {
                            dailyStreak: {
                                studyDates: [],
                                lastStudyDate: null,
                                currentStreak: 0,
                                longestStreak: 0,
                                streakMilestones: [],
                            },
                            totalQuestions: 0,
                            correctAnswers: 0,
                            overallAccuracy: 0,
                            currentStreak: 0,
                            longestStreak: 0,
                            charactersLearned: 0,
                            totalStudyTime: 0,
                            lastStudyDate: null,
                        },
                )
                setCharacterStats(characterStatsData ? JSON.parse(characterStatsData) : {})
                setSessionHistory(sessionHistoryData ? JSON.parse(sessionHistoryData) : [])
            } catch (error) {
                console.error("Error loading progress data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadProgressData()
    }, [])

    return (
        <ProgressContext.Provider
            value={{
                overallProgress,
                setOverallProgress,
                characterStats,
                setCharacterStats,
                hasStudiedToday,
                setHasStudiedToday,
                recordAnswer,
                recordSession,
                getNextMilestone,
                getStreakMessage,
                getProblematicCharacters,
                getTopPerformingCharacters,
                sessionHistory,
                resetProgress,
                isLoading,
            }}
        >
            {children}
        </ProgressContext.Provider>
    )
}

export function useProgress(): ProgressContextType {
    const context = useContext(ProgressContext)
    if (context === undefined) {
        throw new Error("useProgress must be used within a ProgressProvider")
    }
    return context
}
