import React from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { useAppContext } from '@/context/AppContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface TestScanButtonProps {
  pointId: string;
}

export default function TestScanButton({ pointId }: TestScanButtonProps) {
  const { scanPoint, currentTour, currentProgress, completeTour } = useAppContext();
  const colorScheme = useColorScheme();

  const handleTestScan = () => {
    if (!currentTour || !currentProgress) {
      Alert.alert(
        'No Active Tour',
        'Please start a tour before testing scan.',
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
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
      onPress={handleTestScan}
    >
      <ThemedText style={styles.buttonText}>Test Scan</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
