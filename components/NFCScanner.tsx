import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Conditionally import NFC manager
let NfcManager: any;
let NfcTech: any;
let Ndef: any;

try {
  const nfcImport = require('react-native-nfc-manager');
  NfcManager = nfcImport.default;
  NfcTech = nfcImport.NfcTech;
  Ndef = nfcImport.Ndef;
} catch (error) {
  console.log('NFC Manager not available');
}

interface NFCScannerProps {
  onScanSuccess: (pointId: string) => void;
}

export default function NFCScanner({ onScanSuccess }: NFCScannerProps) {
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const checkNfc = async () => {
      if (!NfcManager) {
        setHasNfc(false);
        return;
      }

      try {
        const supported = await NfcManager.isSupported();
        setHasNfc(supported);

        if (supported) {
          await NfcManager.start();
        }
      } catch (error) {
        console.log('Error checking NFC support:', error);
        setHasNfc(false);
      }
    };

    checkNfc();

    // Clean up NFC manager when component unmounts
    return () => {
      if (NfcManager) {
        NfcManager.cancelTechnologyRequest().catch(() => {});
      }
    };
  }, []);

  const startScan = async () => {
    if (!hasNfc) return;

    setIsScanning(true);

    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Read NFC tag
      const tag = await NfcManager.getTag();

      if (tag && tag.ndefMessage && tag.ndefMessage.length > 0) {
        // Parse NDEF message
        const ndefRecord = tag.ndefMessage[0];
        const payload = Ndef.text.decodePayload(ndefRecord.payload);

        // Call the success handler with the payload (point ID)
        onScanSuccess(payload);
      }
    } catch (error) {
      console.warn('NFC Error:', error);
      Alert.alert('NFC Error', 'There was an error reading the NFC tag.');
    } finally {
      // Cancel NFC technology request
      NfcManager.cancelTechnologyRequest().catch(() => {});
      setIsScanning(false);
    }
  };

  // For testing purposes - simulate scanning an NFC tag
  const simulateScan = () => {
    const testPointIds = ['point1', 'point2', 'point3', 'point4'];
    const randomIndex = Math.floor(Math.random() * testPointIds.length);
    onScanSuccess(testPointIds[randomIndex]);
  };

  if (!NfcManager || hasNfc === false) {
    return (
      <View style={[styles.container, styles.noNfcContainer]}>
        <ThemedText style={styles.noNfcText}>
          NFC is not available in this environment.
        </ThemedText>
        <ThemedText style={styles.instructions}>
          In a real device with NFC support, this would allow you to scan NFC tags.
          For testing, you can use the button below to simulate scanning.
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={simulateScan}
        >
          <ThemedText style={styles.buttonText}>Simulate NFC Scan</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasNfc === null) {
    return (
      <View style={[styles.container, styles.noNfcContainer]}>
        <ThemedText style={styles.instructions}>Checking NFC capability...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.instructions}>
        {isScanning
          ? 'Hold your device near an NFC tag'
          : 'Tap the button to scan an NFC tag'}
      </ThemedText>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={isScanning ? () => NfcManager.cancelTechnologyRequest() : startScan}
        disabled={!hasNfc}
      >
        <ThemedText style={styles.buttonText}>
          {isScanning ? 'Cancel' : 'Scan NFC Tag'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noNfcContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNfcText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
