import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppContext } from '@/context/AppContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TestScanScreen() {
  const { tours, currentTour, currentProgress, scanPoint, completeTour, startTour, resetProgress } = useAppContext();
  const colorScheme = useColorScheme();

  // Handle simulated scan
  const handleScanPoint = (pointId: string) => {
    if (!currentTour || !currentProgress) {
      Alert.alert(
        'No Active Tour',
        'Please start a tour first.',
        [{ text: 'OK' }]
      );
      return;
    }

    const success = scanPoint(pointId);
    
    if (success) {
      const point = currentTour.points.find(p => p.id === pointId);
      Alert.alert(
        'Point Scanned',
        `Successfully scanned: ${point?.name || pointId}`,
        [{ text: 'OK' }]
      );
      
      // Check if all points are scanned
      const allPointsScanned = currentTour.points.every(point => 
        currentProgress.scannedPoints.some(p => p.pointId === point.id)
      );
      
      if (allPointsScanned) {
        completeTour();
        Alert.alert(
          'Tour Completed',
          'All points have been scanned. Tour is now complete!',
          [{ text: 'OK' }]
        );
      }
    } else {
      // Check if point was already scanned
      const alreadyScanned = currentProgress.scannedPoints.some(p => p.pointId === pointId);
      
      if (alreadyScanned) {
        Alert.alert(
          'Already Scanned',
          'This point has already been scanned.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Scan Failed',
          'Failed to scan point. It may not be part of the current tour.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Test Scanner' }} />
      
      <ThemedText type="title" style={styles.title}>Test Scanner</ThemedText>
      
      <ThemedView style={styles.tourStatus}>
        <ThemedText type="subtitle">
          {currentTour 
            ? `Active Tour: ${currentTour.name}` 
            : 'No Active Tour'}
        </ThemedText>
        
        {currentTour && currentProgress && (
          <ThemedText>
            Progress: {currentProgress.scannedPoints.length} of {currentTour.points.length} points
          </ThemedText>
        )}
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Tour Controls</ThemedText>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tourButtons}>
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
        </ScrollView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Scan Points</ThemedText>
        <ThemedText style={styles.instructions}>
          Tap on a point below to simulate scanning it with the app.
        </ThemedText>
        
        <ScrollView style={styles.pointsContainer}>
          {tours.flatMap(tour => tour.points).map(point => (
            <ThemedView key={point.id} style={styles.pointCard}>
              <ThemedText type="defaultSemiBold">{point.name}</ThemedText>
              <ThemedText numberOfLines={2} style={styles.pointDescription}>
                {point.description}
              </ThemedText>
              <ThemedText style={styles.pointId}>ID: {point.id}</ThemedText>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => handleScanPoint(point.id)}
              >
                <ThemedText style={styles.buttonText}>Scan This Point</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ScrollView>
      </ThemedView>
      
      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => router.back()}
      >
        <ThemedText style={styles.buttonText}>Back to App</ThemedText>
      </TouchableOpacity>
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
  tourStatus: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  section: {
    marginBottom: 20,
  },
  instructions: {
    marginVertical: 8,
    opacity: 0.7,
  },
  tourButtons: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  pointsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  pointCard: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  pointDescription: {
    marginVertical: 8,
  },
  pointId: {
    fontFamily: 'monospace',
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#d9534f',
  },
  backButton: {
    backgroundColor: '#5bc0de',
    marginTop: 8,
  },
});
