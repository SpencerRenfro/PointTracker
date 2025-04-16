// Point represents a location that can be scanned
export interface Point {
  id: string;
  name: string;
  description: string;
  location?: string;
  imageUrl?: string;
}

// Tour represents a collection of points that make up a complete tour
export interface Tour {
  id: string;
  name: string;
  description: string;
  points: Point[];
}

// Progress tracks which points have been scanned in a tour
export interface TourProgress {
  tourId: string;
  startTime: number; // timestamp
  scannedPoints: {
    pointId: string;
    timestamp: number;
  }[];
  completed: boolean;
  endTime?: number; // timestamp when completed
}

// CompletedTour represents a finished tour with all points scanned
export interface CompletedTour extends TourProgress {
  completed: true;
  endTime: number;
}
