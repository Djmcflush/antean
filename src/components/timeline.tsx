'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Calendar from '@/components/calendar'
import GanttChartComponent from '@/components/ganttchart'

interface ReadinessPrediction {
  id: number
  unit_id: string
  unit_name: string
  start_date: string
  end_date: string
  readiness_score: number
}

const fetchReadinessPredictions = async (): Promise<ReadinessPrediction[]> => {
  const response = await fetch('/api/readinessPredictions')
  if (!response.ok) {
    throw new Error('Failed to fetch readiness predictions')
  }
  return response.json()
}

// Mapping function to convert API data to the format expected by child components
const mapPredictions = (predictions: ReadinessPrediction[]): any[] => {
  return predictions.map(pred => ({
    unitId: pred.unit_id,
    unitName: pred.unit_name,
    startDate: new Date(pred.start_date),
    endDate: new Date(pred.end_date),
    readinessScore: pred.readiness_score
  }))
}

export default function TimelineViewComponent() {
  const [predictions, setPredictions] = useState<ReadinessPrediction[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const data = await fetchReadinessPredictions()
        setPredictions(data)
      } catch (err) {
        setError('Failed to load readiness predictions')
        console.error(err)
      }
    }
    loadPredictions()
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  const mappedPredictions = mapPredictions(predictions)

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Unit Readiness Timeline</h1>
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Calendar predictions={mappedPredictions} />
        </TabsContent>
        <TabsContent value="gantt">
          <GanttChartComponent predictions={mappedPredictions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
