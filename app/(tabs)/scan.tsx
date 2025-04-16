import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppContext } from '@/context/AppContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import QRScanner from '@/components/QRScanner';
import NFCScanner from '@/components/NFCScanner';
import PointDetail from '@/components/PointDetail';
import TourCompletion from '@/components/TourCompletion';

type ScanMode = 'qr' | 'nfc';

export default function ScanScreen() {
  const { currentTour, currentProgress, scanPoint, completeTour } = useAppContext();
  const colorScheme = useColorScheme();
  const [scanMode, setScanMode] = useState<ScanMode>('qr');
  const [scannedPointId, setScannedPointId] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Allow scanning even without an active tour for testing
  const noActiveTour = !currentTour || !currentProgress;

  // Handle scanning when no tour is active
  const handleTestScan = (pointId: string) => {
    if (noActiveTour) {
      Alert.alert(
        'Test Scan Successful',
        `Scanned point ID: ${pointId}\n\nStart a tour from the home screen to track progress.`,
        [{ text: 'OK' }]
      );
      return;
    }

    handleScanSuccess(pointId);
  };

  // Find the scanned point details if a point was scanned
  const scannedPoint = scannedPointId && currentTour
    ? currentTour.points.find(p => p.id === scannedPointId)
    : null;

  // Handle successful scan
  const handleScanSuccess = (pointId: string) => {
    const success = scanPoint(pointId);

    if (success) {
      setScannedPointId(pointId);

      // Check if all points are scanned
      const allPointsScanned = currentTour.points.every(point =>
        currentProgress.scannedPoints.some(p => p.pointId === point.id)
      );

      if (allPointsScanned) {
        completeTour();
        setShowCompletion(true);
      }
    }
  };

  // Close point detail modal
  const handleClosePointDetail = () => {
    setScannedPointId(null);
  };

  // Close tour completion modal
  const handleCloseTourCompletion = () => {
    setShowCompletion(false);
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Scan Point' }} />

      {/* Scan mode selector */}
      <View style={styles.scanModeContainer}>
        <TouchableOpacity
          style={[
            styles.scanModeButton,
            scanMode === 'qr' && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setScanMode('qr')}
        >
          <ThemedText style={[styles.scanModeText, scanMode === 'qr' && styles.activeText]}>
            QR Code
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scanModeButton,
            scanMode === 'nfc' && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setScanMode('nfc')}
        >
          <ThemedText style={[styles.scanModeText, scanMode === 'nfc' && styles.activeText]}>
            NFC Tag
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Scanner component based on selected mode */}
      <View style={styles.scannerContainer}>
        {scanMode === 'qr' ? (
          <QRScanner onScanSuccess={noActiveTour ? handleTestScan : handleScanSuccess} />
        ) : (
          <NFCScanner onScanSuccess={noActiveTour ? handleTestScan : handleScanSuccess} />
        )}
      </View>

      {/* Point detail modal */}
      {scannedPoint && (
        <PointDetail
          point={scannedPoint}
          visible={!!scannedPointId}
          onClose={handleClosePointDetail}
        />
      )}

      {/* Tour completion modal */}
      {showCompletion && currentTour && currentProgress && (
        <TourCompletion
          tour={currentTour}
          progress={currentProgress}
          visible={showCompletion}
          onClose={handleCloseTourCompletion}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scanModeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  scanModeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  scanModeText: {
    fontWeight: 'bold',
  },
  activeText: {
    color: 'white',
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
