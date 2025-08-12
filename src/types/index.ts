import type * as Notifications from "expo-notifications";

export interface HiraganaCharacter {
  id: string;
  character: string;
  romaji: string;
  pronunciation: string;
  meaning?: string;
  category: "basic" | "dakuten" | "handakuten" | "combination";
}

export interface CharacterStat {
  characterId: string;
  character: string;
  romaji: string;
  correctAnswers: number;
  totalAttempts: number;
  responseTimes: number[];
  accuracy: number;
}

export interface CharacterStats {
  [characterId: string]: CharacterStat;
}

export interface DailyStreak {
  studyDates: string[];
  lastStudyDate: string | null;
  currentStreak: number;
  longestStreak: number;
  streakMilestones: number[];
}

export interface OverallProgress {
  dailyStreak: DailyStreak;
  totalQuestions: number;
  correctAnswers: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  charactersLearned: number;
  totalStudyTime: number;
  lastStudyDate: string | null;
}

export interface SessionHistory {
  id: string;
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  duration: number;
  charactersStudied: string[];
  streak: number;
}

export interface SessionStats {
  questionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentStreak: number;
  longestStreak: number;
  startTime: Date;
}

export interface NotificationSettings {
  dailyReminders: boolean;
  streakNotifications: boolean;
  motivationalMessages: boolean;
  reminderTime: { hour: number; minute: number };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface VoiceRecorderProps {
  expectedPronunciation: string;
  romaji: string;
  character: string;
  onResult: (isCorrect: boolean, confidence: number) => void;
  disabled?: boolean;
}

export interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  nextMilestone: number;
  streakMessage: string;
}

export interface ProgressContextType {
  overallProgress: OverallProgress;
  setOverallProgress: (progress: OverallProgress) => void;
  characterStats: CharacterStats;
  setCharacterStats: (stats: CharacterStats) => void;
  hasStudiedToday: boolean;
  setHasStudiedToday: (studied: boolean) => void;
  recordAnswer: (
    character: HiraganaCharacter,
    isCorrect: boolean,
    responseTime?: number
  ) => Promise<void>;
  recordSession: (
    session: Omit<SessionHistory, "id" | "date" | "charactersStudied">
  ) => Promise<void>;
  getNextMilestone: () => number;
  getStreakMessage: () => string;
  getProblematicCharacters: () => CharacterStat[];
  getTopPerformingCharacters: () => CharacterStat[];
  sessionHistory: SessionHistory[];
  resetProgress: () => Promise<void>;
  isLoading: boolean;
}

export interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  hasPermissions: boolean;
  scheduleNotifications: () => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  getScheduledNotifications: () => Promise<Notifications.NotificationRequest[]>;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export type QuestionType =
  | "character-to-romaji"
  | "romaji-to-character"
  | "pronunciation";

export interface Question {
  id: string;
  type: QuestionType;
  character: HiraganaCharacter;
  options: string[];
  correctAnswer: string;
  questionText: string;
  displayValue: string;
}

export type CharacterMasteryLevel =
  | "not-started"
  | "learning"
  | "practiced"
  | "mastered";

export interface CharacterDetailModalProps {
  character: HiraganaCharacter | null;
  isVisible: boolean;
  onClose: () => void;
  characterStat?: CharacterStat;
}

export interface CharacterGridItemProps {
  character: HiraganaCharacter;
  masteryLevel: CharacterMasteryLevel;
  onPress: (character: HiraganaCharacter) => void;
}

export interface LearningScreenState {
  selectedCharacter: HiraganaCharacter | null;
  modalVisible: boolean;
  searchQuery: string;
  filterCategory: "all" | "basic" | "dakuten" | "handakuten" | "combination";
}

export interface CharacterPronunciationResult {
  isCorrect: boolean;
  confidence: number;
  feedback: string;
}
