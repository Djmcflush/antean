'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const GlobeComponent = dynamic(() => import('@/components/globe'), { ssr: false })

interface GlobeData {
  id: number;
  name: string;
  level: string;
  specialty: string | null;
  lat: number;
  lng: number;
  readiness: number;
}

export default function GlobePage() {
  const [globeData, setGlobeData] = useState<GlobeData[]>([])

  useEffect(() => {
    const fetchGlobeData = async () => {
      try {
        const response = await fetch('/api/globeData')
        if (!response.ok) {
          throw new Error('Failed to fetch globe data')
        }
        const data = await response.json()
        setGlobeData(data)
      } catch (error) {
        console.error('Error fetching globe data:', error)
      }
    }

    fetchGlobeData()
  }, [])

  return (
    <div className="w-screen h-screen">
      <GlobeComponent data={globeData} />
    </div>
  )
}
