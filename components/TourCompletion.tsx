import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Tour, TourProgress } from '../types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface TourCompletionProps {
  tour: Tour;
  progress: TourProgress;
  visible: boolean;
  onClose: () => void;
}

export default function TourCompletion({ tour, progress, visible, onClose }: TourCompletionProps) {
  const colorScheme = useColorScheme();
  
  // Calculate tour statistics
  const totalPoints = tour.points.length;
  const startTime = new Date(progress.startTime);
  const endTime = progress.endTime ? new Date(progress.endTime) : new Date();
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // in minutes
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <ThemedText type="title" style={styles.title}>Tour Completed!</ThemedText>
          
          <ThemedText type="subtitle">Tour Summary</ThemedText>
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statItem}>
              <ThemedText type="defaultSemiBold">{tour.name}</ThemedText>
              <ThemedText>Tour Name</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.statItem}>
              <ThemedText type="defaultSemiBold">{totalPoints}</ThemedText>
              <ThemedText>Points Visited</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.statItem}>
              <ThemedText type="defaultSemiBold">{duration} min</ThemedText>
              <ThemedText>Duration</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedText type="subtitle">Congratulations!</ThemedText>
          <ThemedText>
            You have successfully completed the {tour.name} tour. All points have been visited and your progress has been saved.
          </ThemedText>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>Return to Home</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
