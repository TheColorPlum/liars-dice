import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const OfflineNotice: React.FC = () => {
  const isOfflineMode = process.env.EXPO_PUBLIC_SUPABASE_URL?.includes('localhost')

  if (!isOfflineMode) return null

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🔄 Demo Mode - Authentication is simulated
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})