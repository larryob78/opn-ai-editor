# 🎬 LuminaCut AI - Professional Video Editor

**LuminaCut AI** is a powerful, AI-driven video editing platform that combines professional video editing tools with the intelligence of GPT-4. Edit videos using natural language instructions, apply advanced filters, and export in multiple formats - all through an intuitive, modern interface.

## ✨ Features

### 🤖 AI-Powered Editing
- **Natural Language Processing**: Describe edits in plain English (e.g., "Make the video 30 seconds long", "Add grayscale filter", "Speed up by 2x")
- **Intelligent Interpretation**: AI understands your intent and executes the right editing operations
- **Context-Aware**: AI analyzes video metadata to make informed editing decisions

### 🎥 Professional Editing Tools
- **Trim & Cut**: Remove unwanted sections from your videos
- **Speed Control**: Speed up or slow down video playback
- **Merge Videos**: Combine multiple video files seamlessly
- **Crop & Resize**: Adjust video dimensions and aspect ratios
- **Text Overlays**: Add custom text with position and timing controls

### 🎨 Visual Effects & Filters
- Grayscale
- Sepia
- Brightness/Contrast/Saturation adjustments
- Blur & Sharpen
- Vignette
- Custom filter intensity controls

### 🔊 Audio Processing
- Volume control
- Mute/unmute tracks
- Audio fade in/out
- Audio normalization

### 💾 Export Options
- **Multiple Formats**: MP4, MOV, WebM, AVI, MKV
- **Quality Presets**: Low (fast), Medium, High, Ultra
- **Quick Preview**: Generate low-quality previews for fast review

### 📁 Project Management
- Save and load projects
- Track editing history
- Persistent storage with SQLite
- Project metadata and thumbnails

### 🚀 Modern UI/UX
- Sleek, dark-themed interface
- Drag & drop file upload
- Multiple file support
- Real-time notifications
- Timeline visualization
- Responsive design

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**: REST API server
- **FFmpeg** (via fluent-ffmpeg): Professional video processing
- **OpenAI GPT-4**: AI instruction processing
- **SQLite**: Lightweight database for projects
- **Multer**: File upload handling

### Frontend
- **Vanilla JavaScript**: No framework overhead
- **Modern CSS**: Gradients, animations, glass-morphism effects
- **HTML5 Video**: Native video playback

## 📦 Installation

### Prerequisites
1. **Node.js** (v16 or higher)
2. **FFmpeg** installed on your system
3. **OpenAI API Key**

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use:
```bash
choco install ffmpeg
```

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/larryob78/opn-ai-editor.git
   cd opn-ai-editor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key:
   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=500000000
   DB_PATH=./server/database/projects.db
   ```

4. **Initialize the database:**
   ```bash
   npm run init-db
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Open the application:**
   Navigate to `http://localhost:3000` in your browser

## 🎯 Usage

### Basic Workflow

1. **Upload Videos**
   - Click the upload area or drag & drop video files
   - Multiple files supported (MP4, MOV, AVI, MKV, WebM)
   - Preview uploaded videos instantly

2. **Create a Project**
   - Click "+ New Project" in the header
   - Enter a project name
   - Projects auto-save to database

3. **Edit with AI**
   - Type natural language instructions:
     - "Trim the first 10 seconds"
     - "Make it grayscale"
     - "Speed up by 1.5x"
     - "Add text 'Hello World' at the top"
     - "Crop to 1920x1080"
   - Click "Apply with AI"
   - AI processes and executes the edit

4. **Apply Filters**
   - Select a filter from the dropdown
   - Click "Apply Filter"
   - Preview the result instantly

5. **Export**
   - Choose format (MP4, MOV, WebM, etc.)
   - Select quality preset
   - Click "Export Video"
   - Download automatically starts

### Example AI Instructions

**Trimming:**
```
Make the video 30 seconds long
Cut the first 5 seconds
Remove everything after 1 minute
```

**Effects:**
```
Add a grayscale filter
Make it sepia toned
Increase brightness by 50%
Add a blur effect
```

**Speed:**
```
Speed up by 2x
Slow down to half speed
Make it play at 1.5x speed
```

**Text:**
```
Add "Welcome" text at the center
Put "Copyright 2024" at the bottom right
Add title text that lasts 5 seconds
```

**Audio:**
```
Mute the audio
Increase volume by 50%
Add fade in at the start
Normalize the audio
```

## 🔧 API Endpoints

### Upload
- `POST /api/upload/video` - Upload video file
- `DELETE /api/upload/video/:filename` - Delete uploaded file

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/edits` - Add edit to project
- `GET /api/projects/:id/edits` - Get project edit history

### AI Processing
- `POST /api/ai/process-instruction` - Process natural language instruction
- `POST /api/ai/chat` - Chat with AI assistant

### Video Editing
- `POST /api/video/metadata` - Get video metadata
- `POST /api/video/trim` - Trim video
- `POST /api/video/cut` - Cut section from video
- `POST /api/video/merge` - Merge multiple videos
- `POST /api/video/speed` - Change video speed
- `POST /api/video/filter` - Apply visual filter
- `POST /api/video/audio` - Audio operations
- `POST /api/video/text` - Add text overlay
- `POST /api/video/crop` - Crop video
- `POST /api/video/resize` - Resize video
- `POST /api/video/thumbnail` - Generate thumbnail

### Export
- `POST /api/export` - Export video in specified format
- `POST /api/export/preview` - Generate quick preview
- `GET /api/export/project/:projectId` - Get export history
- `DELETE /api/export/:filename` - Delete export

## 🏗️ Project Structure

```
opn-ai-editor/
├── server/
│   ├── index.js              # Express server
│   ├── database/
│   │   └── db.js             # Database setup & queries
│   └── routes/
│       ├── upload.js         # File upload endpoints
│       ├── projects.js       # Project management
│       ├── ai.js             # OpenAI integration
│       ├── video.js          # Video editing operations
│       └── export.js         # Export functionality
├── uploads/                  # Uploaded files (gitignored)
│   ├── temp/                 # Temporary processed files
│   └── exports/              # Exported videos
├── index.html               # Frontend application
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🔐 Security Notes

- API keys are stored server-side (not exposed to browser)
- File uploads are validated for type and size
- SQLite database is local and secure
- CORS enabled for local development

## 🚀 Deployment

### Local Network Access

To allow access from other devices on your network:

```bash
# Update server to bind to 0.0.0.0
# In server/index.js, change:
app.listen(PORT, '0.0.0.0', () => { ... })

# Find your local IP
# macOS/Linux: ifconfig
# Windows: ipconfig

# Access from other devices at:
http://YOUR_LOCAL_IP:3000
```

### Production Deployment

For production deployment, consider:
- Using HTTPS (Let's Encrypt)
- Adding authentication/authorization
- Using a production database (PostgreSQL, MySQL)
- Implementing file storage (AWS S3, Cloudinary)
- Adding rate limiting
- Using a process manager (PM2)
- Setting up a reverse proxy (Nginx)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by LuminaCut AI
- Powered by OpenAI GPT-4
- Built with FFmpeg for professional video processing

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for the video editing community**
