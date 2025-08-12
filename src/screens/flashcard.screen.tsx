"use client"

import { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import StreakDisplay from "../components/StreakDisplay"
import { useProgress } from "../contexts/progress.context"
import { getRandomCharacters, hiraganaCharacters, type HiraganaCharacter } from "../data/hiragana.data"

type QuestionType = "character-to-romaji" | "romaji-to-character"

interface Question {
    id: string
    type: QuestionType
    character: HiraganaCharacter
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
    const { recordAnswer, recordSession } = useProgress()

    const generateQuestion = (): Question => {
        if (usedCharacters.size >= hiraganaCharacters.length) {
            setUsedCharacters(new Set())
        }

        const availableCharacters = hiraganaCharacters.filter((char) => !usedCharacters.has(char.id))

        const questionChar = availableCharacters[Math.floor(Math.random() * availableCharacters.length)]

        const questionTypes: QuestionType[] = ["character-to-romaji", "romaji-to-character"]
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]

        const incorrectOptions = getRandomCharacters(5, [questionChar.id])

        let options: string[]
        let correctAnswer: string
        let questionText: string
        let displayValue: string

        if (questionType === "character-to-romaji") {
            correctAnswer = questionChar.romaji
            options = [correctAnswer, ...incorrectOptions.map((char) => char.romaji)]
            questionText = "What is the romaji for this character?"
            displayValue = questionChar.character
        } else {
            correctAnswer = questionChar.character
            options = [correctAnswer, ...incorrectOptions.map((char) => char.character)]
            questionText = "Which character represents this romaji?"
            displayValue = questionChar.romaji
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

    const handleNextQuestion = () => {
        const newQuestion = generateQuestion()
        setCurrentQuestion(newQuestion)
        setSelectedAnswer(null)
        setShowResult(false)
        setQuestionStartTime(new Date())
    }

    const resetSession = async () => {
        if (sessionStats.questionsAnswered > 0) {
            const sessionDuration = Math.round((new Date().getTime() - sessionStats.startTime.getTime()) / (1000 * 60))
            const accuracy = Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100)

            await recordSession({
                questionsAnswered: sessionStats.questionsAnswered,
                correctAnswers: sessionStats.correctAnswers,
                accuracy,
                duration: Math.max(1, sessionDuration),
                streak: sessionStats.longestStreak,
            })
        }

        setSessionStats({
            questionsAnswered: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            currentStreak: 0,
            longestStreak: 0,
            startTime: new Date(),
        })
        setUsedCharacters(new Set())
        handleNextQuestion()
    }

    useEffect(() => {
        const initialQuestion = generateQuestion()
        setCurrentQuestion(initialQuestion)
        setQuestionStartTime(new Date())
    }, [])

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

    return (
        <SafeAreaView style={styles.container}>
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
                    {/* Added compact streak display */}
                    <StreakDisplay variant="compact" />
                </View>

                {sessionStats.questionsAnswered >= 10 && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetSession}>
                        <Text style={styles.resetButtonText}>New Session</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.questionContainer}>
                <View style={styles.questionTypeIndicator}>
                    <Text style={styles.questionTypeText}>
                        {currentQuestion.type === "character-to-romaji" ? "Character → Romaji" : "Romaji → Character"}
                    </Text>
                </View>
                <Text style={styles.instructionText}>{currentQuestion.questionText}</Text>
                <Text style={styles.displayText}>{currentQuestion.displayValue}</Text>
            </View>

            <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => {
                    const buttonStyle = [styles.optionButton]
                    const textStyle = [styles.optionText]

                    if (showResult && selectedAnswer === option) {
                        if (option === currentQuestion.correctAnswer) {
                            buttonStyle.push(styles.correctOption)
                            textStyle.push(styles.correctOptionText)
                        } else {
                            buttonStyle.push(styles.incorrectOption)
                            textStyle.push(styles.incorrectOptionText)
                        }
                    } else if (showResult && option === currentQuestion.correctAnswer) {
                        buttonStyle.push(styles.correctOption)
                        textStyle.push(styles.correctOptionText)
                    }

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
            </View>

            {showResult && (
                <View style={styles.resultContainer}>
                    <Text
                        style={[
                            styles.resultText,
                            selectedAnswer === currentQuestion.correctAnswer ? styles.correctResultText : styles.incorrectResultText,
                        ]}
                    >
                        {selectedAnswer === currentQuestion.correctAnswer ? "Correct! 🎉" : "Incorrect 😔"}
                    </Text>

                    <View style={styles.explanationContainer}>
                        <Text style={styles.explanationTitle}>Answer:</Text>
                        <Text style={styles.explanationText}>
                            {currentQuestion.character.character} = {currentQuestion.character.romaji}
                        </Text>
                        <Text style={styles.pronunciationText}>Pronunciation: {currentQuestion.character.pronunciation}</Text>
                    </View>

                    {sessionStats.currentStreak > 0 && (
                        <Text style={styles.streakText}>🔥 {sessionStats.currentStreak} in a row!</Text>
                    )}

                    <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                        <Text style={styles.nextButtonText}>
                            {sessionStats.questionsAnswered >= 20 ? "Continue Practice" : "Next Question"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
        color: "#6b7280",
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
        fontSize: 80,
        fontWeight: "bold",
        color: "#1f2937",
    },
    optionsContainer: {
        flex: 1,
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
    correctOptionText: {
        color: "#15803d",
    },
    incorrectOption: {
        backgroundColor: "#fef2f2",
        borderColor: "#dc2626",
    },
    incorrectOptionText: {
        color: "#dc2626",
    },
    resultContainer: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginTop: 20,
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
})
