"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native"

interface DrawerContainerProps {
  show: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function DrawerContainer({ show, onClose, children }: DrawerContainerProps) {
  const [slideAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    if (show) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [show, slideAnim])

  if (!show) return null

  return (
    <View style={styles.drawerOverlay}>
      <TouchableOpacity style={styles.drawerBackdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.drawerHandle} />
        {children}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    marginBottom: 20,
  },
})
