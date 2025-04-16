import React from 'react';
import { StyleSheet, View, Image, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Point } from '../types';
import { IconSymbol } from './ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface PointDetailProps {
  point: Point;
  visible: boolean;
  onClose: () => void;
}

export default function PointDetail({ point, visible, onClose }: PointDetailProps) {
  const colorScheme = useColorScheme();
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <View style={styles.header}>
            <ThemedText type="title">{point.name}</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol 
                name="chevron.right" 
                size={24} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
            </TouchableOpacity>
          </View>
          
          {point.imageUrl && (
            <Image 
              source={{ uri: point.imageUrl }} 
              style={styles.image} 
              resizeMode="cover" 
            />
          )}
          
          <ThemedText type="subtitle">Description</ThemedText>
          <ThemedText>{point.description}</ThemedText>
          
          {point.location && (
            <>
              <ThemedText type="subtitle">Location</ThemedText>
              <ThemedText>{point.location}</ThemedText>
            </>
          )}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>Continue Tour</ThemedText>
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
    maxHeight: '80%',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  closeButton: {
    padding: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
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
