'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Users, Truck, Book, Plane, ChevronDown, AlertTriangle, FileText, Sun, Moon, LayoutDashboard, Globe, Clock, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import TimelineViewComponent from "@/components/timeline"
import dynamic from 'next/dynamic'

const GlobePage = dynamic(() => import('@/app/globe/page'), { ssr: false })

const unitLevels = [
  "Field Army", "Corps", "Division", "Brigade", "Battalion", "Company", "Platoon", "Squad", "Fire Team"
] as const

const specialties = [
  "Infantry", "Armor", "Artillery", "Support", "Aviation", "Engineering", "Intelligence", "Medical"
] as const

const readinessColors = {
  high: "bg-green-500",
  medium: "bg-yellow-500",
  low: "bg-red-500"
} as const

// Define interfaces for our data structures
interface Unit {
  id: number;
  name: string;
  level: typeof unitLevels[number];
  parent_id: number | null;
  specialty: typeof specialties[number] | null;
  location_lat: number;
  location_lon: number;
  personnel: number;
  equipment: number;
  training: number;
  deployment: number;
  children?: Unit[];
}

interface Alert {
  id: number;
  unit_id: number;
  unit: string;
  date: string;
  message: string;
  severity: string;
  metric: string;
  value: number;
}

interface GlobeData {
  id: number;
  name: string;
  level: string;
  specialty: string | null;
  lat: number;
  lng: number;
  readiness: number;
}

// Add these functions to fetch data from our API routes
const fetchUnitHierarchy = async (): Promise<Unit[]> => {
  const response = await fetch('/api/unitHierarchy');
  if (!response.ok) {
    throw new Error('Failed to fetch unit hierarchy');
  }
  return response.json();
};

const fetchGlobeData = async (): Promise<GlobeData[]> => {
  const response = await fetch('/api/globeData');
  if (!response.ok) {
    throw new Error('Failed to fetch globe data');
  }
  const data = await response.json();
  console.log('Fetched globe data:', data);
  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    level: item.level,
    specialty: item.specialty,
    lat: item.location_lat,
    lng: item.location_lon,
    readiness: item.overall_readiness
  }));
};

const fetchAlerts = async (): Promise<Alert[]> => {
  const response = await fetch('/api/alerts');
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
};

// Custom hook for managing theme
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  return { theme, toggleTheme }
}

const filterUnits = (units: Unit[], unitType: string, specialty: string): Unit[] => {
  const unitTypeIndex = unitLevels.findIndex(level => level.toLowerCase() === unitType.toLowerCase());

  const filterUnit = (unit: Unit): Unit | null => {
    const unitLevelIndex = unitLevels.indexOf(unit.level);
    const matchesUnitType = unitType === 'all' || unitLevelIndex === unitTypeIndex;
    const matchesSpecialty = specialty === 'all' || unit.specialty?.toLowerCase() === specialty.toLowerCase();

    if (matchesUnitType && matchesSpecialty) {
      return {
        ...unit,
        children: unit.children
          ? unit.children.map(filterUnit).filter((child): child is Unit => child !== null)
          : undefined
      };
    } else if (unitLevelIndex < unitTypeIndex) {
      const filteredChildren = unit.children
        ? unit.children.map(filterUnit).filter((child): child is Unit => child !== null)
        : [];
      if (filteredChildren.length > 0) {
        return {
          ...unit,
          children: filteredChildren
        };
      }
    }
    return null;
  };

  return units.map(filterUnit).filter((unit): unit is Unit => unit !== null);
};

const UnitTree: React.FC<{ units: Unit[]; unitType: string; specialty: string }> = ({ units, unitType, specialty }) => {
  const filteredUnits = filterUnits(units, unitType, specialty);
  return (
    <div className="flex flex-col items-center">
      {renderUnitLevel(filteredUnits, 0)}
    </div>
  )
}

const renderUnitLevel = (units: Unit[], level: number) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {units.map((unit) => (
        <div key={unit.id} className="flex flex-col items-center">
          <UnitCard unit={unit} />
          {unit.children && unit.children.length > 0 && (
            <div className="mt-4">
              {renderUnitLevel(unit.children, level + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const UnitCard: React.FC<{ unit: Unit }> = ({ unit }) => {
  return (
    <Card className="w-64 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {unit.name} ({unit.level})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span className="font-medium mr-2">Personnel:</span>
            <ReadinessIndicator value={unit.personnel} />
          </div>
          <div className="flex items-center">
            <Truck className="mr-2 h-4 w-4" />
            <span className="font-medium mr-2">Equipment:</span>
            <ReadinessIndicator value={unit.equipment} />
          </div>
          <div className="flex items-center">
            <Book className="mr-2 h-4 w-4" />
            <span className="font-medium mr-2">Training:</span>
            <ReadinessIndicator value={unit.training} />
          </div>
          <div className="flex items-center">
            <Plane className="mr-2 h-4 w-4" />
            <span className="font-medium mr-2">Deployment:</span>
            <ReadinessIndicator value={unit.deployment} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ReadinessIndicator: React.FC<{ value: number }> = ({ value }) => {
  let color: keyof typeof readinessColors = 'low'
  if (value *100 >= 80) color = 'high'
  else if (value*100 >= 60) color = 'medium'

  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${readinessColors[color]} mr-2`}></div>
      <Progress value={value * 100} className="flex-grow" />
      <span className="ml-1 whitespace-nowrap">{value * 100} %</span>
    </div>
  )
}

const AlertBoard: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  const maxAlerts = 5
  const alertHeight = 100 // Approximate height of each alert in pixels
  const baseHeight = 100 // Base height for the card header and padding
  const dynamicHeight = Math.min(alerts.length, maxAlerts) * alertHeight + baseHeight

  return (
    <Card className={`h-[${dynamicHeight}px] max-h-[calc(100vh-200px)] flex flex-col`}>
      <CardHeader>
        <CardTitle>Alert Board</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {alerts.map((alert, index) => (
            <Alert key={index} variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{alert.unit}</AlertTitle>
              <AlertDescription>
                {alert.metric} readiness is at {alert.value}%. Immediate attention required.
              </AlertDescription>
            </Alert>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

const TimelineView: React.FC = () => (
  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
    <TimelineViewComponent/>
  </div>
)

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  unitType: string;
  setUnitType: (type: string) => void;
  specialty: string;
  setSpecialty: (specialty: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, unitType, setUnitType, specialty, setSpecialty, isOpen, toggleSidebar }) => {
  const views = [
    { name: 'Hierarchy', icon: LayoutDashboard },
    { name: 'Globe', icon: Globe },
    { name: 'Timeline', icon: Clock },
  ]

  const handleUnitTypeChange = (value: string) => {
    setUnitType(value);
    if (value !== 'all') {
      setSpecialty('all'); // Reset specialty when unit type changes
    }
  };

  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value);
    if (value !== 'all') {
      setUnitType('all'); // Reset unit type when specialty changes
    }
  };

  return (
    <div className={`bg-gray-200 dark:bg-gray-800 h-screen flex flex-col items-start p-4 overflow-y-auto transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="mb-8 w-full">
        {views.map((view) => (
          <Button
            key={view.name}
            variant="ghost"
            className={`w-full justify-start mb-2 ${activeView === view.name ? 'bg-primary text-primary-foreground' : ''} ${!isOpen ? 'px-2' : ''}`}
            onClick={() => setActiveView(view.name)}
          >
            <view.icon className="h-5 w-5 mr-2" />
            {isOpen && view.name}
          </Button>
        ))}
      </div>

      {isOpen && (
        <>
          <Separator className="my-4" />

          <div className="w-full space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="unit-type">
                Unit Type
              </label>
              <Select value={unitType} onValueChange={handleUnitTypeChange}>
                <SelectTrigger id="unit-type" className="w-full">
                  <SelectValue placeholder="Select Unit Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  {unitLevels.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="specialty">
                Specialty
              </label>
              <Select value={specialty} onValueChange={handleSpecialtyChange}>
                <SelectTrigger id="specialty" className="w-full">
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec.toLowerCase()}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function DashboardComponent() {
  const { theme, toggleTheme } = useTheme()
  const [activeView, setActiveView] = useState<string>('Hierarchy')
  const [unitType, setUnitType] = useState<string>('all')
  const [specialty, setSpecialty] = useState<string>('all')
  const [unitHierarchy, setUnitHierarchy] = useState<Unit[]>([])
  const [globeData, setGlobeData] = useState<GlobeData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [selectedUnit, setSelectedUnit] = useState<GlobeData | null>(null)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hierarchyData, globeData, alertsData] = await Promise.all([
          fetchUnitHierarchy(),
          fetchGlobeData(),
          fetchAlerts()
        ]);
        setUnitHierarchy(hierarchyData);
        setGlobeData(globeData);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    console.log('Active view:', activeView);
    console.log('Globe data:', globeData);
  }, [activeView, globeData]);

  const handleClosePopup = () => {
    setSelectedUnit(null);
  };

  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200`}>
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        unitType={unitType}
        setUnitType={setUnitType}
        specialty={specialty}
        setSpecialty={setSpecialty}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <MoreVertical className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold">Army Readiness Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
            <Moon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {activeView === 'Hierarchy' && (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <UnitTree units={unitHierarchy} unitType={unitType} specialty={specialty} />
              </ScrollArea>
            )}
            {activeView === 'Globe' && (
              <div className="w-full h-[calc(100vh-200px)] relative">
                <GlobePage />
              </div>
            )}
            {activeView === 'Timeline' && <TimelineView />}
          </div>
          <div>
            <AlertBoard alerts={alerts} />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Detailed Report
          </Button>
        </div>
      </div>
    </div>
  )
}
