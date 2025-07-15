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

