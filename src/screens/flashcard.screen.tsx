"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import StreakDisplay from "../components/StreakDisplay"
import VoiceRecorder from "../components/VoiceRecorder"
import { useProgress } from "../contexts/progress.context"
import { allCharacters, getRandomCharacters, type Character } from "../data/hiragana.data"
import DrawerContainer from "../layouts/drawer.container"
import type { CharacterType, QuestionType } from "../types"

type Question = {
    id: string
    type: QuestionType
    character: Character
    options: string[]
    correctAnswer: string
    questionText: string
    displayValue: string
}

interface SessionStats {
    questionsAnswered: number
    correctAnswers: number
    incorrectAnswers: number
    currentStreak: number
    longestStreak: number
    startTime: Date
}

export default function FlashcardScreen() {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [questionsPerSession, setQuestionsPerSession] = useState(5)
    const [selectedCharacterTypes, setSelectedCharacterTypes] = useState<CharacterType[]>(["hiragana"])
    const [sessionStats, setSessionStats] = useState<SessionStats>({
        questionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        currentStreak: 0,
        longestStreak: 0,
        startTime: new Date(),
    })
    const [usedCharacters, setUsedCharacters] = useState<Set<string>>(new Set())
    const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date())
    const [voiceResult, setVoiceResult] = useState<{ isCorrect: boolean; confidence: number } | null>(null)
    const [pronunciationAttempts, setPronunciationAttempts] = useState(0)
    const [pronunciationTimeout, setPronunciationTimeout] = useState<NodeJS.Timeout | null>(null)
    const { recordAnswer, recordSession } = useProgress()

    const resetSession = async () => {
        if (sessionStats.questionsAnswered > 0) {
            await recordSession({
                questionsAnswered: sessionStats.questionsAnswered,
                correctAnswers: sessionStats.correctAnswers,
                accuracy:
                    sessionStats.questionsAnswered > 0
                        ? Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100)
                        : 0,
                streak: sessionStats.longestStreak,
                duration: Math.round((new Date().getTime() - sessionStats.startTime.getTime()) / 1000 / 60), // in minutes
            })
        }

        setSessionStats({
            questionsAnswered: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            currentStreak: 0,
            longestStreak: sessionStats.longestStreak,
            startTime: new Date(),
        })
        setUsedCharacters(new Set())
        const newQuestion = generateQuestion()
        setCurrentQuestion(newQuestion)
        setSelectedAnswer(null)
        setShowResult(false)
        setVoiceResult(null)
        setQuestionStartTime(new Date())
    }

    useEffect(() => {
        const initialQuestion = generateQuestion()
        setCurrentQuestion(initialQuestion)
        setQuestionStartTime(new Date())
        loadQuestionsPerSession()
        loadSelectedCharacterTypes()
    }, [])

    useEffect(() => {
        if (selectedCharacterTypes.length > 0) {
            const newQuestion = generateQuestion()
            setCurrentQuestion(newQuestion)
            setUsedCharacters(new Set())
            setQuestionStartTime(new Date())
        }
    }, [selectedCharacterTypes])

    const loadQuestionsPerSession = async () => {
        try {
            const saved = await AsyncStorage.getItem("questionsPerSession")
            if (saved) {
                setQuestionsPerSession(Number.parseInt(saved))
            }
        } catch (error) {
            console.log("Error loading questions per session:", error)
        }
    }

    const loadSelectedCharacterTypes = async () => {
        try {
            const saved = await AsyncStorage.getItem("selectedCharacterTypes")
            if (saved) {
                setSelectedCharacterTypes(JSON.parse(saved))
            }
        } catch (error) {
            console.log("Error loading selected character types:", error)
        }
    }

    const generateQuestion = (): Question => {
        const availableCharacters = allCharacters.filter(
            (char) => selectedCharacterTypes.includes(char.type) && !usedCharacters.has(char.id),
        )

        if (availableCharacters.length === 0) {
            setUsedCharacters(new Set())
            const resetAvailableCharacters = allCharacters.filter((char) => selectedCharacterTypes.includes(char.type))
            if (resetAvailableCharacters.length === 0) {
                const fallbackChar = allCharacters.find((char) => char.type === "hiragana")!
                return createQuestionFromCharacter(fallbackChar)
            }
            const questionChar = resetAvailableCharacters[Math.floor(Math.random() * resetAvailableCharacters.length)]
            return createQuestionFromCharacter(questionChar)
        }

        const questionChar = availableCharacters[Math.floor(Math.random() * availableCharacters.length)]
        return createQuestionFromCharacter(questionChar)
    }

    const createQuestionFromCharacter = (questionChar: Character): Question => {
        const weights = [0.4, 0.4, 0.2]
        const random = Math.random()
        let questionType: QuestionType

        if (random < weights[0]) {
            questionType = "character-to-romaji"
        } else if (random < weights[0] + weights[1]) {
            questionType = "romaji-to-character"
        } else {
            questionType = "pronunciation"
        }

        const incorrectOptions = getRandomCharacters(3, [questionChar.id], selectedCharacterTypes)

        let options: string[]
        let correctAnswer: string
        let questionText: string
        let displayValue: string

        if (questionType === "character-to-romaji") {
            correctAnswer = questionChar.romaji
            options = [correctAnswer, ...incorrectOptions.map((char) => char.romaji)]
            questionText = "What is the romaji for this character?"
            displayValue = questionChar.character
        } else if (questionType === "romaji-to-character") {
            correctAnswer = questionChar.character
            options = [correctAnswer, ...incorrectOptions.map((char) => char.character)]
            questionText = "Which character represents this romaji?"
            displayValue = questionChar.romaji
        } else {
            correctAnswer = questionChar.pronunciation
            options = []
            questionText = "How do you pronounce this character?"
            displayValue = questionChar.character
        }

        const shuffledOptions = options.sort(() => Math.random() - 0.5)

        setUsedCharacters((prev) => new Set([...prev, questionChar.id]))

        return {
            id: `${questionChar.id}-${questionType}-${Date.now()}`,
            type: questionType,
            character: questionChar,
            options: shuffledOptions,
            correctAnswer,
            questionText,
            displayValue,
        }
    }

    const handleAnswerSelect = async (answer: string) => {
        if (showResult) return

        setSelectedAnswer(answer)
        setShowResult(true)

        const isCorrect = answer === currentQuestion?.correctAnswer
        const responseTime = Math.round((new Date().getTime() - questionStartTime.getTime()) / 1000)

        if (currentQuestion) {
            await recordAnswer(currentQuestion.character, isCorrect, responseTime)
        }

        setSessionStats((prev) => {
            const newStreak = isCorrect ? prev.currentStreak + 1 : 0
            return {
                ...prev,
                questionsAnswered: prev.questionsAnswered + 1,
                correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
                incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
                currentStreak: newStreak,
                longestStreak: Math.max(prev.longestStreak, newStreak),
            }
        })
    }

    const handleSkip = () => {
        if (showResult) return

        setSelectedAnswer(null)
        setShowResult(true)
    }

    const handleNextQuestion = () => {
        setPronunciationAttempts(0)
        if (pronunciationTimeout) {
            clearTimeout(pronunciationTimeout)
            setPronunciationTimeout(null)
        }

        const newQuestion = generateQuestion()
        setCurrentQuestion(newQuestion)
        setSelectedAnswer(null)
        setShowResult(false)
        setVoiceResult(null)
        setQuestionStartTime(new Date())
    }

    const handleVoiceResult = async (isCorrect: boolean, confidence: number) => {
        if (pronunciationTimeout) {
            clearTimeout(pronunciationTimeout)
            setPronunciationTimeout(null)
        }

        setVoiceResult({ isCorrect, confidence })

        const newAttempts = pronunciationAttempts + 1
        setPronunciationAttempts(newAttempts)

        if (isCorrect || newAttempts >= 3) {
            const responseTime = Math.round((new Date().getTime() - questionStartTime.getTime()) / 1000)

            if (currentQuestion) {
                await recordAnswer(currentQuestion.character, isCorrect, responseTime)
            }

            setSessionStats((prev) => {
                const finalIsCorrect = isCorrect // Only correct if actually correct, not just after 3 attempts
                const newStreak = finalIsCorrect ? prev.currentStreak + 1 : 0
                return {
                    ...prev,
                    questionsAnswered: prev.questionsAnswered + 1,
                    correctAnswers: prev.correctAnswers + (finalIsCorrect ? 1 : 0),
                    incorrectAnswers: prev.incorrectAnswers + (finalIsCorrect ? 0 : 1),
                    currentStreak: newStreak,
                    longestStreak: Math.max(prev.longestStreak, newStreak),
                }
            })

            setShowResult(true)
        }
    }

    useEffect(() => {
        if (currentQuestion?.type === "pronunciation" && !showResult) {
            const timeout = setTimeout(() => {
                console.log("[v0] Pronunciation question timed out after 30 seconds")
                handleSkip()
            }, 30000) // 30 seconds

            setPronunciationTimeout(timeout)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [currentQuestion, showResult])

    if (!currentQuestion) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </SafeAreaView>
        )
    }

    const accuracy =
        sessionStats.questionsAnswered > 0
            ? Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100)
            : 0


    const isPronunciation = currentQuestion.type === "pronunciation"
    const pronunciationCorrect = voiceResult?.isCorrect === true
    let resultLabel = ""
    let resultStyle = styles.incorrectResultText

    if (isPronunciation) {
        if (pronunciationCorrect) {
            resultLabel = "Correct!"
            resultStyle = styles.correctResultText
        } else if (sessionStats.currentStreak >= 0 && pronunciationAttempts >= 3 && showResult) {
            // user exhausted attempts and showResult is triggered
            resultLabel = "Failed after 3 attempts"
            resultStyle = styles.incorrectResultText
        } else if (showResult && !pronunciationCorrect && pronunciationAttempts === 0) {
            // edge: showResult triggered by timeout/skip
            resultLabel = "Skipped - Here's the answer:"
            resultStyle = styles.incorrectResultText
        } else {
            // fallback when drawer isn't showing yet — keep it blank (won't be used)
            resultLabel = ""
            resultStyle = styles.incorrectResultText
        }
    } else {
        // non-pronunciation questions rely on selectedAnswer
        if (selectedAnswer === null) {
            resultLabel = "Skipped - Here's the answer:"
            resultStyle = styles.incorrectResultText
        } else if (selectedAnswer === currentQuestion.correctAnswer) {
            resultLabel = "Correct!"
            resultStyle = styles.correctResultText
        } else {
            resultLabel = "Incorrect"
            resultStyle = styles.incorrectResultText
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{sessionStats.correctAnswers}</Text>
                            <Text style={styles.statLabel}>Correct</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{accuracy}%</Text>
                            <Text style={styles.statLabel}>Accuracy</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{sessionStats.currentStreak}</Text>
                            <Text style={styles.statLabel}>Session</Text>
                        </View>
                        <StreakDisplay variant="compact" />
                    </View>

                    <View style={styles.characterTypesDisplay}>
                        <Text style={styles.characterTypesLabel}>Practicing:</Text>
                        <Text style={styles.characterTypesText}>{selectedCharacterTypes.join(" + ").toUpperCase()}</Text>
                    </View>

                    {sessionStats.questionsAnswered >= questionsPerSession && (
                        <TouchableOpacity style={styles.resetButton} onPress={resetSession}>
                            <Text style={styles.resetButtonText}>New Session</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.questionContainer}>
                    <View style={styles.questionTypeIndicator}>
                        <Text style={styles.questionTypeText}>
                            {currentQuestion.type === "character-to-romaji" && "Character → Romaji"}
                            {currentQuestion.type === "romaji-to-character" && "Romaji → Character"}
                            {currentQuestion.type === "pronunciation" && "Pronunciation Practice"}
                        </Text>
                    </View>
                    <Text style={styles.instructionText}>{currentQuestion.questionText}</Text>
                    <Text style={styles.displayText}>{currentQuestion.displayValue}</Text>
                    <Text style={styles.characterTypeIndicator}>{currentQuestion.character.type.toUpperCase()}</Text>
                </View>

                {currentQuestion.type === "pronunciation" && (
                    <VoiceRecorder
                        expectedPronunciation={currentQuestion.character.pronunciation}
                        romaji={currentQuestion.character.romaji}
                        character={currentQuestion.character.character}
                        onResult={handleVoiceResult}
                        disabled={showResult || pronunciationAttempts >= 3}
                    />
                )}

                {currentQuestion.type !== "pronunciation" && (
                    <View style={styles.optionsContainer}>
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = showResult && selectedAnswer === option
                            const isCorrect = option === currentQuestion.correctAnswer
                            const shouldShowAsCorrect = showResult && isCorrect
                            const shouldShowAsIncorrect = isSelected && !isCorrect

                            const buttonStyle = [
                                styles.optionButton,
                                shouldShowAsCorrect && styles.correctOption,
                                shouldShowAsIncorrect && styles.incorrectOption,
                            ].filter(Boolean)

                            const textStyle = [
                                styles.optionText,
                                shouldShowAsCorrect && { color: "#15803d" },
                                shouldShowAsIncorrect && { color: "#dc2626" },
                            ].filter(Boolean)

                            return (
                                <TouchableOpacity
                                    key={`${currentQuestion.id}-${index}`}
                                    style={buttonStyle}
                                    onPress={() => handleAnswerSelect(option)}
                                    disabled={showResult}
                                >
                                    <Text style={textStyle}>{option}</Text>
                                </TouchableOpacity>
                            )
                        })}

                        {!showResult && (
                            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                                <Text style={styles.skipButtonText}>Skip Question</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {currentQuestion.type === "pronunciation" && !showResult && (
                    <View style={styles.pronunciationControls}>
                        <Text style={styles.attemptText}>Attempt {pronunciationAttempts + 1} of 3</Text>
                        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                            <Text style={styles.skipButtonText}>Skip Question</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <DrawerContainer show={showResult} onClose={handleNextQuestion}>
                {/* Use computed label and style so pronunciation correctness is honoured */}
                <Text style={[styles.resultText, resultStyle]}>
                    {resultLabel}
                </Text>

                <View style={styles.explanationContainer}>
                    <Text style={styles.explanationTitle}>Answer:</Text>
                    <Text style={styles.explanationText}>
                        {currentQuestion?.character.character} = {currentQuestion?.character.romaji}
                    </Text>
                    <Text style={styles.pronunciationText}>Pronunciation: {currentQuestion?.character.pronunciation}</Text>
                    {currentQuestion?.character.meaning && (
                        <Text style={styles.meaningText}>Meaning: {currentQuestion.character.meaning}</Text>
                    )}

                    {voiceResult && (
                        <Text style={styles.confidenceText}>Confidence: {Math.round(voiceResult.confidence * 100)}%</Text>
                    )}
                </View>

                {sessionStats.correctAnswers > 0 && (
                    <Text style={styles.streakText}>{sessionStats.correctAnswers} correct answers!</Text>
                )}

                <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                    <Text style={styles.nextButtonText}>
                        {sessionStats.questionsAnswered >= questionsPerSession ? "Continue Practice" : "Next Question"}
                    </Text>
                </TouchableOpacity>
            </DrawerContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        paddingTop: 20
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 40,
    },
    header: {
        marginBottom: 30,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
    },
    statLabel: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 4,
    },
    characterTypesDisplay: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    characterTypesLabel: {
        fontSize: 10,
        fontWeight: "500",
        color: "#9ca3af",
        textAlign: "center",
        marginBottom: 2,
    },
    characterTypesText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6b7280",
        textAlign: "center",
    },
    resetButton: {
        backgroundColor: "#6366f1",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        alignSelf: "center",
        marginTop: 16,
    },
    resetButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
    },
    questionContainer: {
        alignItems: "center",
        marginBottom: 40,
        backgroundColor: "#ffffff",
        padding: 30,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionTypeIndicator: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    questionTypeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    instructionText: {
        fontSize: 16,
        color: "#6b7280",
        marginBottom: 20,
        textAlign: "center",
    },
    displayText: {
        fontSize: 50,
        fontWeight: "bold",
        color: "#1f2937",
    },
    characterTypeIndicator: {
        fontSize: 10,
        fontWeight: "600",
        color: "#6366f1",
        backgroundColor: "#eef2ff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        letterSpacing: 0.5,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: "#ffffff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    optionText: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
        color: "#374151",
    },
    correctOption: {
        backgroundColor: "#dcfce7",
        borderColor: "#16a34a",
    },
    incorrectOption: {
        backgroundColor: "#fef2f2",
        borderColor: "#dc2626",
    },
    resultText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    correctResultText: {
        color: "#16a34a",
    },
    incorrectResultText: {
        color: "#dc2626",
    },
    explanationContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    explanationTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    explanationText: {
        fontSize: 18,
        color: "#1f2937",
        marginBottom: 4,
    },
    pronunciationText: {
        fontSize: 14,
        color: "#6b7280",
        fontStyle: "italic",
    },
    meaningText: {
        fontSize: 14,
        color: "#059669",
        fontWeight: "500",
        marginTop: 4,
    },
    confidenceText: {
        fontSize: 12,
        color: "#6366f1",
        marginTop: 4,
        fontWeight: "500",
    },
    streakText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#f59e0b",
        marginBottom: 16,
    },
    nextButton: {
        backgroundColor: "#6366f1",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    nextButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    skipButton: {
        backgroundColor: "#f3f4f6",
        padding: 12,
        marginTop: 16,
        marginBottom: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    skipButtonText: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        color: "#6b7280",
    },
    loadingText: {
        fontSize: 18,
        textAlign: "center",
        color: "#6b7280",
        marginTop: 50,
    },
    pronunciationControls: {
        alignItems: "center",
        marginTop: 20,
    },
    attemptText: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 12,
        fontWeight: "500",
    },
})
