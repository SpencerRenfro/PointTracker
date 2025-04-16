import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Conditionally import BarCodeScanner to handle cases where it's not available
let BarCodeScanner: any;
try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch (error) {
  console.log('BarCodeScanner not available');
}

interface QRScannerProps {
  onScanSuccess: (pointId: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      if (!BarCodeScanner) {
        setHasPermission(false);
        return;
      }
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.log('Error requesting camera permissions:', error);
        setHasPermission(false);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);

    try {
      // Assuming QR codes contain point IDs directly
      // In a real app, you might want to validate the format or use a more complex data structure
      onScanSuccess(data);
    } catch (error) {
      Alert.alert('Invalid QR Code', 'The scanned QR code is not valid for this tour.');
    }
  };

  // For testing purposes - simulate scanning a QR code
  const simulateScan = () => {
    const testPointIds = ['point1', 'point2', 'point3', 'point4'];
    const randomIndex = Math.floor(Math.random() * testPointIds.length);
    onScanSuccess(testPointIds[randomIndex]);
  };

  if (!BarCodeScanner) {
    return (
      <View style={[styles.container, styles.noScannerContainer]}>
        <ThemedText style={styles.noScannerText}>
          QR Scanner is not available in this environment.
        </ThemedText>
        <ThemedText style={styles.instructions}>
          In a real device, this would open the camera to scan QR codes.
          For testing, you can use the button below to simulate scanning.
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={simulateScan}
        >
          <ThemedText style={styles.buttonText}>Simulate QR Scan</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.noScannerContainer]}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.noScannerContainer]}>
        <ThemedText style={styles.noScannerText}>No access to camera</ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={simulateScan}
        >
          <ThemedText style={styles.buttonText}>Simulate QR Scan</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {BarCodeScanner && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
        />
      )}

      {scanned && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={() => setScanned(false)}
        >
          <ThemedText style={styles.buttonText}>Tap to Scan Again</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  noScannerContainer: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  noScannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
