import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppContext } from '@/context/AppContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const { tours, currentTour, currentProgress, startTour } = useAppContext();
  const colorScheme = useColorScheme();

  // Calculate progress if a tour is active
  const progress = currentTour && currentProgress ?
    Math.round((currentProgress.scannedPoints.length / currentTour.points.length) * 100) : 0;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Point Tracker</ThemedText>
      </ThemedView>

      {currentTour ? (
        // Active Tour View
        <ThemedView style={styles.activeContainer}>
          <ThemedText type="subtitle">Active Tour</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.tourName}>
            {currentTour.name}
          </ThemedText>

          <ThemedView style={styles.progressContainer}>
            <ThemedView
              style={[styles.progressBar, { width: `${progress}%`, backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            />
            <ThemedText style={styles.progressText}>
              {currentProgress?.scannedPoints.length || 0} of {currentTour.points.length} points
            </ThemedText>
          </ThemedView>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => router.push({ pathname: '/(tabs)/scan' })}
          >
            <ThemedText style={styles.buttonText}>Scan Next Point</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        // Available Tours View
        <ThemedView style={styles.toursContainer}>
          <ThemedText type="subtitle">Available Tours</ThemedText>

          {tours.map(tour => (
            <ThemedView key={tour.id} style={styles.tourCard}>
              <ThemedText type="defaultSemiBold">{tour.name}</ThemedText>
              <ThemedText numberOfLines={2}>{tour.description}</ThemedText>
              <ThemedText style={styles.pointCount}>{tour.points.length} points</ThemedText>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => startTour(tour.id)}
              >
                <ThemedText style={styles.buttonText}>Start Tour</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  activeContainer: {
    gap: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tourName: {
    fontSize: 18,
    marginBottom: 8,
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: 'bold',
  },
  toursContainer: {
    gap: 16,
  },
  tourCard: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  pointCount: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 12,
    opacity: 0.7,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
