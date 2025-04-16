import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Point, Tour, TourProgress, CompletedTour } from '../types';

// Sample data for testing
const SAMPLE_TOUR: Tour = {
  id: 'tour1',
  name: 'Campus Tour',
  description: 'A tour around the main campus buildings',
  points: [
    {
      id: 'point1',
      name: 'Main Entrance',
      description: 'The main entrance to the campus',
      location: 'Building A',
    },
    {
      id: 'point2',
      name: 'Library',
      description: 'The central library with study areas',
      location: 'Building B',
    },
    {
      id: 'point3',
      name: 'Student Center',
      description: 'Student services and dining options',
      location: 'Building C',
    },
    {
      id: 'point4',
      name: 'Science Lab',
      description: 'Research laboratories and classrooms',
      location: 'Building D',
    },
  ],
};

interface AppContextType {
  // Data
  tours: Tour[];
  currentTour: Tour | null;
  currentProgress: TourProgress | null;
  completedTours: CompletedTour[];
  
  // Actions
  startTour: (tourId: string) => void;
  scanPoint: (pointId: string) => boolean;
  completeTour: () => void;
  resetProgress: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tours, setTours] = useState<Tour[]>([SAMPLE_TOUR]);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [currentProgress, setCurrentProgress] = useState<TourProgress | null>(null);
  const [completedTours, setCompletedTours] = useState<CompletedTour[]>([]);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const progressData = await AsyncStorage.getItem('currentProgress');
        if (progressData) {
          const progress = JSON.parse(progressData) as TourProgress;
          setCurrentProgress(progress);
          
          // Find the tour that matches the progress
          const tour = tours.find(t => t.id === progress.tourId) || null;
          setCurrentTour(tour);
        }
        
        const completedData = await AsyncStorage.getItem('completedTours');
        if (completedData) {
          setCompletedTours(JSON.parse(completedData));
        }
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };
    
    loadData();
  }, []);

  // Save progress to AsyncStorage whenever it changes
  useEffect(() => {
    const saveProgress = async () => {
      if (currentProgress) {
        await AsyncStorage.setItem('currentProgress', JSON.stringify(currentProgress));
      } else {
        await AsyncStorage.removeItem('currentProgress');
      }
    };
    
    saveProgress();
  }, [currentProgress]);

  // Save completed tours to AsyncStorage whenever they change
  useEffect(() => {
    const saveCompletedTours = async () => {
      await AsyncStorage.setItem('completedTours', JSON.stringify(completedTours));
    };
    
    saveCompletedTours();
  }, [completedTours]);

  // Start a new tour
  const startTour = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return;
    
    setCurrentTour(tour);
    setCurrentProgress({
      tourId: tour.id,
      startTime: Date.now(),
      scannedPoints: [],
      completed: false,
    });
  };

  // Scan a point and update progress
  const scanPoint = (pointId: string): boolean => {
    if (!currentTour || !currentProgress) return false;
    
    // Check if point exists in the tour
    const pointExists = currentTour.points.some(p => p.id === pointId);
    if (!pointExists) return false;
    
    // Check if point already scanned
    const alreadyScanned = currentProgress.scannedPoints.some(p => p.pointId === pointId);
    if (alreadyScanned) return false;
    
    // Add point to scanned points
    const updatedProgress = {
      ...currentProgress,
      scannedPoints: [
        ...currentProgress.scannedPoints,
        { pointId, timestamp: Date.now() }
      ],
    };
    
    setCurrentProgress(updatedProgress);
    return true;
  };

  // Complete the current tour
  const completeTour = () => {
    if (!currentTour || !currentProgress) return;
    
    // Check if all points are scanned
    const allPointsScanned = currentTour.points.every(point => 
      currentProgress.scannedPoints.some(p => p.pointId === point.id)
    );
    
    if (!allPointsScanned) return;
    
    // Mark tour as completed
    const completedTour: CompletedTour = {
      ...currentProgress,
      completed: true,
      endTime: Date.now(),
    };
    
    setCompletedTours([...completedTours, completedTour]);
    setCurrentProgress(null);
    setCurrentTour(null);
  };

  // Reset current progress
  const resetProgress = () => {
    setCurrentProgress(null);
    setCurrentTour(null);
  };

  return (
    <AppContext.Provider
      value={{
        tours,
        currentTour,
        currentProgress,
        completedTours,
        startTour,
        scanPoint,
        completeTour,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
