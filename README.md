# MELODY - Music Player Application

A modern, feature-rich music player built with React that allows users to stream Bollywood songs and discover new music through YouTube integration.

## Features

### 🎵 Local Music Playback

- Stream high-quality Bollywood songs
- Full audio controls (play, pause, seek, volume)
- Auto-play functionality for continuous listening
- Next/Previous track navigation
- Playlist management

### 🔥 Music Discovery

- YouTube integration for discovering new music
- Search for trending Bollywood songs
- Auto-play functionality for seamless listening experience
- Add discovered songs to favorites

### ⭐ Favorites Management

- Save your favorite songs from both local and YouTube sources
- Persistent storage using localStorage
- Easy access to your curated collection

### 🎛️ Smart Playback Control

- **Exclusive Playback**: Only one source plays at a time
  - When playing from Discover section, any Songs section playback is automatically paused
  - When playing from Songs section, any Discover section playback is automatically stopped
- **Auto-play Features**:
  - Discover section: Automatically plays next track in search results
  - Songs section: Automatically plays next track in the playlist
- **Manual Control**: Toggle auto-play on/off for both sections

### 🎨 Modern UI/UX

- Glass morphism design with beautiful gradients
- Responsive layout for all devices
- Smooth animations and transitions
- Intuitive navigation and controls

## Technical Implementation

### Audio Coordination System

The application uses a custom event system to ensure only one audio source plays at a time:

1. **Custom Events**: Both AudioContext and YouTubePlayerContext dispatch `audioPlayerStarted` events
2. **Cross-Context Communication**: Each context listens for events from the other and stops playback accordingly
3. **Seamless Switching**: Users can switch between sections without manual intervention

### Auto-play Logic

- **Discover Section**: Uses a timer-based system (3.5 minutes) to automatically advance to the next track
- **Songs Section**: Uses the HTML5 audio `ended` event to trigger next track playback
- **User Control**: Both sections provide toggle controls to enable/disable auto-play

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd MELODY
```

2. Install dependencies:

```bash
npm install
```

3. Configure YouTube API (optional):

   - Get a YouTube Data API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Add it to `src/services/config.js`

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Available Scripts

### `npm start`

Runs the app in development mode.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AudioPlayer.jsx  # Main audio player component
│   └── Navbar.jsx       # Navigation component
├── context/            # React contexts for state management
│   ├── AudioContext.jsx      # Local audio playback state
│   └── YouTubePlayerContext.jsx  # YouTube playback state
├── pages/              # Main application pages
│   ├── Home.jsx        # Landing page
│   ├── Songs.jsx       # Local music library
│   ├── Discover.jsx    # YouTube music discovery
│   └── Favorites.jsx   # Saved favorites
├── services/           # API and utility services
│   ├── config.js       # Configuration settings
│   └── musicService.js # Music data service
└── assets/             # Static assets
    └── songs.json      # Local song metadata
```

## Technologies Used

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Context API** - State management
- **HTML5 Audio API** - Local audio playback
- **YouTube Data API** - Music discovery
- **CSS3** - Styling with modern features (Grid, Flexbox, Animations)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YouTube Data API for music discovery
- React community for excellent documentation and tools
- Bollywood music artists for the amazing content

---

## **Implementation Plan**

### 1. **Backend (Node.js + Express + MongoDB)**

- **Endpoint to upload a song** (audio file + name)
- **Endpoint to fetch all uploaded songs**
- **Store audio files** in a local folder (for demo) or S3 (for production)
- **MongoDB model** for song metadata (name, file path, upload date)

### 2. **Frontend (React)**

- **Add a “My Songs” tab/section** in the Songs page
- **Attractive UI**: List of uploaded songs with play button and song name
- **Upload form**: For song name and audio file (MP3, WAV, etc.)
- **Fetch and display**: All uploaded songs from backend

---

## **Step 1: Backend Example**

**Install dependencies:**

```bash
npm install express mongoose multer cors
```

**server.js**

```js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://localhost:27017/melody", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const songSchema = new mongoose.Schema({
  name: String,
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});
const Song = mongoose.model("Song", songSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/api/mysongs", upload.single("audio"), async (req, res) => {
  const { name } = req.body;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const fileUrl = `/uploads/${req.file.filename}`;
  const song = new Song({ name, fileUrl });
  await song.save();
  res.json(song);
});

app.get("/api/mysongs", async (req, res) => {
  const songs = await Song.find().sort({ uploadedAt: -1 });
  res.json(songs);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
```

---

## **Step 2: Frontend Integration**

### **A. Add “My Songs” Tab in Songs Section**

- Add a tab or button in your Songs page for “My Songs”.
- When selected, show the upload form and the list of uploaded songs.

### **B. Upload Form and Song List (React Example)**

**src/pages/MySongs.jsx**

```jsx
import React, { useState, useEffect } from "react";

function MySongs() {
  const [songs, setSongs] = useState([]);
  const [name, setName] = useState("");
  const [audio, setAudio] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/mysongs")
      .then((res) => res.json())
      .then(setSongs);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!name || !audio) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("audio", audio);
    const res = await fetch("http://localhost:5000/api/mysongs", {
      method: "POST",
      body: formData,
    });
    const newSong = await res.json();
    setSongs([newSong, ...songs]);
    setName("");
    setAudio(null);
    setUploading(false);
  };

  return (
    <div className="my-songs-section">
      <h2 className="gradient-text">My Songs</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Song name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudio(e.target.files[0])}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Song"}
        </button>
      </form>
      <div className="my-songs-list">
        {songs.map((song) => (
          <div key={song._id} className="my-song-card glass-effect">
            <div className="my-song-info">
              <span className="my-song-title">{song.name}</span>
              <audio controls src={`http://localhost:5000${song.fileUrl}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MySongs;
```

**Add a tab or route in your Songs page to show `<MySongs />` when selected.**

---

### **C. CSS (Add to Songs.css or MySongs.css)**

```css
.my-songs-section {
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
}
.upload-form {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}
.upload-form input[type="text"] {
  flex: 2;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.upload-form input[type="file"] {
  flex: 2;
}
.upload-form button {
  flex: 1;
  background: #1db954;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
}
.my-songs-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.my-song-card {
  padding: 1rem 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.my-song-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #fff;
  margin-right: 1rem;
}
```

---

## **Next Steps**

1. **Set up the backend** (Node.js/Express/MongoDB) as above.
2. **Add the MySongs component** and a tab/route in your Songs page.
3. **Style as shown** for a modern, attractive look.

---

### Let me know if you want:

- The backend code in a separate file
- Integration with your existing Songs page (tabbed UI)
- Any additional features (delete, edit, etc.)

**Ready to proceed with code integration?** If yes, let me know if you want the backend or frontend part first, or both together!
