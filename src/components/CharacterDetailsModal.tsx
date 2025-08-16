"use client"

import * as Speech from "expo-speech"
import { useEffect, useState } from "react"
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import {
    GestureHandlerRootView,
    PanGestureHandler,
    type PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler"
import type { Character } from "../data/hiragana.data"
import type { CharacterStat, CharacterType } from "../types"
import VoiceRecorder from "./VoiceRecorder"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7

interface CharacterDetailModalProps {
    character: Character | null
    isVisible: boolean
    onClose: () => void
    characterStat?: CharacterStat
}

export default function CharacterDetailModal({
    character,
    isVisible,
    onClose,
    characterStat,
}: CharacterDetailModalProps) {
    const [translateY] = useState(new Animated.Value(MODAL_HEIGHT))
    const [isPlaying, setIsPlaying] = useState(false)
    const [voiceRecorderRef, setVoiceRecorderRef] = useState<any>(null)

    useEffect(() => {
        if (isVisible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start()
        } else {
            Animated.timing(translateY, {
                toValue: MODAL_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start()
        }
    }, [isVisible])

    const handleClose = () => {
        Animated.timing(translateY, {
            toValue: MODAL_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose()
        })
    }

    const handleGesture = (event: PanGestureHandlerGestureEvent) => {
        const { translationY, velocityY } = event.nativeEvent

        if (translationY > 0) {
            translateY.setValue(translationY)
        }

        if (event.nativeEvent.state === 5) {
            // Gesture ended
            if (translationY > 100 || velocityY > 500) {
                handleClose()
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start()
            }
        }
    }

    const playPronunciation = async () => {
        if (!character) return

        try {
            setIsPlaying(true)
            await Speech.speak(character.pronunciation, {
                language: "ja-JP",
                pitch: 1.0,
                rate: 0.8,
                onDone: () => setIsPlaying(false),
                onError: () => setIsPlaying(false),
            })
        } catch (error) {
            console.error("Error playing pronunciation:", error)
            setIsPlaying(false)
        }
    }

    const handleVoiceResult = (isCorrect: boolean, confidence: number) => {
        // Handle voice recognition result
        console.log("Voice result:", { isCorrect, confidence })
    }

    const startVoiceRecording = () => {
        if (voiceRecorderRef) {
            voiceRecorderRef.startRecording()
        }
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

    if (!character) return null

    const typeStyle = getCharacterTypeStyle(character.type)

    return (
        <Modal visible={isVisible} transparent animationType="none" onRequestClose={handleClose}>
            <GestureHandlerRootView style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />

                <PanGestureHandler onGestureEvent={handleGesture}>
                    <Animated.View style={[styles.modal, { transform: [{ translateY }] }]}>
                        <View style={styles.handle} />

                        <ScrollView
                            style={styles.content}
                            contentContainerStyle={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.header}>
                                <View style={[styles.typeBadge, { backgroundColor: typeStyle.backgroundColor }]}>
                                    <Text style={[styles.typeBadgeText, { color: typeStyle.color }]}>{typeStyle.label}</Text>
                                </View>

                                <Text style={styles.characterDisplay}>{character.character}</Text>
                                <View style={styles.pronunciationInfo}>
                                    <Text style={styles.romaji}>{character.romaji}</Text>
                                    <Text style={styles.pronunciation}>/{character.pronunciation}/</Text>
                                    {character.meaning && <Text style={styles.meaning}>"{character.meaning}"</Text>}
                                </View>
                            </View>

                            <View style={styles.audioControls}>
                                <TouchableOpacity
                                    style={[styles.audioButton, styles.speakerButton]}
                                    onPress={playPronunciation}
                                    disabled={isPlaying}
                                >
                                    <Text style={styles.audioButtonText}>{isPlaying ? "Playing..." : "🔊 Listen"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.audioButton, styles.micButton]} onPress={startVoiceRecording}>
                                    <Text style={styles.audioButtonText}>🎤 Practice</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.voiceRecorderContainer}>
                                <VoiceRecorder
                                    ref={setVoiceRecorderRef}
                                    expectedPronunciation={character.pronunciation}
                                    romaji={character.romaji}
                                    character={character.character}
                                    onResult={handleVoiceResult}
                                />
                            </View>

                            <View style={styles.statsSection}>
                                <Text style={styles.sectionTitle}>Your Progress</Text>

                                {characterStat && characterStat.totalAttempts > 0 ? (
                                    <View style={styles.statsGrid}>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statNumber}>{Math.round(characterStat.accuracy || 0)}%</Text>
                                            <Text style={styles.statLabel}>Accuracy</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statNumber}>{characterStat.correctAnswers || 0}</Text>
                                            <Text style={styles.statLabel}>Correct</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statNumber}>{characterStat.totalAttempts || 0}</Text>
                                            <Text style={styles.statLabel}>Total</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statNumber}>
                                                {Math.round(
                                                    ((characterStat.responseTimes?.reduce((a, b) => a + b, 0) || 0) /
                                                        (characterStat.responseTimes?.length || 1)) *
                                                    100,
                                                ) / 100}
                                                s
                                            </Text>
                                            <Text style={styles.statLabel}>Avg Time</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.noStatsContainer}>
                                        <Text style={styles.noStatsText}>No practice data yet</Text>
                                        <Text style={styles.noStatsSubtext}>
                                            Practice this character in flashcards to see your progress here
                                        </Text>
                                    </View>
                                )}

                                {characterStat?.responseTimes && characterStat.responseTimes.length > 0 && (
                                    <Text style={styles.lastAttemptedText}>Last practiced: Recently</Text>
                                )}
                            </View>

                            <View style={styles.infoSection}>
                                <Text style={styles.sectionTitle}>Character Info</Text>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>Type:</Text>
                                    <Text style={styles.infoValue}>{typeStyle.label}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>Character:</Text>
                                    <Text style={styles.infoValue}>{character.character}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>Romaji:</Text>
                                    <Text style={styles.infoValue}>{character.romaji}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Text style={styles.infoLabel}>Pronunciation:</Text>
                                    <Text style={styles.infoValue}>/{character.pronunciation}/</Text>
                                </View>
                                {character.meaning && (
                                    <View style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>Meaning:</Text>
                                        <Text style={styles.infoValue}>"{character.meaning}"</Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </Animated.View>
                </PanGestureHandler>
            </GestureHandlerRootView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: MODAL_HEIGHT,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: "#d1d5db",
        borderRadius: 2,
        alignSelf: "center",
        marginTop: 12,
        marginBottom: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    contentContainer: {
        paddingBottom: 40, // Extra padding at bottom to prevent cutoff
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    characterDisplay: {
        fontSize: 80,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 8,
    },
    pronunciationInfo: {
        alignItems: "center",
    },
    romaji: {
        fontSize: 24,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 4,
    },
    pronunciation: {
        fontSize: 18,
        color: "#6b7280",
        fontStyle: "italic",
    },
    meaning: {
        fontSize: 16,
        color: "#059669",
        fontWeight: "500",
        marginTop: 4,
        fontStyle: "italic",
    },
    audioControls: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 24,
    },
    audioButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    speakerButton: {
        backgroundColor: "#3b82f6",
    },
    micButton: {
        backgroundColor: "#10b981",
    },
    audioButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    statsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#f9fafb",
        padding: 16,
        borderRadius: 12,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
    },
    statLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
    noStatsContainer: {
        backgroundColor: "#f9fafb",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    noStatsText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#6b7280",
        marginBottom: 4,
    },
    noStatsSubtext: {
        fontSize: 14,
        color: "#9ca3af",
        textAlign: "center",
    },
    lastAttemptedText: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 12,
        fontStyle: "italic",
    },
    infoSection: {
        marginBottom: 24,
    },
    infoItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    infoLabel: {
        fontSize: 16,
        color: "#6b7280",
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#374151",
    },
    voiceRecorderContainer: {
        marginBottom: 16,
    },
})
