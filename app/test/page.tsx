"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Send } from "lucide-react"

const SAMPLE_LOGS = [
  {
    level: "error",
    message: "Failed to connect to database",
    resourceId: "server-1234",
    timestamp: new Date().toISOString(),
    traceId: "abc-xyz-123",
    spanId: "span-456",
    commit: "5e5342f",
    metadata: { parentResourceId: "server-5678", errorCode: "DB_CONNECTION_FAILED" },
  },
  {
    level: "warn",
    message: "High memory usage detected",
    resourceId: "server-5678",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    traceId: "def-uvw-789",
    spanId: "span-789",
    commit: "7a8b9c2",
    metadata: { memoryUsage: "85%", threshold: "80%" },
  },
  {
    level: "info",
    message: "User authentication successful",
    resourceId: "auth-service-01",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    traceId: "ghi-rst-456",
    spanId: "span-012",
    commit: "3d4e5f6",
    metadata: { userId: "user-123", loginMethod: "oauth" },
  },
  {
    level: "debug",
    message: "Cache hit for user profile",
    resourceId: "cache-service-02",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    traceId: "jkl-opq-789",
    spanId: "span-345",
    commit: "9g8h7i6",
    metadata: { cacheKey: "user:profile:123", ttl: 3600 },
  },
]

export default function TestLogIngestion() {
  const [customLog, setCustomLog] = useState({level: "info", message: "", resourceId: "", traceId: "", spanId: "", commit: "", metadata: "{}",})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const ingestLog = async (logEntry: any) => {
    setLoading(true)
    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logEntry),
      })

      if (response.ok) {
        const result = await response.json()
        setResults((prev) => [`✅ Successfully ingested log: ${logEntry.message}`, ...prev])
      } else {
        const error = await response.json()
        setResults((prev) => [`❌ Failed to ingest log: ${error.error}`, ...prev])
      }
    } catch (error) {
      setResults((prev) => [`❌ Network error: ${error}`, ...prev])
    } finally {
      setLoading(false)
    }
  }

  const ingestSampleLogs = async () => {
    for (const log of SAMPLE_LOGS) {
      await ingestLog(log)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  const ingestCustomLog = async () => {
    try {
      const metadata = JSON.parse(customLog.metadata)
      const logEntry = {...customLog, timestamp: new Date().toISOString(), metadata,}
      await ingestLog(logEntry)
      setCustomLog({level: "info", message: "", resourceId: "", traceId: "", spanId: "", commit: "", metadata: "{}",})
    } catch (error) {
      setResults((prev) => [`❌ Invalid JSON in metadata field`, ...prev])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Log Ingestion Test Interface</h1>
          <p className="text-gray-600">Test the log ingestion API with sample data or custom entries</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Sample Data Ingestion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Ingest a set of sample log entries to test the system functionality.
            </p>
            <Button onClick={ingestSampleLogs} disabled={loading} className="w-full">
              {loading ? "Ingesting..." : "Ingest Sample Logs"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Custom Log Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select value={customLog.level} onValueChange={(value) => setCustomLog((prev) => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resourceId">Resource ID</Label>
                <Input id="resourceId" placeholder="server-1234" value={customLog.resourceId} onChange={(e) => setCustomLog((prev) => ({ ...prev, resourceId: e.target.value }))}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="traceId">Trace ID</Label>
                <Input id="traceId" placeholder="abc-xyz-123" value={customLog.traceId} onChange={(e) => setCustomLog((prev) => ({ ...prev, traceId: e.target.value }))}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="spanId">Span ID</Label>
                <Input id="spanId" placeholder="span-456" value={customLog.spanId} onChange={(e) => setCustomLog((prev) => ({ ...prev, spanId: e.target.value }))}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commit">Commit Hash</Label>
                <Input id="commit" placeholder="5e5342f" value={customLog.commit} onChange={(e) => setCustomLog((prev) => ({ ...prev, commit: e.target.value }))}/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input id="message" placeholder="Enter log message..." value={customLog.message} onChange={(e) => setCustomLog((prev) => ({ ...prev, message: e.target.value }))}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metadata">Metadata (JSON)</Label>
              <Textarea id="metadata" placeholder='{"key": "value"}' value={customLog.metadata} onChange={(e) => setCustomLog((prev) => ({ ...prev, metadata: e.target.value }))} rows={3}/>
            </div>
            <Button onClick={ingestCustomLog} disabled={loading || !customLog.message || !customLog.resourceId} className="w-full">
              {loading ? "Ingesting..." : "Ingest Custom Log"}
            </Button>
          </CardContent>
        </Card>
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ingestion Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono p-2 bg-gray-100 rounded">
                    {result}
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => setResults([])} className="mt-4 w-full">
                Clear Results
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="text-center">
          <Button asChild variant="outline">
            <a href="/">← Back to Log Query Interface</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
