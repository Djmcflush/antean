'use client'

import React, { useState } from 'react'
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

interface ReadinessPrediction {
  unitId: string
  unitName: string
  startDate: Date
  endDate: Date
  readinessScore: number
}

interface CalendarProps {
  predictions: ReadinessPrediction[]
}

const EventComponent = ({ event }: { event: any }) => (
  <Badge variant="outline" className="w-full text-left p-1 overflow-hidden text-xs">
    <span className="font-semibold">{event.title}</span>
  </Badge>
)

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => toolbar.onNavigate('PREV')
  const goToNext = () => toolbar.onNavigate('NEXT')
  const goToCurrent = () => toolbar.onNavigate('TODAY')

  const label = () => (
    <span className="text-2xl font-semibold">{moment(toolbar.date).format('MMMM YYYY')}</span>
  )

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <button onClick={goToBack} className="mr-2 p-3 rounded-full hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={goToNext} className="p-3 rounded-full hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div>{label()}</div>
      <button onClick={goToCurrent} className="p-3 rounded-full hover:bg-gray-200 text-lg">
        Today
      </button>
    </div>
  )
}

export default function Calendar({ predictions }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [unitsOutOfReadiness, setUnitsOutOfReadiness] = useState<ReadinessPrediction[]>([])

  const calendarEvents = predictions.map(pred => ({
    title: `${pred.unitName} (${pred.readinessScore}%)`,
    start: pred.startDate,
    end: pred.endDate,
    allDay: true,
    resource: pred.readinessScore,
  }))

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    const clickedDate = slotInfo.start
    const unitsOut = predictions.filter(pred => 
      moment(clickedDate).isBetween(pred.startDate, pred.endDate, null, '[]')
    )
    setSelectedDate(clickedDate)
    setUnitsOutOfReadiness(unitsOut)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">Readiness Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[800px]">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={[Views.MONTH]}
            components={{
              event: EventComponent,
              toolbar: CustomToolbar,
            }}
            eventPropGetter={(event) => ({
              className: `bg-blue-${Math.floor(event.resource / 10) * 100} text-white rounded-md`,
            })}
            onSelectSlot={handleSelectSlot}
            selectable
          />
        </div>
      </CardContent>
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Units Out of Readiness on {selectedDate?.toDateString()}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {unitsOutOfReadiness.length > 0 ? (
              unitsOutOfReadiness.map((unit) => (
                <div key={unit.unitId} className="mb-2 p-2 bg-gray-100 rounded">
                  <p className="font-semibold">{unit.unitName}</p>
                  <p>Readiness Score: {unit.readinessScore}%</p>
                </div>
              ))
            ) : (
              <p>No units predicted to be out of readiness on this date.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}