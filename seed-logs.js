const fs = require("fs")
const path = require("path")
const LOGS_FILE_PATH = path.join(process.cwd(), "logs.json")
const sampleLogs = [
  {
    level: "error",
    message: "Database connection failed - timeout after 30 seconds",
    resourceId: "server-1234",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    traceId: "abc-xyz-123",
    spanId: "span-456",
    commit: "5e5342f",
    metadata: {
      parentResourceId: "server-5678",
      errorCode: "DB_CONNECTION_TIMEOUT",
      retryCount: 3,
    },
  },
  {
    level: "warn",
    message: "High memory usage detected on server",
    resourceId: "server-5678",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    traceId: "def-uvw-789",
    spanId: "span-789",
    commit: "7a8b9c2",
    metadata: {
      memoryUsage: "85%",
      threshold: "80%",
      availableMemory: "2.1GB",
    },
  },
  {
    level: "info",
    message: "User authentication successful",
    resourceId: "auth-service-01",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    traceId: "ghi-rst-456",
    spanId: "span-123",
    commit: "9d1e2f3",
    metadata: {
      userId: "user-12345",
      loginMethod: "oauth",
      provider: "google",
    },
  },
  {
    level: "debug",
    message: "Cache hit for user profile data",
    resourceId: "cache-server-02",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    traceId: "jkl-mno-789",
    spanId: "span-321",
    commit: "4g5h6i7",
    metadata: {
      cacheKey: "user:12345:profile",
      ttl: 3600,
      hitRate: "94.2%",
    },
  },
  {
    level: "error",
    message: "Payment processing failed - invalid card number",
    resourceId: "payment-service-03",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), 
    traceId: "mno-pqr-012",
    spanId: "span-654",
    commit: "8h9i0j1",
    metadata: {
      transactionId: "txn-98765",
      errorCode: "INVALID_CARD",
      amount: 99.99,
      currency: "USD",
    },
  },
  {
    level: "info",
    message: "Scheduled backup completed successfully",
    resourceId: "backup-service-04",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), 
    traceId: "stu-vwx-345",
    spanId: "span-987",
    commit: "2k3l4m5",
    metadata: {
      backupSize: "2.3GB",
      duration: "45 minutes",
      destination: "s3://backups/daily",
    },
  },
  {
    level: "warn",
    message: "API rate limit approaching for client",
    resourceId: "api-gateway-05",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), 
    traceId: "yzx-abc-678",
    spanId: "span-147",
    commit: "6n7o8p9",
    metadata: {
      clientId: "client-54321",
      currentRate: "950/hour",
      limit: "1000/hour",
      resetTime: "2023-09-15T09:00:00Z",
    },
  },
  {
    level: "debug",
    message: "SQL query executed successfully",
    resourceId: "database-primary",
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(), 
    traceId: "def-ghi-901",
    spanId: "span-258",
    commit: "0q1r2s3",
    metadata: {
      query: "SELECT * FROM users WHERE active = true",
      executionTime: "23ms",
      rowsReturned: 1247,
    },
  },
]

try {
  fs.writeFileSync(LOGS_FILE_PATH, JSON.stringify(sampleLogs, null, 2))
  console.log(`✅ Successfully seeded ${sampleLogs.length} log entries to ${LOGS_FILE_PATH}`)
  console.log("You can now start the application and view the sample logs!")
} catch (error) {
  console.error("❌ Error seeding logs:", error)
  process.exit(1)
}
