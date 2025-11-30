# Developer Guide: Working with Data

## Quick Reference

### Importing Data

```typescript
// Recommended: Import from central index
import { 
  activitiesDatabase, 
  getActivityById, 
  savedTrips, 
  worldDestinations 
} from '../data';

// Or import directly from specific files
import { activitiesDatabase, getActivityById } from '../data/activities';
import { savedTrips } from '../data/savedTrips';
import { worldDestinations } from '../data/destinations';
```

## Common Tasks

### 1. Display Activities from a Trip

```typescript
import { getActivityById } from '../data/activities';
import type { SavedTrip } from '../data/savedTrips';

function TripActivitiesView({ trip }: { trip: SavedTrip }) {
  return (
    <div>
      {trip.destinations.map((destination, destIndex) => {
        // Get activity IDs for this destination
        const activityIds = destination.activityIds || [];
        
        // Fetch full activity details
        const activities = activityIds
          .map(id => getActivityById(id))
          .filter(activity => activity !== undefined); // Remove any that don't exist
        
        return (
          <div key={destIndex}>
            <h3>{destination.name}</h3>
            {activities.map(activity => (
              <div key={activity.id}>
                <h4>{activity.name}</h4>
                <p>{activity.description}</p>
                <p>Duration: {activity.duration}</p>
                <p>Price: ${activity.estimatedCost}</p>
                <p>Category: {activity.category}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

### 2. Find a Specific Trip

```typescript
import { savedTrips } from '../data/savedTrips';

// By ID
const trip = savedTrips.find(t => t.id === 'trip-1');

// By title
const japanTrip = savedTrips.find(t => t.title.includes('Japan'));

// By destination
const tripsToTanzania = savedTrips.filter(trip => 
  trip.destinations.some(dest => dest.name.includes('Tanzania'))
);

// By creator
const bryceTrips = savedTrips.filter(t => t.creator.name === 'Sarah Johnson');

// By budget
const budgetTrips = savedTrips.filter(t => t.budget < 3000);

// By tag
const adventureTrips = savedTrips.filter(t => t.tags.includes('Adventure'));
```

### 3. Find Activities by Criteria

```typescript
import { 
  activitiesDatabase, 
  getActivitiesByCategory, 
  getActivitiesByLocation 
} from '../data/activities';

// Get all activities
const allActivities = Object.values(activitiesDatabase);

// By category
const adventureActivities = getActivitiesByCategory('Adventure');
const culturalActivities = getActivitiesByCategory('Cultural');

// By location
const japanActivities = getActivitiesByLocation('Japan');
const tanzaniaActivities = getActivitiesByLocation('Tanzania');

// By price
const budgetActivities = allActivities.filter(a => a.estimatedCost && a.estimatedCost < 100);
const luxuryActivities = allActivities.filter(a => a.priceLevel === 4);

// By difficulty
const easyActivities = allActivities.filter(a => a.difficultyLevel === 'Easy');
const challengingActivities = allActivities.filter(a => a.difficultyLevel === 'Challenging');

// By duration (activities under 3 hours)
const shortActivities = allActivities.filter(a => 
  a.duration.includes('hour') && !a.duration.includes('Full day')
);
```

### 4. Create a New Trip (Code Example)

```typescript
// First, ensure all activities exist in activities.ts
// Then add to savedTrips.ts:

const newTrip: SavedTrip = {
  id: 'trip-9', // Unique ID
  title: 'Peru Adventure',
  creator: {
    name: 'Adventure Alex',
    avatar: 'https://images.unsplash.com/photo-...'
  },
  destinations: [
    {
      name: 'Cusco',
      days: 2,
      accommodations: [
        {
          name: 'Cusco Boutique Hotel',
          type: 'Hotel',
          location: 'Cusco Historic Center',
          nights: 2
        }
      ],
      activityIds: ['cusco-city-tour', 'sacred-valley-tour'] // Must exist in activities.ts
    },
    {
      name: 'Machu Picchu',
      days: 1,
      accommodations: [
        {
          name: 'Sanctuary Lodge',
          type: 'Hotel',
          location: 'Machu Picchu',
          nights: 1
        }
      ],
      activityIds: ['machu-picchu-tour']
    }
  ],
  duration: 3,
  budget: 1200,
  priceLevel: 3,
  mainImage: 'https://images.unsplash.com/photo-...',
  images: [
    'https://images.unsplash.com/photo-...',
    'https://images.unsplash.com/photo-...'
  ],
  description: 'Explore the ancient Inca ruins and vibrant culture of Peru.',
  highlights: [
    'Visit Machu Picchu',
    'Explore Cusco',
    'Sacred Valley tour'
  ],
  tags: ['Adventure', 'History', 'Culture'],
  saves: 0,
  createdAt: new Date()
};

// Add to array in savedTrips.ts
export const savedTrips: SavedTrip[] = [
  // ... existing trips
  newTrip
];
```

### 5. Create a New Activity (Code Example)

```typescript
// Add to activitiesDatabase in activities.ts:

'machu-picchu-tour': {
  id: 'machu-picchu-tour',
  name: 'Machu Picchu Guided Tour',
  description: 'Full-day guided tour of the iconic Incan citadel with expert archaeologist guide.',
  category: 'Cultural',
  duration: 'Full day (8 hours)',
  priceLevel: 3,
  estimatedCost: 180,
  location: 'Machu Picchu, Peru',
  image: 'https://images.unsplash.com/photo-...',
  bestTimeToVisit: 'April-October (dry season)',
  difficultyLevel: 'Moderate',
  included: [
    'Expert guide',
    'Entrance ticket',
    'Bus to/from site',
    'Lunch'
  ],
  notIncluded: [
    'Tips',
    'Travel insurance'
  ],
  requirements: [
    'Moderate fitness level',
    'Book 3-6 months in advance'
  ],
  tips: [
    'Start early to beat crowds',
    'Bring sun protection',
    'Acclimatize in Cusco first'
  ],
  bookingRequired: true,
  bestFor: ['History buffs', 'Photographers', 'Couples']
}
```

### 6. Search and Filter Destinations

```typescript
import { worldDestinations } from '../data/destinations';

// Search for destinations matching a query
function searchDestinations(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  return worldDestinations.filter(dest => 
    dest.toLowerCase().includes(lowerQuery)
  );
}

// Usage
const results = searchDestinations('japan'); // Returns: ['Japan', 'Tokyo', 'Kyoto', 'Osaka', ...]
const parisResults = searchDestinations('paris'); // Returns: ['Paris', ...]
```

### 7. Calculate Trip Statistics

```typescript
import { savedTrips } from '../data/savedTrips';
import { getActivityById } from '../data/activities';

// Calculate total activity cost for a trip
function calculateTripActivityCost(tripId: string): number {
  const trip = savedTrips.find(t => t.id === tripId);
  if (!trip) return 0;
  
  let totalCost = 0;
  trip.destinations.forEach(dest => {
    dest.activityIds?.forEach(activityId => {
      const activity = getActivityById(activityId);
      if (activity?.estimatedCost) {
        totalCost += activity.estimatedCost;
      }
    });
  });
  
  return totalCost;
}

// Get all activities for a trip
function getTripActivities(tripId: string) {
  const trip = savedTrips.find(t => t.id === tripId);
  if (!trip) return [];
  
  const allActivities: Activity[] = [];
  trip.destinations.forEach(dest => {
    dest.activityIds?.forEach(activityId => {
      const activity = getActivityById(activityId);
      if (activity) {
        allActivities.push(activity);
      }
    });
  });
  
  return allActivities;
}

// Count activities by category in a trip
function getActivityCategoryCounts(tripId: string): Record<string, number> {
  const activities = getTripActivities(tripId);
  const counts: Record<string, number> = {};
  
  activities.forEach(activity => {
    counts[activity.category] = (counts[activity.category] || 0) + 1;
  });
  
  return counts;
}
```

## Best Practices

### ✅ DO:

1. **Always import from data files**
   ```typescript
   import { savedTrips } from '../data/savedTrips';
   ```

2. **Use helper functions**
   ```typescript
   const activity = getActivityById('some-id');
   ```

3. **Check for undefined**
   ```typescript
   const activity = getActivityById(id);
   if (!activity) return null;
   ```

4. **Reference by ID**
   ```typescript
   activityIds: ['serengeti-game-drive', 'hot-air-balloon']
   ```

5. **Add to centralized files**
   - New activities → `activities.ts`
   - New trips → `savedTrips.ts`

### ❌ DON'T:

1. **Don't create inline data**
   ```typescript
   // ❌ WRONG
   const activity = {
     name: 'Some Tour',
     duration: '2 hours'
   };
   ```

2. **Don't duplicate data**
   ```typescript
   // ❌ WRONG - Don't copy trip from savedTrips and modify
   const myTrip = { ...savedTrips[0], title: 'Different Title' };
   ```

3. **Don't hardcode activity details**
   ```typescript
   // ❌ WRONG
   <div>Serengeti Game Drive - $250</div>
   
   // ✅ CORRECT
   const activity = getActivityById('serengeti-game-drive');
   <div>{activity.name} - ${activity.estimatedCost}</div>
   ```

## Testing Your Changes

After adding new data:

1. **Verify IDs are unique**
   ```typescript
   // Check no duplicate activity IDs
   const ids = Object.keys(activitiesDatabase);
   const uniqueIds = new Set(ids);
   console.assert(ids.length === uniqueIds.size, 'Duplicate activity IDs!');
   ```

2. **Verify references exist**
   ```typescript
   // Check all activityIds in trips exist
   savedTrips.forEach(trip => {
     trip.destinations.forEach(dest => {
       dest.activityIds?.forEach(id => {
         const activity = getActivityById(id);
         console.assert(activity, `Activity ${id} not found!`);
       });
     });
   });
   ```

3. **Test in the UI**
   - View the trip details page
   - Verify all activities display correctly
   - Check that prices and details are accurate

## Need Help?

Refer to:
- `README.md` - Architecture overview
- `DATA_STRUCTURE.md` - Detailed structure and relationships
- `activities.ts` - See existing activity examples
- `savedTrips.ts` - See existing trip examples
