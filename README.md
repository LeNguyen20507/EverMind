# EverMind - Alzheimer's Care Support App

<div align="center">
  <img src="public/assets/evermind_minimal_logo.png" alt="EverMind Logo" width="120" />
  <p><strong>AI-Powered Emergency Grounding Support for Alzheimer's & Dementia Patients</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#usage">Usage</a>
  </p>
</div>

---

## Overview

**EverMind** is a caregiver companion app designed to help families and professional caregivers support loved ones with Alzheimer's disease and dementia. The app features an **AI-powered SOS voice assistant** that provides emergency grounding conversations using evidence-based techniques like validation therapy, reminiscence therapy, and sensory grounding.

### The Problem

Caregivers of Alzheimer's patients often face challenging moments when their loved ones experience:
- Sudden confusion or disorientation
- Anxiety and agitation episodes
- Sundowning symptoms
- Memory-related distress

In these moments, having immediate access to a calming, patient presence can make all the difference.

### Our Solution

EverMind provides:
- **🆘 SOS Voice Assistant**: One-tap access to an AI-powered calming conversation using the patient's personalized profile
- **📊 Mood & Activity Tracking**: Log daily moods, conversations, and observations that inform the AI's approach
- **👤 Patient Profiles**: Store detailed information about multiple patients including triggers, comfort memories, and calming strategies
- **🎵 Personalized Comfort**: Music preferences, family photos, and voice recordings for therapeutic use

---

## Features

### 🆘 Emergency SOS Voice Assistant

The core feature - a specialized AI agent trained in Alzheimer's grounding techniques:

- **Validation Therapy**: Acknowledges and validates the patient's feelings without correction
- **Reminiscence Therapy**: Uses personalized memories and topics to redirect and calm
- **Sensory Grounding**: Guided breathing and present-moment awareness techniques
- **Adaptive Responses**: Uses recent tracking data to tailor the conversation approach
- **Natural Voice**: High-quality text-to-speech with warm, calming voices

```
Patient: "I need to get to school, the children are waiting!"
AI: "I can hear you're worried about the children, Margaret. That shows 
     how much you care. You're safe at home right now. Tell me about 
     your favorite students - I'd love to hear about them."
```

### 📊 Care Tracking

- **Mood Logging**: Track patient moods throughout the day with notes
- **Conversation Notes**: Document significant interactions with tags (medical, behavior, emergency)
- **Emergency Context**: Important information that gets prioritized during SOS calls
- **Mood History**: View patterns over time to identify triggers and improvements

### 👤 Multi-Patient Management

- Support for multiple patient profiles
- Quick switching between patients
- Personalized data for each:
  - Medical information (medications, allergies, doctor)
  - Emergency contacts
  - Comfort memories and calming strategies
  - Known triggers to avoid
  - Favorite music and voice recordings

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 + Vite 5 |
| **Routing** | React Router v6 |
| **Icons** | Lucide React |
| **Voice AI** | VAPI (Voice AI Platform) |
| **AI Model** | Claude claude-sonnet-4-20250514 (Anthropic) |
| **Speech-to-Text** | Deepgram Nova 2 |
| **Text-to-Speech** | Azure Neural Voices |
| **Data Storage** | localStorage (client-side) |
| **MCP Server** | Model Context Protocol (optional) |

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- VAPI account (for voice features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/adtreat.git
   cd adtreat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   # Required for voice features
   VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
   
   # Optional
   VITE_ANTHROPIC_API_KEY=your_anthropic_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Getting VAPI API Key

1. Sign up at [vapi.ai](https://vapi.ai)
2. Go to Dashboard → API Keys
3. Copy your Public Key
4. Add to `.env.local` as `VITE_VAPI_PUBLIC_KEY`

---

## Architecture

### Project Structure

```
adtreat/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation with SOS button
│   │   ├── SOSModal.jsx         # Emergency voice call modal
│   │   ├── PatientSwitcher.jsx  # Patient selection modal
│   │   ├── EmergencyModal.jsx   # Quick emergency contacts
│   │   └── VoiceSession.jsx     # Full voice session page
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Patient overview dashboard
│   │   └── Tracking.jsx         # Mood & notes logging
│   │
│   ├── context/
│   │   └── PatientContext.jsx   # Global patient state management
│   │
│   ├── utils/
│   │   ├── vapiClient.js        # VAPI voice call integration
│   │   ├── promptGenerator.js   # AI system prompt builder
│   │   ├── activityTracker.js   # Mood/notes storage
│   │   ├── mcpClient.js         # MCP server client
│   │   └── profiles.js          # Demo patient profiles
│   │
│   └── styles/
│       ├── index.css            # Core styles
│       ├── navigation.css       # Nav components
│       └── tracking.css         # Tracking page
│
├── mcp-server/                  # Optional MCP server
│   ├── src/
│   │   ├── index.js             # Server entry point
│   │   └── profiles.js          # Patient profile data
│   └── package.json
│
└── public/
    └── assets/                  # Logos and images
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        EverMind App                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Tracking    │───▶│  Activity    │───▶│   Profile    │       │
│  │    Page      │    │   Tracker    │    │  Generator   │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   │                    │               │
│         ▼                   ▼                    ▼               │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                  PatientContext                         │     │
│  │  • Current patient selection                            │     │
│  │  • Patient profiles & medical info                      │     │
│  │  • Mood logs & conversation notes                       │     │
│  └────────────────────────────────────────────────────────┘     │
│                            │                                     │
│                            ▼                                     │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                   SOS Modal                             │     │
│  │                                                         │     │
│  │  1. Maps patient data → MCP profile format              │     │
│  │  2. Pulls recent tracking data (moods, notes)           │     │
│  │  3. Generates personalized system prompt                │     │
│  │  4. Initiates VAPI voice call                           │     │
│  └────────────────────────────────────────────────────────┘     │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         VAPI Cloud                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Deepgram   │    │   Claude     │    │    Azure     │       │
│  │  Nova 2 STT  │───▶│claude-sonnet-4-20250514│───▶│   TTS      │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
│  Speech Recognition → AI Response → Natural Voice               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### AI Prompt System

The system prompt is dynamically generated with:

1. **Patient Profile Data**
   - Name, age, diagnosis stage
   - Core identity and background
   - Safe places and comfort memories
   - Known triggers to avoid
   - Calming topics and strategies

2. **Tracking Context**
   - Recent mood patterns (last 3 days)
   - Today's caregiver notes
   - Emergency-tagged observations

3. **Grounding Techniques**
   - Validation therapy approaches
   - Reminiscence conversation starters
   - Sensory grounding scripts
   - Reassurance phrases

---

## Usage

### For Caregivers

1. **Select Patient**: Tap the avatar in the top-right to switch patients
2. **Daily Tracking**: Use the Tracking page to log moods and notes
3. **Emergency SOS**: Tap the "Help" button anytime for AI grounding support

### SOS Voice Call Flow

1. Caregiver taps **Help** button
2. Modal opens with patient info displayed
3. Tap **Start Grounding Call**
4. AI initiates calming conversation using patient's profile
5. Real-time transcripts show AI responses
6. End call when patient is calm

### Tracking Tips

- Log moods at different times of day to identify patterns
- Use the **Emergency** tag for critical observations
- Add notes after difficult episodes to inform future AI conversations
- The AI uses recent tracking data to adapt its approach

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_VAPI_PUBLIC_KEY` | Yes | VAPI API public key for voice calls |
| `VITE_ANTHROPIC_API_KEY` | No | Direct Anthropic API access |
| `VITE_MCP_SERVER_URL` | No | MCP server URL if using external server |

### Voice Configuration

The app uses Azure Neural Voices by default:
- **Female**: `en-US-JennyNeural` (warm, caring tone)
- **Male**: `en-US-GuyNeural` (calm, reassuring tone)

Voice selection is based on patient profile data.

---

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Optional: MCP Server

The MCP (Model Context Protocol) server provides an alternative way to serve patient profiles:

```bash
cd mcp-server
npm install
npm start
```

---

## Demo Patients

The app includes three demo patients for testing:

1. **Margaret Thompson** (Maggie) - 78, Early-Stage
   - Former teacher, loves music from the 1960s
   - Triggers: loud noises, being rushed
   
2. **William O'Connor** (Bill) - 81, Moderate Stage
   - Former firefighter, Red Sox fan
   - Triggers: evening time (sundowning), crowds

3. **Dorothy Mae Johnson** (Dot) - 84, Moderate-Severe
   - Church choir singer, loves gospel music
   - Triggers: being alone, darkness

---

## Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Priority Areas

- [ ] ElevenLabs voice integration for more natural TTS
- [ ] Offline support with service workers
- [ ] Family photo gallery integration
- [ ] Music playback during calls
- [ ] Multi-language support

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built for the **Hackathon 2025** challenge
- Inspired by real caregiving experiences
- Uses evidence-based dementia care techniques
- Thanks to VAPI, Anthropic, and Azure for their APIs

---

<div align="center">
  <p><strong>EverMind</strong> - Because every moment of connection matters.</p>
  <p>Made with love for caregivers and their loved ones</p>
</div>
