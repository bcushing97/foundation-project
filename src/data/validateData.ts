/**
 * Data Validation Utility
 * 
 * Run this to validate data integrity across the application.
 * Checks for:
 * - Duplicate IDs
 * - Missing activity references
 * - Required fields
 */

import { activitiesDatabase } from './activities';
import { savedTrips } from './savedTrips';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateData(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check for duplicate activity IDs
  const activityIds = Object.keys(activitiesDatabase);
  const uniqueActivityIds = new Set(activityIds);
  if (activityIds.length !== uniqueActivityIds.size) {
    errors.push('Duplicate activity IDs found in activities database');
  }

  // 2. Check for duplicate trip IDs
  const tripIds = savedTrips.map(t => t.id);
  const uniqueTripIds = new Set(tripIds);
  if (tripIds.length !== uniqueTripIds.size) {
    errors.push('Duplicate trip IDs found in savedTrips');
  }

  // 3. Validate all activity references in trips exist
  savedTrips.forEach(trip => {
    trip.destinations.forEach((dest, destIndex) => {
      dest.activityIds?.forEach((activityId, actIndex) => {
        if (!activitiesDatabase[activityId]) {
          errors.push(
            `Trip "${trip.title}" (${trip.id}) references missing activity: "${activityId}" ` +
            `in destination "${dest.name}" (index ${destIndex}, activity index ${actIndex})`
          );
        }
      });
    });
  });

  // 4. Check for required fields in activities
  Object.entries(activitiesDatabase).forEach(([id, activity]) => {
    if (!activity.id) errors.push(`Activity ${id} missing 'id' field`);
    if (!activity.name) errors.push(`Activity ${id} missing 'name' field`);
    if (!activity.description) errors.push(`Activity ${id} missing 'description' field`);
    if (!activity.category) errors.push(`Activity ${id} missing 'category' field`);
    if (!activity.duration) errors.push(`Activity ${id} missing 'duration' field`);
    if (!activity.priceLevel) errors.push(`Activity ${id} missing 'priceLevel' field`);
    if (!activity.location) errors.push(`Activity ${id} missing 'location' field`);
    
    // ID should match the key
    if (activity.id !== id) {
      errors.push(`Activity ${id} has mismatched id field: ${activity.id}`);
    }
  });

  // 5. Check for required fields in trips
  savedTrips.forEach(trip => {
    if (!trip.id) errors.push(`Trip missing 'id' field`);
    if (!trip.title) errors.push(`Trip ${trip.id} missing 'title' field`);
    if (!trip.creatorId) errors.push(`Trip ${trip.id} missing 'creatorId' field`);
    if (!trip.destinations || trip.destinations.length === 0) {
      errors.push(`Trip ${trip.id} has no destinations`);
    }
    if (!trip.duration) errors.push(`Trip ${trip.id} missing 'duration' field`);
    if (!trip.budget) errors.push(`Trip ${trip.id} missing 'budget' field`);
    if (!trip.mainImage) warnings.push(`Trip ${trip.id} missing 'mainImage' field`);
    if (!trip.images || trip.images.length === 0) {
      warnings.push(`Trip ${trip.id} has no images`);
    }
  });

  // 6. Validate trip duration matches destination days
  savedTrips.forEach(trip => {
    const totalDays = trip.destinations.reduce((sum, dest) => sum + dest.days, 0);
    if (totalDays !== trip.duration) {
      warnings.push(
        `Trip ${trip.id} "${trip.title}": duration (${trip.duration}) doesn't match ` +
        `sum of destination days (${totalDays})`
      );
    }
  });

  // 7. Check for unused activities (activities not referenced by any trip)
  const referencedActivityIds = new Set<string>();
  savedTrips.forEach(trip => {
    trip.destinations.forEach(dest => {
      dest.activityIds?.forEach(id => referencedActivityIds.add(id));
    });
  });

  const allActivityIds = new Set(Object.keys(activitiesDatabase));
  const unusedActivities = [...allActivityIds].filter(id => !referencedActivityIds.has(id));
  if (unusedActivities.length > 0) {
    warnings.push(
      `${unusedActivities.length} activities are not used in any trip: ${unusedActivities.join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Run validation and log results
export function runValidation(): void {
  console.log('🔍 Validating data integrity...\n');
  
  const result = validateData();
  
  if (result.valid) {
    console.log('✅ All data validation checks passed!');
  } else {
    console.log('❌ Data validation failed!');
    console.log(`\n${result.errors.length} ERROR(S):`);
    result.errors.forEach((error, i) => {
      console.log(`  ${i + 1}. ${error}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log(`\n⚠️  ${result.warnings.length} WARNING(S):`);
    result.warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. ${warning}`);
    });
  }
  
  console.log('\n📊 Statistics:');
  console.log(`  • Total activities: ${Object.keys(activitiesDatabase).length}`);
  console.log(`  • Total trips: ${savedTrips.length}`);
  console.log(`  • Total destinations across all trips: ${savedTrips.reduce((sum, t) => sum + t.destinations.length, 0)}`);
  
  const totalActivityRefs = savedTrips.reduce((sum, trip) => {
    return sum + trip.destinations.reduce((destSum, dest) => {
      return destSum + (dest.activityIds?.length || 0);
    }, 0);
  }, 0);
  console.log(`  • Total activity references: ${totalActivityRefs}`);
}

// Example usage (uncomment to run):
// runValidation();
