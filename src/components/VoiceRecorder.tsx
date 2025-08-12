"use client"

import { Audio } from "expo-av"
import * as Speech from "expo-speech"
import { useRef, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface VoiceRecorderProps {
    expectedPronunciation: string
    romaji: string
    character: string
    onResult: (isCorrect: boolean, confidence: number) => void
    disabled?: boolean
}

export default function VoiceRecorder({
    expectedPronunciation,
    romaji,
    character,
    onResult,
    disabled = false,
}: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasRecorded, setHasRecorded] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const recordingRef = useRef<Audio.Recording | null>(null)

    const requestPermissions = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync()
            if (status !== "granted") {
                Alert.alert("Permission Required", "Please grant microphone permission to use voice recognition.")
                return false
            }
            return true
        } catch (error) {
            console.error("Error requesting permissions:", error)
            return false
        }
    }

    const startRecording = async () => {
        try {
            const hasPermission = await requestPermissions()
            if (!hasPermission) return

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            })

            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
            recordingRef.current = recording
            setIsRecording(true)
            setHasRecorded(false)
        } catch (error) {
            console.error("Failed to start recording:", error)
            Alert.alert("Recording Error", "Failed to start recording. Please try again.")
        }
    }

    const stopRecording = async () => {
        try {
            if (!recordingRef.current) return

            setIsRecording(false)
            await recordingRef.current.stopAndUnloadAsync()
            const uri = recordingRef.current.getURI()
            recordingRef.current = null
            setHasRecorded(true)

            if (uri) {
                await analyzePronunciation(uri)
            }
        } catch (error) {
            console.error("Failed to stop recording:", error)
            Alert.alert("Recording Error", "Failed to stop recording. Please try again.")
        }
    }

    const analyzePronunciation = async (audioUri: string) => {
        setIsAnalyzing(true)

        try {
            // Simulate pronunciation analysis
            // In a real app, you would send the audio to a speech recognition service
            // For now, we'll simulate with a random result based on some basic logic

            await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

            // Simple simulation: higher chance of success for shorter romaji
            const baseAccuracy = Math.random()
            const lengthBonus = Math.max(0, (5 - romaji.length) * 0.1)
            const confidence = Math.min(0.95, baseAccuracy + lengthBonus)
            const isCorrect = confidence > 0.6

            onResult(isCorrect, confidence)
        } catch (error) {
            console.error("Error analyzing pronunciation:", error)
            Alert.alert("Analysis Error", "Failed to analyze pronunciation. Please try again.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const playCorrectPronunciation = async () => {
        try {
            setIsPlaying(true)

            // Use text-to-speech to play the correct pronunciation
            await Speech.speak(expectedPronunciation, {
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

    if (disabled) {
        return (
            <View style={styles.disabledContainer}>
                <Text style={styles.disabledText}>Voice recognition not available for this question</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pronunciation Practice</Text>
                <Text style={styles.instruction}>
                    Say "{romaji}" ({expectedPronunciation}) for {character}
                </Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, styles.playButton]}
                    onPress={playCorrectPronunciation}
                    disabled={isPlaying || isRecording || isAnalyzing}
                >
                    <Text style={styles.buttonText}>{isPlaying ? "Playing..." : "🔊 Listen"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.recordButton, isRecording && styles.recordingButton]}
                    onPress={isRecording ? stopRecording : startRecording}
                    disabled={isPlaying || isAnalyzing}
                >
                    <Text style={[styles.buttonText, isRecording && styles.recordingText]}>
                        {isRecording ? "🔴 Stop" : "🎤 Record"}
                    </Text>
                </TouchableOpacity>
            </View>

            {isAnalyzing && (
                <View style={styles.analyzingContainer}>
                    <Text style={styles.analyzingText}>Analyzing your pronunciation...</Text>
                </View>
            )}

            {hasRecorded && !isAnalyzing && (
                <View style={styles.recordedContainer}>
                    <Text style={styles.recordedText}>Recording complete! Analyzing...</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 16,
        marginVertical: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    disabledContainer: {
        backgroundColor: "#f9fafb",
        padding: 16,
        borderRadius: 12,
        marginVertical: 16,
    },
    disabledText: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        fontStyle: "italic",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    instruction: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    playButton: {
        backgroundColor: "#3b82f6",
    },
    recordButton: {
        backgroundColor: "#10b981",
    },
    recordingButton: {
        backgroundColor: "#dc2626",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    recordingText: {
        color: "#ffffff",
    },
    analyzingContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#fef3c7",
        borderRadius: 8,
        alignItems: "center",
    },
    analyzingText: {
        fontSize: 14,
        color: "#92400e",
        fontWeight: "500",
    },
    recordedContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#dbeafe",
        borderRadius: 8,
        alignItems: "center",
    },
    recordedText: {
        fontSize: 14,
        color: "#1e40af",
        fontWeight: "500",
    },
})
