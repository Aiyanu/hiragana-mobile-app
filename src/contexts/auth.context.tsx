"use client"

import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthContextType, User } from "../types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = async (): Promise<void> => {
        try {
            const userData = await AsyncStorage.getItem("user")
            if (userData) {
                setUser(JSON.parse(userData))
            }
        } catch (error) {
            console.error("Error loading user:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // Simulate API call - in real app, this would be an actual API request
            if (email && password.length >= 6) {
                const userData: User = {
                    id: Date.now().toString(),
                    email,
                    name: email.split("@")[0],
                    createdAt: new Date().toISOString(),
                }

                await AsyncStorage.setItem("user", JSON.stringify(userData))
                setUser(userData)
                return true
            }
            return false
        } catch (error) {
            console.error("Login error:", error)
            return false
        }
    }

    const register = async (email: string, password: string, name: string): Promise<boolean> => {
        try {
            // Simulate API call - in real app, this would be an actual API request
            if (email && password.length >= 6 && name) {
                const userData: User = {
                    id: Date.now().toString(),
                    email,
                    name,
                    createdAt: new Date().toISOString(),
                }

                await AsyncStorage.setItem("user", JSON.stringify(userData))
                setUser(userData)
                return true
            }
            return false
        } catch (error) {
            console.error("Register error:", error)
            return false
        }
    }

    const logout = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem("user")
            setUser(null)
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}
