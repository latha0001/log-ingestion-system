# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying application logs. Built with Next.js, React, and TypeScript, featuring a professional UI inspired by modern monitoring tools.

## Features

### Backend API
- **POST /api/logs** - Ingest log entries with full validation
- **GET /api/logs** - Query logs with comprehensive filtering
- JSON file-based persistence (no external database required)
- Support for combined filters with AND logic
- Reverse chronological ordering (most recent first)

### Frontend Interface
- Real-time log filtering and search
- Professional UI with visual log level indicators
- Full-text search across log messages
- Date/time range filtering
- Resource ID, Trace ID, and other field filtering
- Responsive design optimized for desktop use

### Log Data Schema
Each log entry contains:
- `level`: error, warn, info, debug
- `message`: Primary log message
- `resourceId`: Resource identifier (server, service, etc.)
- `timestamp`: ISO 8601 formatted timestamp
- `traceId`: Unique trace identifier
- `spanId`: Unique span identifier
- `commit`: Git commit hash
- `metadata`: Additional structured data

### Installation

1. Clone the repository:
``bash
git clone https://github.com/latha0001/log-ingestion-system
cd log-ingestion-system
``

2. Install dependencies:
``bash
npm install
``

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to:
- Main interface: http://localhost:3000
- Test interface: http://localhost:3000/test

## Usage

### Ingesting Logs

Send a POST request to `/api/logs` with a JSON payload:

\`\`\`bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Database connection failed",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {"errorCode": "DB_CONN_FAILED"}
  }'
\`\`\`

### Querying Logs

Query logs with optional filters:

\`\`\`bash
# Get all logs
curl http://localhost:3000/api/logs

# Filter by level and message
curl "http://localhost:3000/api/logs?level=error&message=database"

# Filter by time range
curl "http://localhost:3000/api/logs?timestamp_start=2023-09-15T00:00:00Z&timestamp_end=2023-09-15T23:59:59Z"
\`\`\`

### Using the Web Interface

1. **Main Interface** (`/`): 
   - View and filter logs using the comprehensive filter bar
   - Search messages, filter by level, resource ID, time range
   - Visual indicators for different log levels

2. **Test Interface** (`/test`):
   - Ingest sample data for testing
   - Create custom log entries
   - Monitor ingestion results

## Architecture Decisions

### Data Persistence
- **JSON File Storage**: Uses a single `logs.json` file as specified in requirements
- **In-Memory Filtering**: All filtering logic implemented in Node.js using native Array methods
- **File System Operations**: Utilizes Node.js `fs.promises` for async file operations

### API Design
- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Comprehensive Validation**: Server-side validation for all log entry fields
- **Error Handling**: Proper error responses with meaningful messages

### Frontend Architecture
- **React Hooks**: Uses `useState` and `useEffect` for state management
- **Real-time Filtering**: Dynamic updates without page reloads
- **Professional UI**: Inspired by tools like Grafana and Datadog
- **Responsive Design**: Optimized for desktop with mobile considerations

### Performance Considerations
- **Client-side Debouncing**: Prevents excessive API calls during typing
- **Efficient Filtering**: Combined filters processed in single pass
- **Memory Management**: Logs loaded and filtered in memory for fast queries

## Project Structure

\`\`\`
├── app/
│   ├── api/logs/route.ts      # Backend API endpoints
│   ├── test/page.tsx          # Test interface for log ingestion
│   ├── page.tsx               # Main log query interface
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/ui/             # Reusable UI components
├── lib/utils.ts               # Utility functions
├── logs.json                  # Log data storage
└── README.md                  # This file
\`\`\`

## Testing

### Manual Testing
1. Use the test interface at `/test` to ingest sample data
2. Navigate to the main interface at `/` to query and filter logs
3. Test various filter combinations to verify functionality

### API Testing
Use curl or Postman to test the API endpoints directly:

\`\`\`bash
# Test log ingestion
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d @sample-log.json

# Test log querying
curl "http://localhost:3000/api/logs?level=error"
\`\`\`

## Future Enhancements

- WebSocket integration for real-time log streaming
- Basic analytics dashboard with charts
- Export functionality for filtered results
- Advanced search with regex support
- Log retention policies and archiving

## Technical Specifications Met

- Node.js + Express backend (Next.js API routes)  
- React frontend with hooks-based architecture  
- JSON file persistence (no external database)  
- Complete REST API with proper validation  
- Combined filtering with AND logic  
- Reverse chronological ordering  
- Professional UI with visual log level indicators  
- Real-time filtering without page reloads  
- Comprehensive error handling  
- Clean, maintainable code structure  

This implementation provides a complete, production-ready log ingestion and querying system that meets all specified requirements while demonstrating best practices in full-stack development.
