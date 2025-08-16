import { StyleSheet, Text, View } from "react-native"
import { useProgress } from "../contexts/progress.context"

interface StreakDisplayProps {
    variant?: "compact" | "full"
}

export default function StreakDisplay({ variant = "full" }: StreakDisplayProps) {
    const { overallProgress, getStreakMessage, getNextMilestone, hasStudiedToday } = useProgress()

    const currentStreak = overallProgress?.dailyStreak?.currentStreak || 0
    const longestStreak = overallProgress?.dailyStreak?.longestStreak || 0
    const nextMilestone = getNextMilestone?.() || 0
    const streakMessage = getStreakMessage?.() || "Start your learning journey!"
    const studyDates = overallProgress?.dailyStreak?.studyDates || []
    const streakMilestones = overallProgress?.dailyStreak?.streakMilestones || []

    if (variant === "compact") {
        return (
            <View style={styles.compactContainer}>
                <Text style={styles.compactStreakNumber}>{currentStreak}</Text>
                <Text style={styles.compactStreakLabel}>Day Streak</Text>
                {!hasStudiedToday && currentStreak > 0 && <View style={styles.warningDot} />}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Daily Streak</Text>
                {!hasStudiedToday && currentStreak > 0 && (
                    <View style={styles.warningBadge}>
                        <Text style={styles.warningText}>Study today to keep your streak!</Text>
                    </View>
                )}
            </View>

            <View style={styles.streakDisplay}>
                <View style={styles.currentStreakContainer}>
                    <Text style={styles.streakNumber}>{currentStreak}⚡</Text>
                    <Text style={styles.streakLabel}>Current Streak</Text>
                    <Text style={styles.streakMessage}>{streakMessage}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{longestStreak}</Text>
                        <Text style={styles.statLabel}>Best Streak</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{studyDates.length}</Text>
                        <Text style={styles.statLabel}>Total Days</Text>
                    </View>
                </View>

                {nextMilestone > 0 && (
                    <View style={styles.milestoneContainer}>
                        <Text style={styles.milestoneText}>
                            Next milestone: {nextMilestone} days ({Math.max(0, nextMilestone - currentStreak)} to go!)
                        </Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${Math.min((currentStreak / nextMilestone) * 100, 100)}%`,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                )}

                {streakMilestones.length > 0 && (
                    <View style={styles.achievementsContainer}>
                        <Text style={styles.achievementsTitle}>Achievements Unlocked:</Text>
                        <View style={styles.achievementsList}>
                            {streakMilestones
                                .sort((a, b) => b - a)
                                .slice(0, 3)
                                .map((milestone) => (
                                    <View key={milestone} style={styles.achievementBadge}>
                                        <Text style={styles.achievementText}>{milestone} days</Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    compactContainer: {
        alignItems: "center",
        position: "relative",
    },
    compactStreakNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#f59e0b",
    },
    compactStreakLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
    warningDot: {
        position: "absolute",
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#dc2626",
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    warningBadge: {
        backgroundColor: "#fef3c7",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    warningText: {
        fontSize: 12,
        color: "#92400e",
        fontWeight: "500",
    },
    streakDisplay: {
        alignItems: "center",
    },
    currentStreakContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    streakNumber: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#f59e0b",
    },
    streakLabel: {
        fontSize: 16,
        color: "#6b7280",
        marginTop: 4,
    },
    streakMessage: {
        fontSize: 14,
        color: "#374151",
        marginTop: 8,
        textAlign: "center",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20,
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
    milestoneContainer: {
        width: "100%",
        marginBottom: 16,
    },
    milestoneText: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: "#e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#f59e0b",
        borderRadius: 3,
    },
    achievementsContainer: {
        width: "100%",
        alignItems: "center",
    },
    achievementsTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },
    achievementsList: {
        flexDirection: "row",
        gap: 8,
    },
    achievementBadge: {
        backgroundColor: "#dbeafe",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    achievementText: {
        fontSize: 12,
        color: "#1e40af",
        fontWeight: "500",
    },
})
