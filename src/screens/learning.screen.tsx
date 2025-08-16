"use client"

import * as Speech from "expo-speech"
import { useState } from "react"
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useProgress } from "../contexts/progress.context"
import {
    allCharacters,
    hiraganaCharacters,
    kanjiCharacters,
    katakanaCharacters,
    type Character,
} from "../data/hiragana.data"
import type { CharacterType } from "../types"

const { width } = Dimensions.get("window")
const ITEM_SIZE = (width - 60) / 4 // 4 columns with padding

export default function LearningScreen() {
    const [selectedTab, setSelectedTab] = useState<CharacterType | "all">("all")
    const { characterStats } = useProgress()

    const handleCharacterPress = (character: Character) => {
        // Play the character pronunciation using text-to-speech
        Speech.speak(character.romaji, {
            language: "ja-JP", // Japanese language
            pitch: 1.0,
            rate: 0.8, // Slightly slower for learning
        })
    }

    const getCharacterColor = (accuracy: number, totalAttempts: number) => {
        if (totalAttempts === 0) return "#f3f4f6" // Gray for never attempted
        if (accuracy >= 80) return "#dcfce7" // Green for high accuracy
        if (accuracy >= 60) return "#fef3c7" // Yellow for medium accuracy
        return "#fee2e2" // Red for low accuracy
    }

    const getCharacterTextColor = (accuracy: number, totalAttempts: number) => {
        if (totalAttempts === 0) return "#6b7280"
        if (accuracy >= 80) return "#166534"
        if (accuracy >= 60) return "#92400e"
        return "#dc2626"
    }

    const getCharacterTypeBadgeColor = (type: CharacterType) => {
        switch (type) {
            case "hiragana":
                return { backgroundColor: "#dbeafe", color: "#1e40af" }
            case "katakana":
                return { backgroundColor: "#fef3c7", color: "#92400e" }
            case "kanji":
                return { backgroundColor: "#fce7f3", color: "#be185d" }
            default:
                return { backgroundColor: "#f3f4f6", color: "#6b7280" }
        }
    }

    const getFilteredCharacters = () => {
        switch (selectedTab) {
            case "hiragana":
                return hiraganaCharacters
            case "katakana":
                return katakanaCharacters
            case "kanji":
                return kanjiCharacters
            case "all":
            default:
                return allCharacters
        }
    }

    const getTabTitle = () => {
        switch (selectedTab) {
            case "hiragana":
                return "Learn Hiragana"
            case "katakana":
                return "Learn Katakana"
            case "kanji":
                return "Learn Kanji"
            case "all":
            default:
                return "Learn Japanese Characters"
        }
    }

    const filteredCharacters = getFilteredCharacters()

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{getTabTitle()}</Text>
                <Text style={styles.subtitle}>Tap any character to hear its pronunciation</Text>

                <View style={styles.tabContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
                        {[
                            { key: "all", label: "All", count: allCharacters.length },
                            { key: "hiragana", label: "ひらがな", count: hiraganaCharacters.length },
                            { key: "katakana", label: "カタカナ", count: katakanaCharacters.length },
                            { key: "kanji", label: "漢字", count: kanjiCharacters.length },
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
                                onPress={() => setSelectedTab(tab.key as CharacterType | "all")}
                            >
                                <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
                                <Text style={[styles.tabCount, selectedTab === tab.key && styles.activeTabCount]}>{tab.count}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.grid}>
                    {filteredCharacters.map((character) => {
                        const stats = characterStats?.[character.id] || {
                            characterId: character.id,
                            character: "",
                            romaji: "",
                            type: "hiragana" as CharacterType,
                            totalAttempts: 0,
                            correctAnswers: 0,
                            accuracy: 0,
                            responseTimes: [],
                        }
                        const backgroundColor = getCharacterColor(stats.accuracy, stats.totalAttempts)
                        const textColor = getCharacterTextColor(stats.accuracy, stats.totalAttempts)
                        const typeBadgeStyle = getCharacterTypeBadgeColor(character.type)

                        return (
                            <TouchableOpacity
                                key={character.id}
                                style={[styles.characterCard, { backgroundColor }]}
                                onPress={() => handleCharacterPress(character)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.typeBadge, { backgroundColor: typeBadgeStyle.backgroundColor }]}>
                                    <Text style={[styles.typeBadgeText, { color: typeBadgeStyle.color }]}>
                                        {(character.type?.charAt(0) || "U").toUpperCase()}
                                    </Text>
                                </View>

                                <Text style={[styles.characterText, { color: textColor }]}>{character.character}</Text>
                                <Text style={[styles.romajiText, { color: textColor }]}>{character.romaji}</Text>

                                {character.meaning && (
                                    <Text style={[styles.meaningText, { color: textColor }]} numberOfLines={1}>
                                        {character.meaning}
                                    </Text>
                                )}

                                {stats.totalAttempts > 0 && (
                                    <View style={styles.statsIndicator}>
                                        <Text style={[styles.accuracyText, { color: textColor }]}>{Math.round(stats.accuracy)}%</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <View style={styles.legend}>
                    <Text style={styles.legendTitle}>Progress Legend:</Text>
                    <View style={styles.legendItems}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: "#f3f4f6" }]} />
                            <Text style={styles.legendText}>Not practiced</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: "#fee2e2" }]} />
                            <Text style={styles.legendText}>Needs work</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: "#fef3c7" }]} />
                            <Text style={styles.legendText}>Good progress</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: "#dcfce7" }]} />
                            <Text style={styles.legendText}>Mastered</Text>
                        </View>
                    </View>

                    <Text style={[styles.legendTitle, { marginTop: 16 }]}>Character Types:</Text>
                    <View style={styles.legendItems}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: "#dbeafe" }]} />
                            <Text style={styles.legendText}>Hiragana (ひらがな)</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: "#fef3c7" }]} />
                            <Text style={styles.legendText}>Katakana (カタカナ)</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: "#fce7f3" }]} />
                            <Text style={styles.legendText}>Kanji (漢字)</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20, // Added top padding for consistent spacing from status bar
        backgroundColor: "#f8fafc",
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 24,
    },
    tabContainer: {
        marginBottom: 24,
    },
    tabScrollContent: {
        paddingHorizontal: 4,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: "#f3f4f6",
        alignItems: "center",
        minWidth: 80,
    },
    activeTab: {
        backgroundColor: "#6366f1",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6b7280",
    },
    activeTabText: {
        color: "#ffffff",
    },
    tabCount: {
        fontSize: 10,
        color: "#9ca3af",
        marginTop: 2,
    },
    activeTabCount: {
        color: "#e0e7ff",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12,
    },
    characterCard: {
        width: ITEM_SIZE,
        height: ITEM_SIZE + 20,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: "relative",
        paddingVertical: 8,
    },
    typeBadge: {
        position: "absolute",
        top: 4,
        left: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    typeBadgeText: {
        fontSize: 8,
        fontWeight: "bold",
    },
    characterText: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 2,
    },
    romajiText: {
        fontSize: 12,
        fontWeight: "500",
        marginBottom: 2,
    },
    meaningText: {
        fontSize: 8,
        fontWeight: "400",
        textAlign: "center",
        paddingHorizontal: 4,
    },
    statsIndicator: {
        position: "absolute",
        top: 4,
        right: 4,
    },
    accuracyText: {
        fontSize: 8,
        fontWeight: "600",
    },
    legend: {
        marginTop: 32,
        padding: 16,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 12,
    },
    legendItems: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    legendText: {
        fontSize: 12,
        color: "#6b7280",
    },
})
