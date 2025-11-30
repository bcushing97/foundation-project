import { useEffect, useRef, useState } from 'react';
import { MapPin, ZoomIn, ZoomOut } from 'lucide-react';

interface TripMapProps {
  stops: Array<{ location: string }>;
}

// Simple geocoding data for common locations
const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  // Italy
  'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
  'Florence, Italy': { lat: 43.7696, lng: 11.2558 },
  'Venice, Italy': { lat: 45.4408, lng: 12.3155 },
  'Milan, Italy': { lat: 45.4642, lng: 9.1900 },
  'Amalfi, Italy': { lat: 40.6340, lng: 14.6027 },
  'Positano, Italy': { lat: 40.6280, lng: 14.4850 },
  'Cinque Terre, Italy': { lat: 44.1267, lng: 9.7118 },
  'Naples, Italy': { lat: 40.8518, lng: 14.2681 },
  
  // Costa Rica
  'Manuel Antonio, Costa Rica': { lat: 9.3903, lng: -84.1458 },
  'San Jose, Costa Rica': { lat: 9.9281, lng: -84.0907 },
  
  // Mexico
  'Tulum, Mexico': { lat: 20.2114, lng: -87.4654 },
  'Cancun, Mexico': { lat: 21.1619, lng: -86.8515 },
  'Mexico City, Mexico': { lat: 19.4326, lng: -99.1332 },
  
  // France
  'Paris, France': { lat: 48.8566, lng: 2.3522 },
  'Nice, France': { lat: 43.7102, lng: 7.2620 },
  'Lyon, France': { lat: 45.7640, lng: 4.8357 },
  
  // Spain
  'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
  'Madrid, Spain': { lat: 40.4168, lng: -3.7038 },
  'Seville, Spain': { lat: 37.3891, lng: -5.9845 },
  
  // UK
  'London, United Kingdom': { lat: 51.5074, lng: -0.1278 },
  'Edinburgh, Scotland': { lat: 55.9533, lng: -3.1883 },
  
  // Japan
  'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
  'Kyoto, Japan': { lat: 35.0116, lng: 135.7681 },
  'Osaka, Japan': { lat: 34.6937, lng: 135.5023 },
  
  // USA
  'New York, USA': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles, USA': { lat: 34.0522, lng: -118.2437 },
  'San Francisco, USA': { lat: 37.7749, lng: -122.4194 },
  'Miami, USA': { lat: 25.7617, lng: -80.1918 },
  'Chicago, USA': { lat: 41.8781, lng: -87.6298 },
  
  // Other
  'Sydney, Australia': { lat: -33.8688, lng: 151.2093 },
  'Dubai, UAE': { lat: 25.2048, lng: 55.2708 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Bangkok, Thailand': { lat: 13.7563, lng: 100.5018 },
};

// Function to get approximate coordinates from location string
function getCoordinates(location: string): { lat: number; lng: number } | null {
  // Try exact match first
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }
  
  // Try partial match
  const locationLower = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (key.toLowerCase().includes(locationLower) || locationLower.includes(key.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
}

export function TripMap({ stops }: TripMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStop, setHoveredStop] = useState<number | null>(null);
  
  // Get coordinates for all stops
  const coordinates = stops
    .map((stop, index) => ({
      ...getCoordinates(stop.location),
      location: stop.location,
      index: index + 1,
    }))
    .filter((coord): coord is { lat: number; lng: number; location: string; index: number } => 
      coord.lat !== undefined && coord.lng !== undefined
    );
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = rect.width;
    const height = rect.height;
    
    if (coordinates.length === 0) {
      // Draw placeholder if no coordinates found
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Map preview unavailable', width / 2, height / 2);
      return;
    }
    
    // Calculate bounds
    const lats = coordinates.map(c => c.lat);
    const lngs = coordinates.map(c => c.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Add padding
    const latPadding = (maxLat - minLat) * 0.3 || 5;
    const lngPadding = (maxLng - minLng) * 0.3 || 5;
    
    const paddedMinLat = minLat - latPadding;
    const paddedMaxLat = maxLat + latPadding;
    const paddedMinLng = minLng - lngPadding;
    const paddedMaxLng = maxLng + lngPadding;
    
    // Draw background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#dbeafe');
    gradient.addColorStop(1, '#e0e7ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Convert lat/lng to canvas coordinates with zoom and pan
    const toCanvasX = (lng: number) => {
      const baseX = ((lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * width;
      return (baseX - width / 2) * zoom + width / 2 + pan.x;
    };
    
    const toCanvasY = (lat: number) => {
      const baseY = height - ((lat - paddedMinLat) / (paddedMaxLat - paddedMinLat)) * height;
      return (baseY - height / 2) * zoom + height / 2 + pan.y;
    };
    
    // Draw route lines
    if (coordinates.length > 1) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      coordinates.forEach((coord, index) => {
        const x = toCanvasX(coord.lng);
        const y = toCanvasY(coord.lat);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw pins
    coordinates.forEach((coord, index) => {
      const x = toCanvasX(coord.lng);
      const y = toCanvasY(coord.lat);
      const isHovered = hoveredStop === index;
      const pinSize = isHovered ? 24 : 20;
      
      // Draw pin shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x, y + 18, pinSize / 2.5, pinSize / 5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pin (teardrop shape)
      const isFirst = index === 0;
      const isLast = index === coordinates.length - 1;
      const color = isFirst ? '#10b981' : isLast ? '#ef4444' : '#3b82f6';
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, pinSize / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Pin pointer
      ctx.beginPath();
      ctx.moveTo(x - pinSize / 3, y + pinSize / 3);
      ctx.lineTo(x, y + pinSize * 1.2);
      ctx.lineTo(x + pinSize / 3, y + pinSize / 3);
      ctx.closePath();
      ctx.fill();
      
      // White border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, pinSize / 2, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw pin number
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${pinSize / 2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(coord.index.toString(), x, y);
      
      // Draw location label if hovered
      if (isHovered) {
        const labelPadding = 8;
        const labelText = coord.location;
        ctx.font = '12px sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        const labelWidth = textWidth + labelPadding * 2;
        const labelHeight = 24;
        const labelX = x - labelWidth / 2;
        const labelY = y - pinSize * 2;
        
        // Label background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 4);
        ctx.fill();
        
        // Label text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, x, labelY + labelHeight / 2);
      }
    });
    
  }, [coordinates, zoom, pan, hoveredStop]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
    
    // Check if hovering over a pin
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate bounds for coordinate conversion
    const lats = coordinates.map(c => c.lat);
    const lngs = coordinates.map(c => c.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latPadding = (maxLat - minLat) * 0.3 || 5;
    const lngPadding = (maxLng - minLng) * 0.3 || 5;
    const paddedMinLat = minLat - latPadding;
    const paddedMaxLat = maxLat + latPadding;
    const paddedMinLng = minLng - lngPadding;
    const paddedMaxLng = maxLng + lngPadding;
    
    const toCanvasX = (lng: number) => {
      const baseX = ((lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * rect.width;
      return (baseX - rect.width / 2) * zoom + rect.width / 2 + pan.x;
    };
    
    const toCanvasY = (lat: number) => {
      const baseY = rect.height - ((lat - paddedMinLat) / (paddedMaxLat - paddedMinLat)) * rect.height;
      return (baseY - rect.height / 2) * zoom + rect.height / 2 + pan.y;
    };
    
    let found = false;
    coordinates.forEach((coord, index) => {
      const x = toCanvasX(coord.lng);
      const y = toCanvasY(coord.lat);
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (distance < 15) {
        setHoveredStop(index);
        found = true;
      }
    });
    
    if (!found) {
      setHoveredStop(null);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredStop(null);
  };
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ width: '100%', height: '100%' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4 text-gray-700" />
        </button>
        <div className="h-px bg-gray-200" />
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      
      {/* Stop counter badge */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-lg border border-gray-200 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span>{stops.length} {stops.length === 1 ? 'stop' : 'stops'}</span>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-gray-600 shadow-lg border border-gray-200">
        Click and drag to pan • Hover pins for details
      </div>
    </div>
  );
}