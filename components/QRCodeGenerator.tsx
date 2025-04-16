import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import TestScanButton from './TestScanButton';

interface QRCodeGeneratorProps {
  value: string;
  title: string;
  description?: string;
  size?: number;
}

export default function QRCodeGenerator({
  value,
  title,
  description,
  size = 150
}: QRCodeGeneratorProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>{title}</ThemedText>
      <View style={styles.qrContainer}>
        <QRCode
          value={value}
          size={size}
          backgroundColor="white"
        />
      </View>
      {description && (
        <ThemedText style={styles.description}>{description}</ThemedText>
      )}
      <ThemedText style={styles.value}>Value: {value}</ThemedText>

      <TestScanButton pointId={value} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
  },
  description: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 14,
  },
  value: {
    fontSize: 12,
    opacity: 0.7,
  },
});
