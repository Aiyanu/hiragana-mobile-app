"use client"

import { useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import StreakDisplay from "../components/StreakDisplay"
import { useProgress } from "../contexts/progress.context"
import type { CharacterType } from "../types"

export default function ProgressScreen() {
    const {
        overallProgress,
        characterStats,
        sessionHistory,
        getProblematicCharacters,
        getTopPerformingCharacters,
        getCharacterStatsByType,
        getProgressByType,
        resetProgress,
        isLoading,
    } = useProgress()

    const [sectionsExpanded, setSectionsExpanded] = useState({
        improvements: false,
        topPerforming: false,
        recentSessions: false,
    })

    const toggleSection = (section: keyof typeof sectionsExpanded) => {
        setSectionsExpanded((prev) => ({
            ...prev,
            [section]: !prev[section],
        }))
    }

    const problematicCharacters = getProblematicCharacters?.() || []
    const topCharacters = getTopPerformingCharacters?.() || []
    const recentSessions = sessionHistory?.slice(0, 5) || []
    const progressByType = getProgressByType?.() || {}

    const formatStudyTime = (minutes: number): string => {
        if (!minutes || minutes < 60) return `${minutes || 0}m`
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return `${hours}h ${remainingMinutes}m`
    }

    const formatDate = (date: string | Date): string => {
        if (!date) return "Never"
        const dateObj = typeof date === "string" ? new Date(date) : date
        return dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getCharacterTypeStyle = (type: CharacterType) => {
        switch (type) {
            case "hiragana":
                return { backgroundColor: "#dbeafe", color: "#1e40af", label: "Hiragana" }
            case "katakana":
                return { backgroundColor: "#fef3c7", color: "#92400e", label: "Katakana" }
            case "kanji":
                return { backgroundColor: "#fce7f3", color: "#be185d", label: "Kanji" }
            default:
                return { backgroundColor: "#f3f4f6", color: "#6b7280", label: "Unknown" }
        }
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading your progress...</Text>
                </View>
            </SafeAreaView>
        )
    }

    const hasAnyProgress = overallProgress?.totalQuestions > 0 || Object.keys(characterStats || {}).length > 0

    if (!hasAnyProgress) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateTitle}>Start Your Learning Journey!</Text>
                    <Text style={styles.emptyStateText}>
                        Complete some flashcard questions to see your progress and statistics here.
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Your Progress</Text>

                <StreakDisplay />

                {/* Overall Stats */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Overall Stats</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{overallProgress?.totalQuestions || 0}</Text>
                            <Text style={styles.statLabel}>Questions</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{overallProgress?.overallAccuracy || 0}%</Text>
                            <Text style={styles.statLabel}>Accuracy</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{overallProgress?.currentStreak || 0}</Text>
                            <Text style={styles.statLabel}>Session Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{overallProgress?.longestStreak || 0}</Text>
                            <Text style={styles.statLabel}>Best Session</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{overallProgress?.charactersLearned || 0}</Text>
                            <Text style={styles.statLabel}>Learned</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{formatStudyTime(overallProgress?.totalStudyTime || 0)}</Text>
                            <Text style={styles.statLabel}>Study Time</Text>
                        </View>
                    </View>
                    {overallProgress?.lastStudyDate && (
                        <Text style={styles.lastStudyText}>Last studied: {formatDate(overallProgress.lastStudyDate)}</Text>
                    )}
                </View>

                {/* Progress by Character Type */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Progress by Character Type</Text>
                    <View style={styles.typeProgressContainer}>
                        {(Object.keys(progressByType) as CharacterType[]).map((type) => {
                            const typeData = progressByType[type]
                            const typeStyle = getCharacterTypeStyle(type)

                            if (typeData.learned === 0) return null

                            return (
                                <View key={type} style={styles.typeProgressItem}>
                                    <View style={styles.typeHeader}>
                                        <View style={[styles.typeBadge, { backgroundColor: typeStyle.backgroundColor }]}>
                                            <Text style={[styles.typeBadgeText, { color: typeStyle.color }]}>{typeStyle.label}</Text>
                                        </View>
                                        <Text style={styles.typeAccuracy}>{typeData.accuracy}%</Text>
                                    </View>
                                    <View style={styles.typeStats}>
                                        <Text style={styles.typeStatsText}>
                                            {typeData.learned} characters • {typeData.total} questions
                                        </Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>

                {/* Areas to Improve */}
                <View style={styles.card}>
                    <TouchableOpacity style={styles.collapsibleHeader} onPress={() => toggleSection("improvements")}>
                        <Text style={styles.cardTitle}>Areas to Improve</Text>
                        <Text style={styles.toggleIcon}>{sectionsExpanded.improvements ? "▼" : "▶"}</Text>
                    </TouchableOpacity>

                    {sectionsExpanded.improvements && (
                        <ScrollView style={styles.collapsibleContent} nestedScrollEnabled>
                            {problematicCharacters.length > 0 ? (
                                <View style={styles.characterList}>
                                    {problematicCharacters.map((stat) => {
                                        const typeStyle = getCharacterTypeStyle(stat.type)
                                        return (
                                            <View key={stat.characterId} style={styles.characterItem}>
                                                <View style={styles.characterInfo}>
                                                    <Text style={styles.characterText}>{stat.character}</Text>
                                                    <Text style={styles.romajiText}>{stat.romaji}</Text>
                                                    <View style={[styles.characterTypeBadge, { backgroundColor: typeStyle.backgroundColor }]}>
                                                        <Text style={[styles.characterTypeBadgeText, { color: typeStyle.color }]}>
                                                            {(stat.type?.charAt(0) || "U").toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.characterStats}>
                                                    <Text style={[styles.accuracyText, { color: "#dc2626" }]}>{stat.accuracy}%</Text>
                                                    <Text style={styles.attemptsText}>{stat.totalAttempts} attempts</Text>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            ) : (
                                <Text style={styles.placeholderText}>
                                    {(overallProgress?.totalQuestions || 0) > 0
                                        ? "Great job! No problem areas identified yet."
                                        : "Complete more questions to see areas for improvement."}
                                </Text>
                            )}
                        </ScrollView>
                    )}
                </View>

                {/* Top Performing Characters */}
                {topCharacters.length > 0 && (
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.collapsibleHeader} onPress={() => toggleSection("topPerforming")}>
                            <Text style={styles.cardTitle}>Top Performing Characters</Text>
                            <Text style={styles.toggleIcon}>{sectionsExpanded.topPerforming ? "▼" : "▶"}</Text>
                        </TouchableOpacity>

                        {sectionsExpanded.topPerforming && (
                            <ScrollView style={styles.collapsibleContent} nestedScrollEnabled>
                                <View style={styles.characterList}>
                                    {topCharacters.slice(0, 5).map((stat) => {
                                        const typeStyle = getCharacterTypeStyle(stat.type)
                                        return (
                                            <View key={stat.characterId} style={styles.characterItem}>
                                                <View style={styles.characterInfo}>
                                                    <Text style={styles.characterText}>{stat.character}</Text>
                                                    <Text style={styles.romajiText}>{stat.romaji}</Text>
                                                    <View style={[styles.characterTypeBadge, { backgroundColor: typeStyle.backgroundColor }]}>
                                                        <Text style={[styles.characterTypeBadgeText, { color: typeStyle.color }]}>
                                                            {(stat.type?.charAt(0) || "U").toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.characterStats}>
                                                    <Text style={[styles.accuracyText, { color: "#16a34a" }]}>{stat.accuracy}%</Text>
                                                    <Text style={styles.attemptsText}>{stat.totalAttempts} attempts</Text>
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                )}

                {/* Recent Sessions */}
                {recentSessions.length > 0 && (
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.collapsibleHeader} onPress={() => toggleSection("recentSessions")}>
                            <Text style={styles.cardTitle}>Recent Sessions</Text>
                            <Text style={styles.toggleIcon}>{sectionsExpanded.recentSessions ? "▼" : "▶"}</Text>
                        </TouchableOpacity>

                        {sectionsExpanded.recentSessions && (
                            <ScrollView style={styles.collapsibleContent} nestedScrollEnabled>
                                <View style={styles.sessionList}>
                                    {recentSessions.map((session) => (
                                        <View key={session.id} style={styles.sessionItem}>
                                            <View style={styles.sessionInfo}>
                                                <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                                                <Text style={styles.sessionDetails}>
                                                    {session.questionsAnswered} questions • {session.accuracy}% accuracy
                                                </Text>
                                            </View>
                                            <View style={styles.sessionStats}>
                                                <Text style={styles.sessionDuration}>{session.duration}m</Text>
                                                {(session.streak || 0) > 0 && <Text style={styles.sessionStreak}>🔥 {session.streak}</Text>}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        )}
                    </View>
                )}

                {/* Reset Progress */}
                {(overallProgress?.totalQuestions || 0) > 0 && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
                        <Text style={styles.resetButtonText}>Reset All Progress</Text>
                    </TouchableOpacity>
                )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#6b7280",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statItem: {
        alignItems: "center",
        width: "30%",
        marginBottom: 16,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
    },
    statLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
    lastStudyText: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 8,
        fontStyle: "italic",
    },
    characterList: {
        gap: 12,
    },
    characterItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
    },
    characterInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    characterText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
    },
    romajiText: {
        fontSize: 16,
        color: "#6b7280",
    },
    characterStats: {
        alignItems: "flex-end",
    },
    accuracyText: {
        fontSize: 16,
        fontWeight: "600",
    },
    attemptsText: {
        fontSize: 12,
        color: "#9ca3af",
    },
    sessionList: {
        gap: 12,
    },
    sessionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#f9fafb",
        borderRadius: 8,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionDate: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },
    sessionDetails: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
    sessionStats: {
        alignItems: "flex-end",
    },
    sessionDuration: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6366f1",
    },
    sessionStreak: {
        fontSize: 12,
        color: "#f59e0b",
    },
    placeholderText: {
        fontSize: 16,
        color: "#9ca3af",
        fontStyle: "italic",
        textAlign: "center",
    },
    resetButton: {
        backgroundColor: "#dc2626",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 20,
    },
    resetButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 16,
        textAlign: "center",
    },
    emptyStateText: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 24,
    },
    typeProgressContainer: {
        gap: 12,
    },
    typeProgressItem: {
        padding: 16,
        backgroundColor: "#f9fafb",
        borderRadius: 12,
    },
    typeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    typeAccuracy: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
    },
    typeStats: {
        marginTop: 4,
    },
    typeStatsText: {
        fontSize: 12,
        color: "#6b7280",
    },
    characterTypeBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    characterTypeBadgeText: {
        fontSize: 10,
        fontWeight: "bold",
    },
    collapsibleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 8,
    },
    toggleIcon: {
        fontSize: 16,
        color: "#6b7280",
        fontWeight: "600",
    },
    collapsibleContent: {
        maxHeight: 300,
        marginTop: 8,
    },
})
