# Data Structure & Relationships

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SINGLE SOURCE OF TRUTH                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   activities.ts      │  ◄─── All activities defined here
│                      │
│  activitiesDatabase  │       • Serengeti Game Drive
│  {                   │       • Hot Air Balloon Safari
│    'activity-id': {  │       • Everest Base Camp Trek
│      id,             │       • Tea Ceremony Kyoto
│      name,           │       • ...50+ activities
│      description,    │
│      category,       │
│      duration,       │
│      estimatedCost,  │
│      ...             │
│    }                 │
│  }                   │
└──────────────────────┘
           ▲
           │ Referenced by ID
           │
┌──────────┴───────────┐
│   savedTrips.ts      │  ◄─── All trips defined here
│                      │
│  savedTrips: [       │       Trip Examples:
│    {                 │       • Safari Adventure in Tanzania
│      id: 'trip-1',   │       • Everest Base Camp Trek
│      title,          │       • Monaco Grand Prix
│      creator,        │       • Japan Cherry Blossom
│      destinations: [ │       • Iceland Ring Road
│        {             │       • Bali Wellness Retreat
│          name,       │       • Patagonia Hiking
│          days,       │       • Greek Islands
│          activityIds │──┐
│        }             │  │
│      ]               │  │
│    }                 │  │
│  ]                   │  │
└──────────────────────┘  │
                          │
                    References activities
                    by their IDs


┌──────────────────────┐
│  destinations.ts     │  ◄─── Searchable locations
│                      │
│  worldDestinations   │       • Countries
│                      │       • Cities
│                      │       • Regions
│                      │       • Landmarks
└──────────────────────┘
```

## Data Flow Examples

### Example 1: Displaying a Trip with Activities

```typescript
// 1. Get trip from savedTrips
import { savedTrips } from '../data/savedTrips';
const trip = savedTrips[0]; // Safari Adventure

// 2. Trip structure:
{
  id: 'trip-1',
  title: 'Safari Adventure in Tanzania',
  destinations: [
    {
      name: 'Serengeti National Park',
      days: 4,
      activityIds: [
        'serengeti-game-drive',      // ← Activity ID references
        'hot-air-balloon-safari',    // ← Activity ID references
        'maasai-village-visit'       // ← Activity ID references
      ]
    }
  ]
}

// 3. Get full activity details
import { getActivityById } from '../data/activities';

trip.destinations[0].activityIds.forEach(activityId => {
  const activity = getActivityById(activityId);
  // activity = {
  //   id: 'serengeti-game-drive',
  //   name: 'Serengeti Game Drive',
  //   description: 'Full-day game drive...',
  //   duration: 'Full day (8-10 hours)',
  //   estimatedCost: 250,
  //   ... all other activity details
  // }
});
```

### Example 2: Adding a New Trip

```typescript
// Step 1: Define any NEW activities in activities.ts
export const activitiesDatabase = {
  // ... existing activities
  
  'new-activity-id': {
    id: 'new-activity-id',
    name: 'New Amazing Activity',
    description: 'Full description here',
    category: 'Adventure',
    duration: '4 hours',
    estimatedCost: 150,
    location: 'New Location',
    // ... all required fields
  }
};

// Step 2: Add trip to savedTrips.ts that references the activity
export const savedTrips: SavedTrip[] = [
  // ... existing trips
  
  {
    id: 'trip-new',
    title: 'New Adventure Trip',
    creator: { name: 'User Name' },
    destinations: [
      {
        name: 'New Destination',
        days: 3,
        activityIds: ['new-activity-id'] // ← Reference by ID
      }
    ],
    duration: 3,
    budget: 1000,
    // ... all required fields
  }
];
```

## Current Data Inventory

### Activities Database (`activities.ts`)
**Total Activities: 50+**

By Location:
- **Tanzania**: 4 activities (game drives, hot air balloon, cultural visits, crater tours)
- **Nepal**: 3 activities (EBC trek, temple tours, mountain flights)
- **Monaco**: 3 activities (Grand Prix, yacht cruise, casino)
- **Japan**: 4 activities (food tours, tea ceremony, bamboo forest, deer park)
- **Iceland**: 4 activities (Blue Lagoon, glacier hike, Northern Lights, Golden Circle)
- **Bali**: 4 activities (yoga, massage, rice terraces, surf lessons)
- **Patagonia**: 3 activities (Fitz Roy trek, Perito Moreno, ice trekking)
- **Greece**: 4 activities (sunset cruise, Acropolis, beach clubs, cooking class)

By Category:
- Adventure: 12 activities
- Cultural: 8 activities
- Wildlife: 3 activities
- Wellness: 4 activities
- Food & Dining: 3 activities
- Water Sports: 3 activities
- Nature: 8 activities
- Sports: 1 activity
- Entertainment: 1 activity
- And more...

### Trips Database (`savedTrips.ts`)
**Total Trips: 8**

1. Safari Adventure in Tanzania (7 days, $3,500)
2. Mount Everest Base Camp Trek (14 days, $2,800)
3. Monaco Grand Prix Weekend (4 days, $8,500)
4. Japan Cherry Blossom Experience (10 days, $4,200)
5. Iceland Ring Road Adventure (8 days, $3,200)
6. Bali Wellness Retreat (12 days, $2,400)
7. Patagonia Hiking Expedition (10 days, $3,800)
8. Greek Islands Summer Escape (14 days, $5,200)

Each trip includes:
- Multiple destinations
- Activity IDs referencing activities database
- Accommodations with details
- Creator information
- Budget and duration
- Tags and highlights

### Destinations Database (`destinations.ts`)
**Total Destinations: 1000+**

Includes:
- All countries worldwide
- Major cities and capitals
- Popular regions
- Famous landmarks
- Searchable for autocomplete

## Validation Checklist

When adding new data, verify:

✅ **For New Activities:**
- [ ] Added to `activities.ts` activitiesDatabase
- [ ] Has unique ID
- [ ] Has all required fields
- [ ] Not duplicated elsewhere in codebase

✅ **For New Trips:**
- [ ] Added to `savedTrips.ts` savedTrips array
- [ ] Has unique ID
- [ ] Uses activityIds to reference activities
- [ ] All referenced activityIds exist in activities.ts
- [ ] Not duplicated elsewhere in codebase

✅ **For Components:**
- [ ] Imports from data files, not inline definitions
- [ ] Uses helper functions (getActivityById, etc.)
- [ ] Handles missing data gracefully (activity might not exist)

## Migration Notes

**Completed:**
- ✅ Deleted duplicate `tripDetails.ts` file
- ✅ Consolidated all trips in `savedTrips.ts`
- ✅ All activities in `activities.ts`
- ✅ Created central export file `index.ts`
- ✅ Documented architecture in `README.md`

**Result:**
- Single source of truth established
- No duplicate data definitions
- Type-safe data access
- Scalable architecture
