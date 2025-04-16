import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { useAppContext } from '@/context/AppContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TestQRScreen() {
  const { tours, currentTour, startTour, resetProgress } = useAppContext();
  const colorScheme = useColorScheme();

  // Get all points from all tours
  const allPoints = tours.flatMap(tour => tour.points);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Test QR Codes' }} />

      <ThemedText type="title" style={styles.title}>Test QR Codes</ThemedText>

      <View style={styles.tourControls}>
        <ThemedText type="subtitle" style={styles.tourStatus}>
          {currentTour ? `Active Tour: ${currentTour.name}` : 'No Active Tour'}
        </ThemedText>

        <View style={styles.buttonRow}>
          {tours.map(tour => (
            <TouchableOpacity
              key={tour.id}
              style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
              onPress={() => startTour(tour.id)}
            >
              <ThemedText style={styles.buttonText}>Start {tour.name}</ThemedText>
            </TouchableOpacity>
          ))}

          {currentTour && (
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetProgress}
            >
              <ThemedText style={styles.buttonText}>Reset Tour</ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Back to App</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ThemedText style={styles.subtitle}>
        Scan these QR codes with the app to test the tour functionality.
        Or use the "Test Scan" buttons to simulate scanning without a camera.
      </ThemedText>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {allPoints.map(point => (
          <QRCodeGenerator
            key={point.id}
            value={point.id}
            title={point.name}
            description={point.description}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  tourControls: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tourStatus: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  resetButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subtitle: {
    marginBottom: 16,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
