"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, Server, AlertCircle, Info, AlertTriangle, Bug } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogEntry {
  level: "error" | "warn" | "info" | "debug"
  message: string
  resourceId: string
  timestamp: string
  traceId: string
  spanId: string
  commit: string
  metadata: Record<string, any>
}

interface FilterState {
  level: string
  message: string
  resourceId: string
  timestamp_start: string
  timestamp_end: string
  traceId: string
  spanId: string
  commit: string
}

const LOG_LEVELS = [
  { value: "error", label: "Error", icon: AlertCircle, color: "bg-red-50 border-red-200 text-red-800" },
  { value: "warn", label: "Warning", icon: AlertTriangle, color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
  { value: "info", label: "Info", icon: Info, color: "bg-blue-50 border-blue-200 text-blue-800" },
  { value: "debug", label: "Debug", icon: Bug, color: "bg-gray-50 border-gray-200 text-gray-800" },
]

export default function LogQueryInterface() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>({level: "", message: "", resourceId: "", timestamp_start: "", timestamp_end: "", traceId: "", spanId: "", commit: "",})
  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })
      const response = await fetch(`/api/logs?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }
  const clearFilters = () => {
    setFilters({level: "", message: "", resourceId: "", timestamp_start: "", timestamp_end: "", traceId: "", spanId: "", commit: "",})
  }
  const getLevelConfig = (level: string) => {
    return LOG_LEVELS.find((l) => l.value === level) || LOG_LEVELS[2]
  }
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Log Ingestion & Query System</h1>
          <p className="text-gray-600">Search, filter, and analyze your application logs</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="message">Search Message</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="message" placeholder="Search in messages..." value={filters.message} onChange={(e) => handleFilterChange("message", e.target.value)} className="pl-10"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select value={filters.level} onValueChange={(value) => handleFilterChange("level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    {LOG_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <level.icon className="h-4 w-4" />
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resourceId">Resource ID</Label>
                <div className="relative">
                  <Server className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="resourceId" placeholder="server-1234" value={filters.resourceId} onChange={(e) => handleFilterChange("resourceId", e.target.value)} className="pl-10"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="traceId">Trace ID</Label>
                <Input id="traceId" placeholder="abc-xyz-123" value={filters.traceId} onChange={(e) => handleFilterChange("traceId", e.target.value)}/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timestamp_start">Start Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="timestamp_start" type="datetime-local" value={filters.timestamp_start} onChange={(e) => handleFilterChange("timestamp_start", e.target.value)} className="pl-10"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timestamp_end">End Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="timestamp_end" type="datetime-local" value={filters.timestamp_end} onChange={(e) => handleFilterChange("timestamp_end", e.target.value)} className="pl-10"/>
                </div>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent"> Clear Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Log Entries ({logs.length})</span>
              {loading && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No logs found matching your criteria</div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => {
                  const levelConfig = getLevelConfig(log.level)
                  const LevelIcon = levelConfig.icon
                  return (
                    <div key={`${log.timestamp}-${index}`} className={cn("p-4 rounded-lg border-l-4 transition-all hover:shadow-md", levelConfig.color)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <LevelIcon className="h-4 w-4" />
                            <Badge variant="outline" className="text-xs">
                              {log.level.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{log.message}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded">Resource: {log.resourceId}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Trace: {log.traceId}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Span: {log.spanId}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Commit: {log.commit}</span>
                          </div>
                          {Object.keys(log.metadata).length > 0 && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-gray-500 hover:text-gray-700">Metadata</summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
