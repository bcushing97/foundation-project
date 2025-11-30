import { Globe } from 'lucide-react';
import { Badge } from './ui/badge';

interface CountriesBadgeProps {
  trips: Array<{
    stops: Array<{
      location: string;
    }>;
  }>;
}

// Function to extract country from location string
function extractCountry(location: string): string | null {
  // Split by comma and get the last part (usually the country)
  const parts = location.split(',').map(p => p.trim());
  
  if (parts.length >= 2) {
    // Return the last part as country
    return parts[parts.length - 1];
  }
  
  // If no comma, check if it's a known country
  const knownCountries = [
    'Italy', 'France', 'Spain', 'Germany', 'United Kingdom', 'USA',
    'Japan', 'China', 'Thailand', 'Singapore', 'Australia', 'Canada',
    'Mexico', 'Costa Rica', 'Brazil', 'Argentina', 'UAE', 'India'
  ];
  
  for (const country of knownCountries) {
    if (location.includes(country)) {
      return country;
    }
  }
  
  return null;
}

export function CountriesBadge({ trips }: CountriesBadgeProps) {
  // Extract all countries from all trips
  const countries = new Set<string>();
  
  trips.forEach(trip => {
    trip.stops.forEach(stop => {
      const country = extractCountry(stop.location);
      if (country) {
        countries.add(country);
      }
    });
  });
  
  const countryCount = countries.size;
  
  if (countryCount === 0) {
    return null;
  }
  
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
      <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
        <Globe className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white leading-none">{countryCount}</span>
        <span className="text-xs text-white/90 leading-none">
          {countryCount === 1 ? 'Country' : 'Countries'}
        </span>
      </div>
    </div>
  );
}
