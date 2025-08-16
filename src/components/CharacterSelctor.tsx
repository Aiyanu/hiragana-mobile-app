import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { CharacterType } from "../types"

interface CharacterSetSelectorProps {
    selectedTypes: CharacterType[]
    onSelectionChange: (types: CharacterType[]) => void
    style?: any
}

const CHARACTER_TYPE_LABELS = {
    hiragana: "ひらがな",
    katakana: "カタカナ",
    kanji: "漢字",
}

const CHARACTER_TYPE_DESCRIPTIONS = {
    hiragana: "Basic Japanese phonetic script",
    katakana: "Script for foreign words",
    kanji: "Chinese characters with meaning",
}

export default function CharacterSetSelector({ selectedTypes, onSelectionChange, style }: CharacterSetSelectorProps) {
    const toggleCharacterType = (type: CharacterType) => {
        if (selectedTypes.includes(type)) {
            // Don't allow deselecting if it's the only one selected
            if (selectedTypes.length === 1) return
            onSelectionChange(selectedTypes.filter((t) => t !== type))
        } else {
            onSelectionChange([...selectedTypes, type])
        }
    }

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.title}>Character Sets</Text>
            <Text style={styles.subtitle}>Select which characters to practice</Text>

            <View style={styles.optionsContainer}>
                {(Object.keys(CHARACTER_TYPE_LABELS) as CharacterType[]).map((type) => {
                    const isSelected = selectedTypes.includes(type)

                    return (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.option,
                                isSelected && styles.selectedOption,
                                selectedTypes.length === 1 && isSelected && styles.disabledOption,
                            ]}
                            onPress={() => toggleCharacterType(type)}
                            disabled={selectedTypes.length === 1 && isSelected}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionHeader}>
                                    <Text style={styles.characterLabel}>{CHARACTER_TYPE_LABELS[type]}</Text>
                                    <Text style={[styles.typeLabel, isSelected && styles.selectedTypeLabel]}>{type.toUpperCase()}</Text>
                                </View>
                                <Text style={[styles.description, isSelected && styles.selectedDescription]}>
                                    {CHARACTER_TYPE_DESCRIPTIONS[type]}
                                </Text>
                            </View>

                            <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
                                {isSelected && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>

            <Text style={styles.selectionInfo}>
                {selectedTypes.length} character set{selectedTypes.length !== 1 ? "s" : ""} selected
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 16,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
    },
    selectedOption: {
        borderColor: "#6366f1",
        backgroundColor: "#eef2ff",
    },
    disabledOption: {
        opacity: 0.6,
    },
    optionContent: {
        flex: 1,
    },
    optionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    characterLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        marginRight: 8,
    },
    typeLabel: {
        fontSize: 10,
        fontWeight: "600",
        color: "#6b7280",
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    selectedTypeLabel: {
        color: "#6366f1",
        backgroundColor: "#ddd6fe",
    },
    description: {
        fontSize: 12,
        color: "#9ca3af",
    },
    selectedDescription: {
        color: "#6366f1",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#d1d5db",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
    checkedCheckbox: {
        backgroundColor: "#6366f1",
        borderColor: "#6366f1",
    },
    checkmark: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
    },
    selectionInfo: {
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
        marginTop: 16,
        fontStyle: "italic",
    },
})
