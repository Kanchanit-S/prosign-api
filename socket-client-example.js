const { io } = require('socket.io-client');

// Configuration
const SERVER_URL = 'http://localhost:3000';
const NAMESPACE = '/tasks';

// Example JWT token (replace with actual token from your auth endpoint)
const JWT_TOKEN = 'your-jwt-token-here';

// Example user ID for testing without JWT
const USER_ID = 1;

// Create socket connection
function createConnection(useJWT = true) {
  const options = {
    namespace: NAMESPACE
  };

  if (useJWT && JWT_TOKEN !== 'your-jwt-token-here') {
    options.auth = { token: JWT_TOKEN };
  } else {
    options.query = { userId: USER_ID };
  }

  return io(SERVER_URL, options);
}

// Main function
async function main() {
  console.log('🚀 Connecting to Task API via Socket.IO...\n');

  const socket = createConnection(false); // Use user ID for testing

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Connected to server');
    console.log(`📡 Socket ID: ${socket.id}\n`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server\n');
  });

  socket.on('connected', (data) => {
    console.log('🔐 Authenticated successfully');
    console.log(`👤 User ID: ${data.userId}`);
    console.log(`⏰ Timestamp: ${data.timestamp}\n`);
  });

  socket.on('error', (data) => {
    console.error('❌ Error:', data.message);
    if (data.error) {
      console.error('📋 Details:', data.error);
    }
    console.log('');
  });

  // Task events
  socket.on('taskCreated', (data) => {
    console.log('✅ Task created successfully');
    console.log(`📝 Task ID: ${data.task.id}`);
    console.log(`📋 Title: ${data.task.title}`);
    console.log(`⏰ Timestamp: ${data.timestamp}\n`);
  });

  socket.on('tasksFound', (data) => {
    console.log('📋 Tasks retrieved successfully');
    console.log(`📊 Total tasks: ${data.count}`);
    console.log(`⏰ Timestamp: ${data.testamp}\n`);
    
    // Display tasks
    data.tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.status})`);
    });
    console.log('');
  });

  socket.on('taskFound', (data) => {
    console.log('📋 Task retrieved successfully');
    console.log(`📝 Task ID: ${data.task.id}`);
    console.log(`📋 Title: ${data.task.title}`);
    console.log(`📊 Status: ${data.task.status}`);
    console.log(`🎯 Priority: ${data.task.priority}`);
    console.log(`⏰ Timestamp: ${data.timestamp}\n`);
  });

  socket.on('taskUpdated', (data) => {
    console.log('✅ Task updated successfully');
    console.log(`📝 Task ID: ${data.task.id}`);
    console.log(`📋 Title: ${data.task.title}`);
    console.log(`⏰ Timestamp: ${data.timestamp}\n`);
  });

  socket.on('taskRemoved', (data) => {
    console.log('🗑️ Task removed successfully');
    console.log(`📝 Task ID: ${data.id}`);
    console.log(`⏰ Timestamp: ${data.timestamp}\n`);
  });

  // Room events
  socket.on('joinedTaskRoom', (data) => {
    console.log('🚪 Joined task room successfully');
    console.log(`📝 Task ID: ${data.taskId}`);
    console.log(`💬 Message: ${data.message}`);
    console.log(`⏰ Timestamp: ${data.timestamp}\n`);
  });

  socket.on('leftTaskRoom', (data) => {
    console.log('🚪 Left task room successfully');
    console.log(`📝 Task ID: ${data.taskId}`);
    console.log(`⏰ Timestamp: ${data.timestamp}\n`);
  });

  // Wait for connection and authentication
  await new Promise(resolve => {
    socket.on('connected', resolve);
  });

  // Example operations
  console.log('🧪 Testing Task API operations...\n');

  // 1. Create a new task
  console.log('1️⃣ Creating a new task...');
  const newTask = {
    title: 'Complete Project Documentation',
    description: 'Write comprehensive documentation for the project',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-12-31'
  };
  socket.emit('createTask', newTask);

  // Wait a bit before next operation
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 2. Fetch all tasks
  console.log('2️⃣ Fetching all tasks...');
  socket.emit('findAllTasks');

  // Wait a bit before next operation
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 3. Join a task room (assuming task ID 1 exists)
  console.log('3️⃣ Joining task room...');
  socket.emit('joinTaskRoom', 1);

  // Wait a bit before next operation
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 4. Leave the task room
  console.log('4️⃣ Leaving task room...');
  socket.emit('leaveTaskRoom', 1);

  // Wait a bit before disconnecting
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Disconnect
  console.log('🔌 Disconnecting...');
  socket.disconnect();
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createConnection };
