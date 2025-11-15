# Chat Application Implementation

## Overview
Complete HTTP server-based chat application with authentication, channels, messaging, and peer-to-peer tracking.

## Features Implemented

### Authentication System
- Login page with username/password authentication
- Cookie-based session management (`auth=true`)
- Protected routes requiring authentication
- Default credentials: admin/password

### Chat Functionality
- **Channels**: Pre-configured channels (general, random, tech)
- **Messaging**: Send and receive messages in real-time
- **Create Channels**: Users can create new channels dynamically
- **Message History**: All messages stored per channel with timestamps
- **User Display**: Shows sender name and timestamp for each message

### Peer-to-Peer Tracking
- **Peer Registration**: Users registered as peers on login
- **Online Users**: List of currently active users
- **Peer TTL**: Automatic cleanup of stale peers (300 seconds)
- **Connectivity Testing**: Endpoint to test peer reachability

### Frontend
- **Modern UI**: Responsive design with gradient backgrounds
- **Channel Sidebar**: Easy navigation between channels
- **Users Sidebar**: See who's online
- **Message Area**: Clean message display with sender highlighting
- **Real-time Updates**: 5-second polling for new messages

## Technical Architecture

### Backend (Python)
- **Framework**: WeApRous (custom Flask-like decorator routing)
- **Threading**: Daemon threads for concurrent connection handling
- **Data Storage**: In-memory dictionaries with thread locks
- **HTTP Handling**: Custom HTTP adapter with Content-Length parsing

### Frontend (JavaScript)
- **Vanilla JS**: No frameworks, pure JavaScript
- **Fetch API**: Modern AJAX requests
- **Session Storage**: Client-side state management
- **Polling**: Periodic updates every 5 seconds

### Response Types Supported
1. **JSON**: Automatic serialization of Python dicts
2. **Custom Responses**: Status code, headers, and content control
3. **File Serving**: HTML, CSS, JavaScript file serving
4. **Binary Data**: Raw bytes support

## API Endpoints

### Authentication
- `POST /login` - Login with credentials
- `GET /login.html` - Login page
- `GET /` or `/index.html` - Main chat interface (requires auth)

### Chat API
- `GET /channels` - List all channels
- `GET /messages?channel=<name>` - Get messages for channel
- `POST /send` - Send message to channel
- `POST /create-channel` - Create new channel

### Peer Tracking
- `POST /submit-info` - Register peer information
- `GET /get-list` - Get list of active peers
- `POST /connect-peer` - Test peer connectivity
- `POST /broadcast-peer` - Broadcast to all peers

### Static Files
- `GET /static/css/*` - CSS files
- `GET /static/js/*` - JavaScript files
- `GET /favicon.ico` - Favicon

## Usage

### Starting the Server
```bash
python start_sampleapp.py --server-port 9000
```

### Accessing the Application
1. Open browser to `http://localhost:9000/login.html`
2. Login with username: `admin`, password: `password`
3. Start chatting in the #general channel
4. Create new channels with the "+ New Channel" button
5. Switch between channels by clicking on them

### Testing with curl
```bash
# Login
curl -c cookies.txt -X POST "http://localhost:9000/login" \
  -d "username=admin&password=password"

# Get channels
curl -b cookies.txt "http://localhost:9000/channels"

# Get messages
curl -b cookies.txt "http://localhost:9000/messages?channel=general"

# Send message
curl -b cookies.txt -X POST "http://localhost:9000/send" \
  -H "Content-Type: application/json" \
  -d '{"channel":"general","sender":"admin","text":"Hello","timestamp":1234567890}'
```

## Security Considerations

### Educational Purpose Only
This application is designed for learning and includes intentional simplifications:
- No HTTPS/TLS encryption
- Hardcoded credentials
- No password hashing
- No CSRF protection
- No input sanitization
- In-memory storage (no persistence)

### For Production Use
Would require:
- TLS/SSL certificates
- Proper password hashing (bcrypt, argon2)
- Database backend (PostgreSQL, MongoDB)
- Session management (Redis)
- Input validation and sanitization
- Rate limiting
- CSRF tokens
- WebSocket for real-time updates

## File Structure
```
├── start_sampleapp.py         # Main application with all routes
├── daemon/
│   ├── weaprous.py            # Routing framework
│   ├── backend.py             # TCP server with threading
│   ├── proxy.py               # Reverse proxy with round-robin
│   ├── httpadapter.py         # HTTP request/response handling
│   ├── request.py             # Request parser with query params
│   ├── response.py            # Response builder
│   └── dictionary.py          # Case-insensitive dict
├── www/
│   ├── login.html             # Login page
│   └── index.html             # Chat interface
└── static/
    ├── css/
    │   ├── login.css          # Login page styles
    │   └── chat.css           # Chat interface styles
    └── js/
        ├── login.js           # Login form handler
        └── chat.js            # Chat client
```

## Performance Characteristics
- **Concurrent Users**: Handles multiple simultaneous connections via threading
- **Message Latency**: 5-second polling interval for updates
- **Memory Usage**: Grows with message history (no cleanup)
- **Thread Safety**: All shared data protected by locks

## Known Limitations
1. **No Persistence**: All data lost on server restart
2. **Polling Instead of WebSocket**: 5-second delay for messages
3. **No Message Search**: Can't search message history
4. **No Direct Messaging**: Only channel-based communication
5. **No File Upload**: Text messages only
6. **No Edit/Delete**: Messages are immutable once sent

## Future Enhancements
- WebSocket support for real-time messaging
- Database integration (SQLite/PostgreSQL)
- User profile pages
- Private direct messaging
- File upload and sharing
- Message reactions and threading
- Admin dashboard
- User roles and permissions

## Credits
- Framework: WeApRous by pdnguyen @ HCMC University of Technology
- Course: CO3093/CO3094 - Computer Networks
- Implementation: Complete chat application system
