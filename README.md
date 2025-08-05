# 🚀 Media Synchronization Server

A real-time media synchronization server built with Node.js, Express, and Socket.IO. This server enables multiple users to watch videos together in perfect sync across different devices and browsers.

## ✨ Features

- **Real-time Synchronization**: Keep media playback in sync across multiple clients
- **Socket.IO Integration**: WebSocket-based communication for instant updates
- **Cross-platform Support**: Works on any device with a web browser
- **Room-based Sessions**: Users can join specific rooms for synchronized viewing
- **Auto-reconnection**: Handles network interruptions gracefully
- **CORS Enabled**: Supports cross-origin requests for flexible deployment

## 🌐 Render Deployment Ready

This server is optimized for deployment on Render.com with full Socket.IO support.

### 🎨 Deploy to Render

1. **Connect to Render:**
   - Visit [render.com](https://render.com)
   - Connect your GitHub repository
   - Uses `render.yaml` for automatic configuration
   - Free tier available with automatic SSL

2. **Automatic Deployment:**
   - Push to GitHub triggers automatic deployment
   - Environment variables configured via `render.yaml`
   - Server starts automatically with `node server.js`

## 📁 Project Structure

```
seriousserver/
├── server.js            # Main server file (Node.js + Socket.IO)
├── package.json         # Dependencies and scripts
├── public/
│   └── index.html       # Static status page
├── render.yaml          # Render deployment config
└── README.md           # This file
```

## 🔗 Deployment URL

After deployment to Render, your server will be available at:
- **Base URL:** `https://your-app-name.onrender.com`
- **Socket.IO Endpoint:** `wss://your-app-name.onrender.com`

## 🔌 Socket.IO Events

### Client → Server
- `joinRoom(roomId)` - Join a synchronization room
- `leaveRoom(roomId)` - Leave a room
- `media-state-change({ roomId, mediaState })` - Broadcast media state changes
- `force-sync({ roomId, mediaState })` - Force synchronization

### Server → Client
- `media-state-update({ mediaState })` - Receive media state updates
- `syncMedia({ mediaState })` - Legacy sync event (for backward compatibility)

## ⚙️ Configuration

No additional environment variables are required. The server uses built-in CORS handling for cross-origin requests.

## 🧪 Local Development

To test locally before deployment:

```bash
# Install dependencies
npm install

# Start local server
npm start
```

## 🐛 Troubleshooting

### Render
1. **Build Fails:** Check build logs in Render dashboard
2. **Port Issues:** Render automatically assigns PORT environment variable
3. **Sleep Mode:** Free tier apps sleep after 15 minutes of inactivity
4. **Socket.IO Connection:** Ensure client connects to correct Render URL

### General Issues
1. **CORS Errors:** The server includes CORS middleware for cross-origin requests
2. **Socket.IO Connection:** Ensure your client uses the correct server URL
3. **Port Conflicts:** Default port is 3001, but Render assigns its own

## 🧪 Testing Your Deployment

1. **Visit your deployment URL** to see the status page
2. **Check browser console** for any connection errors
3. **Test Socket.IO connection** using your media player client
4. **Monitor server logs** in Render dashboard

## 📚 Resources

- **Socket.IO Documentation:** [socket.io/docs](https://socket.io/docs/)
- **Express.js Documentation:** [expressjs.com](https://expressjs.com/)
- **Node.js Documentation:** [nodejs.org/docs](https://nodejs.org/docs/)
- **Render Documentation:** [render.com/docs](https://render.com/docs)

## 🚀 Quick Start Guide

1. **Deploy to Render** using the instructions above
2. **Install dependencies:** `npm install`
3. **Test locally:** `npm start`
4. **Update your client** to connect to the new server URL

Your media sync server will be live and ready for real-time synchronization! 🎬✨