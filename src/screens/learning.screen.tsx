"use client"

import { useState } from "react"
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import CharacterDetailModal from "../components/CharacterDetailsModal"
import { useProgress } from "../contexts/progress.context"
import { hiraganaCharacters, type HiraganaCharacter } from "../data/hiragana.data"

const { width } = Dimensions.get("window")
const ITEM_SIZE = (width - 60) / 4 // 4 columns with padding

export default function LearningScreen() {
    const [selectedCharacter, setSelectedCharacter] = useState<HiraganaCharacter | null>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const { characterStats } = useProgress()

    const handleCharacterPress = (character: HiraganaCharacter) => {
        setSelectedCharacter(character)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setSelectedCharacter(null)
    }

    const getCharacterStats = (characterId: string) => {
        return (
            characterStats?.[characterId] || {
                characterId,
                character: "",
                romaji: "",
                totalAttempts: 0,
                correctAnswers: 0,
                accuracy: 0,
                averageResponseTime: 0,
                lastAttempted: null,
            }
        )
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Learn Hiragana</Text>
                <Text style={styles.subtitle}>Tap any character to see details and practice pronunciation</Text>

                <View style={styles.grid}>
                    {hiraganaCharacters.map((character) => {
                        const stats = getCharacterStats(character.id)
                        const backgroundColor = getCharacterColor(stats.accuracy, stats.totalAttempts)
                        const textColor = getCharacterTextColor(stats.accuracy, stats.totalAttempts)

                        return (
                            <TouchableOpacity
                                key={character.id}
                                style={[styles.characterCard, { backgroundColor }]}
                                onPress={() => handleCharacterPress(character)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.characterText, { color: textColor }]}>{character.character}</Text>
                                <Text style={[styles.romajiText, { color: textColor }]}>{character.romaji}</Text>
                                {stats.totalAttempts > 0 && (
                                    <View style={styles.statsIndicator}>
                                        <Text style={[styles.accuracyText, { color: textColor }]}>{stats.accuracy}%</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <View style={styles.legend}>
                    <Text style={styles.legendTitle}>Color Legend:</Text>
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
                </View>
            </ScrollView>

            <CharacterDetailModal
                character={selectedCharacter}
                isVisible={modalVisible}
                onClose={closeModal}
                characterStat={selectedCharacter ? getCharacterStats(selectedCharacter.id) : undefined}
            />
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
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 24,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12,
    },
    characterCard: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: "relative",
    },
    characterText: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 4,
    },
    romajiText: {
        fontSize: 14,
        fontWeight: "500",
    },
    statsIndicator: {
        position: "absolute",
        top: 4,
        right: 4,
    },
    accuracyText: {
        fontSize: 10,
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
