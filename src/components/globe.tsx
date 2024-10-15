'use client'

import React, { useRef, useEffect, useState } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface GlobeData {
  id: number;
  name: string;
  level: string;
  specialty: string | null;
  lat: number;
  lng: number;
  readiness: number;
}

interface GlobeComponentProps {
  data: GlobeData[];
}

const specialtyColors: { [key: string]: string } = {
  'Infantry': '#FF0000',
  'Armor': '#00FF00',
  'Artillery': '#0000FF',
  'Support': '#FFFF00',
  'Aviation': '#FF00FF',
  'Engineering': '#00FFFF',
  'Intelligence': '#FFA500',
  'Medical': '#800080'
};

const GlobeComponent: React.FC<GlobeComponentProps> = ({ data }) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedUnit, setSelectedUnit] = useState<GlobeData | null>(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ altitude: 2.5 });
    }
  }, []);

  useEffect(() => {
    const resizeGlobe = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener('resize', resizeGlobe);
    resizeGlobe();

    return () => window.removeEventListener('resize', resizeGlobe);
  }, []);

  const handlePointClick = (point: object) => {
    setSelectedUnit(point as GlobeData);
  };

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedUnit(null);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={data}
        pointColor={(d: any) => specialtyColors[(d as GlobeData).specialty || ''] || '#FFFFFF'}
        pointAltitude={0.2}
        pointRadius={0.1}
        pointsMerge={true}
        pointResolution={3}
        onPointClick={handlePointClick}
        htmlElementsData={data}
        htmlElement={(d: any) => {
          const el = document.createElement('div');
          el.style.color = 'white';
          el.style.background = 'rgba(0, 0, 0, 0.5)';
          el.style.padding = '10px';
          el.style.borderRadius = '5px';
          el.style.pointerEvents = 'auto';
          el.style.cursor = 'pointer';
          el.textContent = (d as GlobeData).name;
          el.addEventListener('click', () => handlePointClick(d));
          return el;
        }}
        htmlAltitude={0.1}
        ringsData={data}
        ringColor={(d: any) => specialtyColors[(d as GlobeData).specialty || ''] || '#FFFFFF'}
        ringMaxRadius={0.5}
        ringPropagationSpeed={0.1}
        ringRepeatPeriod={1000}
      />
      {selectedUnit && (
        <div 
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleModalClose}
        >
          <Card className="w-96" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>{selectedUnit.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Level: {selectedUnit.level}</p>
              <p>Specialty: {selectedUnit.specialty || 'N/A'}</p>
              <p>Location: {selectedUnit.lat.toFixed(2)}, {selectedUnit.lng.toFixed(2)}</p>
              <p>Readiness: {selectedUnit.readiness}%</p>
              <button onClick={() => setSelectedUnit(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Legend</h3>
        {Object.entries(specialtyColors).map(([specialty, color]) => (
          <div key={specialty} className="flex items-center mb-1">
            <div style={{ backgroundColor: color }} className="w-4 h-4 mr-2"></div>
            <span>{specialty}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GlobeComponent
