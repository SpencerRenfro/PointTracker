import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppContext } from '@/context/AppContext';

export default function HistoryScreen() {
  const { completedTours, tours } = useAppContext();

  // Helper function to find tour name by ID
  const getTourName = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    return tour ? tour.name : 'Unknown Tour';
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate duration in minutes
  const calculateDuration = (startTime: number, endTime: number) => {
    const durationMinutes = Math.floor((endTime - startTime) / 60000);
    return durationMinutes + ' min';
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'History' }} />
      
      <ThemedText type="title" style={styles.title}>Completed Tours</ThemedText>
      
      {completedTours.length === 0 ? (
        <ThemedText style={styles.emptyText}>No completed tours yet.</ThemedText>
      ) : (
        <FlatList
          data={completedTours}
          keyExtractor={(item) => `${item.tourId}-${item.startTime}`}
          renderItem={({ item }) => (
            <ThemedView style={styles.tourCard}>
              <ThemedText type="defaultSemiBold">{getTourName(item.tourId)}</ThemedText>
              <ThemedText>Completed: {formatDate(item.endTime)}</ThemedText>
              <ThemedText>Points: {item.scannedPoints.length}</ThemedText>
              <ThemedText>Duration: {calculateDuration(item.startTime, item.endTime)}</ThemedText>
            </ThemedView>
          )}
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
  title: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.7,
  },
  tourCard: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
});
