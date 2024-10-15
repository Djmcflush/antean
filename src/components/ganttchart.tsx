'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import moment from 'moment'

interface ReadinessPrediction {
  unitId: string
  unitName: string
  startDate: Date
  endDate: Date
  readinessScore: number
}

interface GanttChartProps {
  predictions: ReadinessPrediction[]
}

interface GanttDataEntry {
  unitName: string
  start: number
  duration: number
  readinessScore: number
}

export default function GanttChartComponent({ predictions }: GanttChartProps) {
  const ganttData: GanttDataEntry[] = predictions.map(pred => ({
    unitName: pred.unitName,
    start: moment(pred.startDate).valueOf(),
    duration: moment(pred.endDate).diff(moment(pred.startDate), 'days'),
    readinessScore: pred.readinessScore,
  }))

  const colorScale = (score: number): string => {
    if (score >= 80) return '#4CAF50'
    if (score >= 60) return '#FFC107'
    return '#F44336'
  }

  const chartConfig: ChartConfig = {
    duration: {
      label: 'Duration',
      color: '#2196F3',
    },
    readinessScore: {
      label: 'Readiness Score',
      color: '#FF9800',
    },
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Readiness Gantt Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[600px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ganttData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                dataKey="start" 
                domain={['dataMin', 'dataMax']} 
                tickFormatter={(value: number) => moment(value).format('MMM D')}
                stroke="#888888"
              />
              <YAxis 
                type="category" 
                dataKey="unitName" 
                width={80} 
                stroke="#888888"
              />
              <Tooltip
                labelFormatter={(value: number) => moment(value).format('MMM D, YYYY')}
                formatter={(value: number | string, name: string) => {
                  if (name === 'duration') return [`${value} days`, 'Duration']
                  if (name === 'readinessScore') return [`${value}%`, 'Readiness Score']
                  return [value, name]
                }}
                contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
              />
              <Legend />
              <Bar dataKey="duration" name="Duration">
                {ganttData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorScale(entry.readinessScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
