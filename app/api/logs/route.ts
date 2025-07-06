import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

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

const LOGS_FILE_PATH = path.join(process.cwd(), "logs.json")

async function ensureLogsFile() {
  try {
    await fs.access(LOGS_FILE_PATH)
  } catch {
    await fs.writeFile(LOGS_FILE_PATH, JSON.stringify([]))
  }
}

async function readLogs(): Promise<LogEntry[]> {
  await ensureLogsFile()
  const data = await fs.readFile(LOGS_FILE_PATH, "utf-8")
  return JSON.parse(data)
}

async function writeLogs(logs: LogEntry[]): Promise<void> {
  await fs.writeFile(LOGS_FILE_PATH, JSON.stringify(logs, null, 2))
}

function validateLogEntry(entry: any): entry is LogEntry {
  const requiredFields = ["level", "message", "resourceId", "timestamp", "traceId", "spanId", "commit", "metadata"]
  const validLevels = ["error", "warn", "info", "debug"]

  if (!entry || typeof entry !== "object") return false

  for (const field of requiredFields) {
    if (!(field in entry)) return false
  }

  if (!validLevels.includes(entry.level)) return false
  if (typeof entry.message !== "string") return false
  if (typeof entry.resourceId !== "string") return false
  if (typeof entry.timestamp !== "string") return false
  if (typeof entry.traceId !== "string") return false
  if (typeof entry.spanId !== "string") return false
  if (typeof entry.commit !== "string") return false
  if (typeof entry.metadata !== "object" || entry.metadata === null) return false
  if (isNaN(Date.parse(entry.timestamp))) return false

  return true
}

function filterLogs(logs: LogEntry[], filters: Record<string, string>): LogEntry[] {
  return logs.filter((log) => {
    if (filters.level && log.level !== filters.level) return false
    if (filters.message && !log.message.toLowerCase().includes(filters.message.toLowerCase())) return false
    if (filters.resourceId && log.resourceId !== filters.resourceId) return false
    if (filters.traceId && log.traceId !== filters.traceId) return false
    if (filters.spanId && log.spanId !== filters.spanId) return false
    if (filters.commit && log.commit !== filters.commit) return false
    const logTime = new Date(log.timestamp).getTime()
    if (filters.timestamp_start) {
      const startTime = new Date(filters.timestamp_start).getTime()
      if (logTime < startTime) return false
    }
    if (filters.timestamp_end) {
      const endTime = new Date(filters.timestamp_end).getTime()
      if (logTime > endTime) return false
    }

    return true
  })
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!validateLogEntry(body)) {
      return NextResponse.json({ error: "Invalid log entry format" }, { status: 400 })
    }

    const logs = await readLogs()
    logs.push(body)
    await writeLogs(logs)

    return NextResponse.json(body, { status: 201 })
  } catch (error) {
    console.error("Error ingesting log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: Record<string, string> = {}
    const filterKeys = [
      "level", "message", "resourceId", "timestamp_start", "timestamp_end", "traceId", "spanId", "commit",
    ]
    filterKeys.forEach((key) => {
      const value = searchParams.get(key)
      if (value) filters[key] = value
    })

    const logs = await readLogs()
    const filteredLogs = filterLogs(logs, filters)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json(filteredLogs)
  } catch (error) {
    console.error("Error querying logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
