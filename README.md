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
├── vercel.json          # Vercel deployment config
├── railway.json         # Railway deployment config
├── render.yaml          # Render deployment config
├── firebase.json        # Firebase hosting config (static only)
├── .firebaserc         # Firebase project config
└── README.md           # This file
```

## Platform Comparison

| Platform | Cost | Setup | Socket.IO Support | Custom Domain |
|----------|------|-------|-------------------|---------------|
| **Vercel** | Free tier | ⭐⭐⭐ Easy | ✅ Full support | ✅ Yes |
| **Railway** | Free tier | ⭐⭐⭐ Easy | ✅ Full support | ✅ Yes |
| **Render** | Free tier | ⭐⭐ Medium | ✅ Full support | ✅ Yes |
| **Firebase** | Static only | ⭐ Hard | ❌ No (static only) | ✅ Yes |

## API Endpoints

After deployment, your server will be available at:

### Vercel
- **Base URL:** `https://your-app-name.vercel.app`
- **Socket.IO:** Connect to the base URL for real-time features

### Railway
- **Base URL:** `https://your-app-name.up.railway.app`
- **Socket.IO:** Connect to the base URL for real-time features

### Render
- **Base URL:** `https://your-app-name.onrender.com`
- **Socket.IO:** Connect to the base URL for real-time features

### Firebase (Static Only)
- **Base URL:** `https://your-project-id.web.app`
- **Note:** Only serves the status page, no server functionality

## Socket.IO Events

### Client → Server
- `joinRoom(roomId)` - Join a synchronization room
- `leaveRoom(roomId)` - Leave a room
- `media-state-change({ roomId, mediaState })` - Broadcast media state changes
- `force-sync({ roomId, mediaState })` - Force synchronization

### Server → Client
- `media-state-update({ mediaState })` - Receive media state updates
- `syncMedia({ mediaState })` - Legacy sync event (for backward compatibility)

## Environment Variables

No additional environment variables are required. The server uses Firebase's built-in authentication and CORS handling.

## Local Development

To test locally before deployment:

```bash
# Install dependencies
cd functions && npm install && cd ..

# Start Firebase emulators
firebase emulators:start
```

## Troubleshooting

### Vercel
1. **Build Errors:** Check that `package.json` has correct dependencies
2. **Socket.IO Issues:** Ensure your client connects to the correct Vercel URL
3. **Environment Variables:** Set in Vercel dashboard if needed

### Railway
1. **Deployment Fails:** Check Railway logs in dashboard
2. **Port Issues:** Railway automatically assigns PORT environment variable
3. **Memory Limits:** Free tier has 512MB RAM limit

### Render
1. **Build Timeout:** Free tier has build time limits
2. **Cold Starts:** Free tier sleeps after 15 minutes of inactivity
3. **Logs:** Check Render dashboard for detailed logs

### General Issues
1. **CORS Errors:** Update CORS settings in `server.js` for production domains
2. **Socket.IO Connection:** Ensure client uses correct server URL
3. **Dependencies:** Run `npm install` to ensure all packages are installed

## Security Notes

- Update CORS origins in production to match your client domains
- Consider implementing authentication for room access
- Use environment variables for sensitive configuration
- Monitor platform usage to stay within free tier limits
- Enable HTTPS in production (automatically handled by most platforms)

## Support

For issues related to:
- **Vercel:** Check [Vercel Documentation](https://vercel.com/docs)
- **Railway:** Check [Railway Documentation](https://docs.railway.app)
- **Render:** Check [Render Documentation](https://render.com/docs)
- **Socket.IO:** Check [Socket.IO Documentation](https://socket.io/docs/)
- **Media sync logic:** Review the original server implementation

## Quick Start

1. **Clone/Download** this repository
2. **Install dependencies:** `npm install`
3. **Test locally:** `npm start`
4. **Deploy** to your preferred platform using the instructions above
5. **Update your client** to connect to the new server URL

Your media sync server will be live and ready for real-time synchronization! 🎬✨