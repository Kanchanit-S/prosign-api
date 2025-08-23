# Socket.IO Task API Documentation

This document describes how to use the Socket.IO implementation for the Task API in your NestJS application.

## Overview

The Task API now supports real-time communication through Socket.IO, allowing clients to:
- Create, read, update, and delete tasks in real-time
- Receive instant notifications when tasks are modified
- Join task-specific rooms for collaborative work
- Maintain persistent connections with automatic reconnection

## Features

### 🔐 Authentication
- JWT token-based authentication for secure connections
- Support for both handshake auth and query parameters
- Automatic user room assignment based on authentication

### 📡 Real-time Events
- **Task Operations**: Create, read, update, delete tasks
- **Room Management**: Join/leave task-specific rooms
- **Broadcasting**: Real-time updates to all connected clients
- **Error Handling**: Comprehensive error reporting

### 🏠 Room System
- **User Rooms**: Each user gets their own room (`user:{userId}`)
- **Task Rooms**: Join specific task rooms (`task:{taskId}`)
- **Automatic Broadcasting**: Updates sent to relevant rooms

## Server Events

### Connection Events
- `connected` - Sent when client successfully connects
- `error` - Sent when authentication fails or errors occur

### Task Events
- `taskCreated` - Emitted when a new task is created
- `tasksFound` - Emitted when fetching all tasks
- `taskFound` - Emitted when fetching a specific task
- `taskUpdated` - Emitted when a task is updated
- `taskRemoved` - Emitted when a task is deleted

### Room Events
- `joinedTaskRoom` - Confirmation of joining a task room
- `leftTaskRoom` - Confirmation of leaving a task room

## Client Events

### Task Operations
- `createTask` - Create a new task
- `findAllTasks` - Fetch all tasks for the authenticated user
- `findOneTask` - Fetch a specific task by ID
- `updateTask` - Update an existing task
- `removeTask` - Delete a task

### Room Management
- `joinTaskRoom` - Join a specific task room
- `leaveTaskRoom` - Leave a specific task room

## Connection Options

### With JWT Token
```javascript
const socket = io('http://localhost:3000/tasks', {
  auth: {
    token: 'your-jwt-token-here'
  }
});
```

### With User ID (Development/Testing)
```javascript
const socket = io('http://localhost:3000/tasks', {
  query: {
    userId: 1
  }
});
```

### With Authorization Header
```javascript
const socket = io('http://localhost:3000/tasks', {
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token-here'
  }
});
```

## Example Usage

### Basic Connection
```javascript
const socket = io('http://localhost:3000/tasks', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  console.log('Connected to task service');
});

socket.on('connected', (data) => {
  console.log('Authenticated as user:', data.userId);
});
```

### Creating a Task
```javascript
socket.emit('createTask', {
  title: 'New Task',
  description: 'Task description',
  status: 'pending',
  priority: 'medium',
  dueDate: '2024-12-31'
});

socket.on('taskCreated', (data) => {
  console.log('Task created:', data.task);
});
```

### Fetching Tasks
```javascript
socket.emit('findAllTasks');

socket.on('tasksFound', (data) => {
  console.log('Tasks:', data.tasks);
  console.log('Count:', data.count);
});
```

### Joining Task Rooms
```javascript
socket.emit('joinTaskRoom', 123);

socket.on('joinedTaskRoom', (data) => {
  console.log('Joined room for task:', data.taskId);
});
```

## Error Handling

All operations include comprehensive error handling:

```javascript
socket.on('error', (data) => {
  console.error('Error:', data.message);
  if (data.error) {
    console.error('Details:', data.error);
  }
});
```

## Room Broadcasting

The server automatically broadcasts updates to relevant rooms:

- **User Updates**: All clients of a user receive updates for that user's tasks
- **Task Updates**: All clients in a specific task room receive updates for that task

## Security Features

- **Authentication Required**: All operations require valid authentication
- **User Isolation**: Users can only access their own tasks
- **Token Validation**: JWT tokens are validated on every connection
- **Room Access Control**: Users can only join rooms for tasks they own

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install socket.io
   ```

2. **Start the Server**
   ```bash
   npm run dev
   ```

3. **Test with HTML Client**
   - Open `socket-test.html` in your browser
   - Enter a JWT token or user ID
   - Click "Connect" to establish connection
   - Test various operations

## Testing

Use the provided `socket-test.html` file to test all Socket.IO functionality:

1. **Authentication**: Test with JWT tokens or user IDs
2. **CRUD Operations**: Create, read, update, delete tasks
3. **Room Management**: Join and leave task rooms
4. **Real-time Updates**: See instant updates across connections

## Configuration

The Socket.IO gateway is configured with:

- **Namespace**: `/tasks`
- **CORS**: Enabled for all origins (configurable)
- **Credentials**: Enabled for secure connections
- **Port**: 3000 (configurable via environment)

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if the server is running
   - Verify the port number
   - Check CORS configuration

2. **Authentication Failed**
   - Ensure JWT token is valid
   - Check token expiration
   - Verify token format

3. **Events Not Received**
   - Check event names match exactly
   - Ensure proper authentication
   - Verify namespace usage

### Debug Mode

Enable debug logging by setting the log level in your NestJS application:

```typescript
// In main.ts
const app = await NestFactory.create(AppModule, {
  logger: ['debug', 'log', 'warn', 'error']
});
```

## Performance Considerations

- **Connection Pooling**: Limit concurrent connections per user
- **Room Management**: Leave unused rooms to free resources
- **Event Filtering**: Only emit necessary events
- **Error Handling**: Implement proper error recovery

## Production Deployment

For production use:

1. **HTTPS**: Use secure WebSocket connections
2. **Load Balancing**: Implement proper load balancing for WebSocket connections
3. **Monitoring**: Add connection and event monitoring
4. **Rate Limiting**: Implement rate limiting for WebSocket events
5. **Scaling**: Consider Redis adapter for multiple server instances

## API Reference

### Server Methods

- `broadcastTaskUpdate(userId, event, data)` - Broadcast to user room
- `broadcastToTaskRoom(taskId, event, data)` - Broadcast to task room

### Client Properties

- `socket.id` - Unique client identifier
- `socket.data.user` - Authenticated user information
- `socket.rooms` - Current room memberships

## Support

For issues or questions:
1. Check the error logs in your server console
2. Verify your client implementation matches the examples
3. Ensure all dependencies are properly installed
4. Check your JWT configuration and token validity
