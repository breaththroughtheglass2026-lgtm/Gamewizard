# 🎮 CANVAS - Setup Guide

## Quick Start: API Key & Secrets Setup

### Step 1️⃣ Get Your Groq API Key
1. Go to https://console.groq.com/ (it's free!)
2. Sign up or log in
3. Copy your API key

### Step 2️⃣ Create `.env.local` (Secrets File)
```bash
# In the root directory of this project, create a file called .env.local
# This file is in .gitignore, so your API key will NOT be committed

GROQ_API_KEY=paste_your_key_here
PORT=3001
NODE_ENV=development
```

**Example `.env.local`:**
```
GROQ_API_KEY=gsk_abc123def456xyz789...
PORT=3001
NODE_ENV=development
```

### Step 3️⃣ Install Dependencies
```bash
npm install
```

### Step 4️⃣ Test Your API Key
```bash
# Start the server
npm start

# In another terminal, test if your API key works:
curl http://localhost:3001/api/test-key
```

You should see:
```json
{
  "configured": true,
  "working": true,
  "response": "API Key is working!"
}
```

### Step 5️⃣ Run the Application
```bash
npm start
```

Then open: http://localhost:3001

## 🔐 Security Best Practices

### What Gets Stored Where
- ✅ `.env.local` - **Your secrets go HERE** (not committed)
- ✅ `secrets/` - Alternative location for local secrets (also ignored)
- ❌ `index.html` - **NEVER put API keys here** (it's public!)
- ✅ `server.js` - Safe to read from `.env.local` (runs on server)

### File Structure
```
Gamewizard/
├── .env.local          ← YOUR API KEYS (in .gitignore)
├── .env.example        ← Template for others
├── .gitignore          ← Specifies files to ignore
├── secrets/            ← Alternative folder for secrets (ignored)
├── server.js           ← Backend (reads .env.local safely)
├── index.html          ← Frontend (calls /api/ endpoints)
├── package.json        ← Dependencies
└── README.md
```

## 🐛 Troubleshooting

### Issue: "GROQ_API_KEY not configured"
**Solution:** 
- Create `.env.local` in root directory
- Add: `GROQ_API_KEY=your_actual_key`
- Restart server: `npm start`

### Issue: "API Error: 401"
**Solution:** 
- Your API key is invalid or expired
- Get a new one from https://console.groq.com/
- Update `.env.local`

### Issue: "Cannot POST /api/generate-game"
**Solution:**
- Server isn't running! Run: `npm start`
- Make sure you're accessing http://localhost:3001 (not localhost:5500)

### Issue: "Module not found: groq-sdk"
**Solution:**
```bash
npm install
```

## 🚀 What's Happening

1. **Frontend** (index.html)
   - User types a game idea
   - Sends POST request to `/api/generate-game`
   - Backend processes it

2. **Backend** (server.js)
   - Reads API key from `.env.local`
   - Calls Groq API securely
   - Returns response to frontend
   - **API key never exposed to user!**

3. **Secrets** (`.env.local`)
   - Stored locally only
   - Never committed to git
   - Only readable by server

## 📝 Available API Endpoints

- `POST /api/generate-game` - Generate game design from prompt
- `POST /api/generate-code` - Generate game code (specify language)
- `GET /api/test-key` - Test if API key is working
- `GET /api/health` - Server health check

**Example:**
```bash
curl -X POST http://localhost:3001/api/generate-game \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A retro space shooter game"}'
```

## ✅ You're All Set!

Your app is now:
- ✅ Using real Groq API
- ✅ Storing secrets securely
- ✅ Running on http://localhost:3001
- ✅ Ready to build games! 🎮

## 📚 Next Steps

1. Try creating a game in CANVAS
2. Export your game as HTML
3. Deploy to GitHub Pages (see README.md for instructions)
4. Wrap it with Capacitor for mobile deployment
