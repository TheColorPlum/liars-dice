import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

// Simple debug app to test basic functionality
export default function DebugApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liar's Dice Debug</Text>
      <Text style={styles.text}>App is running!</Text>
      <Text style={styles.text}>Platform: {process.env.NODE_ENV}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },
})