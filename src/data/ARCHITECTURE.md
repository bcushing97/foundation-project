# Data Architecture - Single Source of Truth

## Overview

This document explains how destinations and accommodations work in relation to saved trips.

## Key Concepts

### 1. **Destinations Database** (`/data/destinations.ts`)
- **Purpose**: Master list of ALL searchable destinations
- **Type**: `Destination`
- **Usage**: Browse, search, save destinations
- **Examples**: Tamarindo, Manuel Antonio, Tulum, Santorini, Bali, Cappadocia

```typescript
interface Destination {
  id: string;                    // e.g., 'dest-tamarindo'
  name: string;                  // e.g., 'Tamarindo'
  country: string;               // e.g., 'Costa Rica'
  region?: string;               // e.g., 'Central America'
  image: string;
  description?: string;
  coordinates?: { lat, lng };
  tags?: string[];
  bestTimeToVisit?: string;
  averageCost?: number;
  popularity?: number;
}
```

### 2. **Accommodations Database** (`/data/accommodations.ts`)
- **Purpose**: Master list of ALL saveable accommodations
- **Type**: `Accommodation`
- **Usage**: Browse, search, save accommodations
- **Examples**: Hotel Tamarindo Diria, Witch's Rock Surf Camp, Be Tulum Hotel

```typescript
interface Accommodation {
  id: string;                    // e.g., 'acc-tamarindo-diria'
  name: string;
  location: string;
  destinationId?: string;        // Reference to destination
  type: 'Hotel' | 'Hostel' | 'Airbnb' | 'Resort' | ...;
  description: string;
  image: string;
  pricePerNight: number;
  priceLevel?: number;
  rating?: number;
  reviewCount?: number;
  amenities?: string[];
  userName?: string;
}
```

### 3. **Trip Destinations** (`/data/savedTrips.ts`)
- **Purpose**: Destinations within a trip itinerary
- **Type**: `TripDestination`
- **Usage**: Part of saved trip planning
- **Note**: Can OPTIONALLY reference a destination from the destinations database

```typescript
interface TripDestination {
  destinationId?: string;        // OPTIONAL - reference to destinations database
  name: string;                  // REQUIRED - display name
  days: number;                  // Trip-specific: days spent here
  accommodations?: TripAccommodation[];
  activityIds?: string[];
}
```

### 4. **Trip Accommodations** (`/data/savedTrips.ts`)
- **Purpose**: Accommodation bookings within a trip itinerary
- **Type**: `TripAccommodation`
- **Usage**: Record where you stayed during a trip
- **Note**: Can OPTIONALLY reference an accommodation from the accommodations database

```typescript
interface TripAccommodation {
  accommodationId?: string;      // OPTIONAL - reference to accommodations database
  name: string;                  // REQUIRED - display name
  type: string;                  // e.g., 'Tented Camp'
  location: string;
  nights?: number;               // Trip-specific: nights stayed
}
```

## Referential Integrity Rules

### ✅ CORRECT Usage

**For Major Destinations:**
```typescript
{
  destinationId: 'dest-santorini',  // ✅ References destinations database
  name: 'Santorini',
  days: 4,
  accommodations: [
    {
      accommodationId: 'acc-canaves-oia',  // ✅ References accommodations database
      name: 'Canaves Oia Suites',
      type: 'Hotel',
      location: 'Oia, Santorini',
      nights: 4
    }
  ],
  activityIds: ['santorini-sunset-cruise']
}
```

**For Sub-locations or Custom Accommodations:**
```typescript
{
  name: 'Serengeti National Park',  // ✅ No destinationId = custom location
  days: 4,
  accommodations: [
    {
      name: 'Serengeti Safari Lodge',  // ✅ No accommodationId = custom accommodation
      type: 'Tented Camp',
      location: 'Serengeti National Park',
      nights: 4
    }
  ],
  activityIds: ['serengeti-game-drive']
}
```

### ❌ INCORRECT Usage

**Creating destinations that should exist in the database:**
```typescript
// ❌ BAD - Santorini exists in destinations database
{
  name: 'Santorini',
  days: 4
  // Missing: destinationId: 'dest-santorini'
}
```

**Inline destinations without any reference:**
```typescript
// ❌ BAD - Should check if destination exists first
{
  name: 'Random Place',
  days: 2
}
```

## Why Two Different Types?

### Destinations Database (Destination)
- ✅ Searchable and browseable
- ✅ Rich metadata (images, ratings, coordinates)
- ✅ Users can save to their profile
- ✅ Used in search results and recommendations
- ✅ Single source of truth for major destinations

### Trip Destinations (TripDestination)
- ✅ Part of trip itinerary
- ✅ Trip-specific context (days spent, activities done)
- ✅ Can reference major destinations OR be custom locations
- ✅ Flexible for sub-locations (e.g., "Namche Bazaar" within Nepal)
- ✅ Keeps trip data lightweight

## Data Flow Examples

### Example 1: User Saves a Destination
```typescript
// User browses destinations
const destination = getDestinationById('dest-tamarindo');

// User saves it to their profile
user.savedDestinationIds.push('dest-tamarindo');
```

### Example 2: User Creates a Trip
```typescript
// User creates trip with reference to existing destination
const trip: SavedTrip = {
  id: 'trip-9',
  destinations: [
    {
      destinationId: 'dest-tamarindo',  // ✅ References database
      name: 'Tamarindo',
      days: 5,
      activityIds: ['act-witches-rock-surfing']
    }
  ]
};
```

### Example 3: User Views Accommodations for a Destination
```typescript
// Get all accommodations for Tamarindo
const accommodations = getAccommodationsByDestination('dest-tamarindo');

// User saves accommodation to their profile
user.savedAccommodationIds.push('acc-tamarindo-diria');
```

## Guidelines for Adding New Data

### When to Add to Destinations Database
- ✅ Major cities, countries, or regions
- ✅ Popular tourist destinations
- ✅ Places that will be searched multiple times
- ✅ Destinations with rich metadata

### When to Use Custom Trip Destination
- ✅ Sub-locations within a destination (e.g., "South Coast Iceland")
- ✅ Specific parks, trails, or areas
- ✅ Temporary or one-off locations
- ✅ User-specific custom locations

### When to Add to Accommodations Database
- ✅ Recommended hotels, hostels, resorts
- ✅ Places users can save and reference
- ✅ Accommodations with ratings, prices, amenities
- ✅ Saveable listings with rich metadata
- ✅ Properties that will be recommended multiple times

### When to Use Trip Accommodation (with accommodationId)
- ✅ Recording a stay at a property in the accommodations database
- ✅ Linking trip itinerary to saveable accommodations
- ✅ Tracking which database accommodations were actually used

### When to Use Trip Accommodation (without accommodationId)
- ✅ One-off accommodations not in the database
- ✅ Custom or unique stays
- ✅ Simple record of where you stayed
- ✅ Booking-specific details (nights stayed)

## Summary

The architecture separates:
1. **Searchable/Saveable Items** (destinations.ts, accommodations.ts) - Rich database
2. **Trip Planning Items** (savedTrips.ts) - Lightweight itinerary with optional references

This provides:
- ✅ Single source of truth for searchable content
- ✅ Flexibility for trip planning (custom or database-linked items)
- ✅ Referential integrity where it matters (via optional IDs)
- ✅ Backward compatibility (IDs are optional)
- ✅ Best of both worlds: structure when needed, freedom when desired

## Optional Reference Pattern

Both `TripDestination` and `TripAccommodation` follow the same pattern:
- **Optional ID field** (`destinationId`, `accommodationId`) - links to database when available
- **Required name field** - always present for display
- **Trip-specific fields** - context unique to this trip (days, nights, etc.)

This pattern allows:
- Major/popular items to maintain referential integrity
- Custom/one-off items to exist without database entries
- Easy upgrading from custom to database-linked items
- Flexible data modeling for user-generated content
