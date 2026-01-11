# EverMind Architecture Guide

This document provides a comprehensive guide to the EverMind application architecture, explaining how all components work together to deliver AI-powered emergency grounding support for Alzheimer's patients.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Core Architecture](#core-architecture)
3. [Data Flow](#data-flow)
4. [Component Architecture](#component-architecture)
5. [MCP Server Integration](#mcp-server-integration)
6. [AI Voice System](#ai-voice-system)
7. [State Management](#state-management)
8. [File Structure](#file-structure)
9. [Building New Features](#building-new-features)

---

## System Overview

EverMind is built on a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│  React Components (UI) + React Router (Navigation)             │
├─────────────────────────────────────────────────────────────────┤
│                     DATA LAYER                                   │
│  PatientContext + Activity Tracker + MCP Client                 │
├─────────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER                                │
│  EverMind MCP Server + VAPI Voice Platform + Prompt Generator   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Architecture

### Key Design Principles

1. **Context-Driven**: All patient data flows through `PatientContext`
2. **MCP-First**: Tracking data routes through the MCP Server before reaching AI
3. **Separation of Concerns**: Profile mapping, prompt generation, and voice calls are separate modules
4. **Event-Driven Voice**: VAPI integration uses event listeners for real-time updates

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| UI | React 18 | Component-based user interface |
| Routing | React Router v6 | Client-side navigation |
| State | React Context | Global patient state management |
| Storage | localStorage | Client-side data persistence |
| Voice AI | VAPI | Real-time voice conversations |
| AI Model | Claude claude-sonnet-4-20250514 | Conversation intelligence |
| STT | Deepgram Nova 2 | Speech-to-text |
| TTS | Azure Neural Voices | Text-to-speech |
| Protocol | MCP | Model Context Protocol for AI data |

---

## Data Flow

### Complete Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            USER INTERACTIONS                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   [Tracking Page]              [Patient Switcher]         [SOS Button]  │
│         │                            │                          │        │
│         ▼                            ▼                          │        │
│   ┌─────────────┐            ┌─────────────────┐                │        │
│   │ Activity    │            │ PatientContext  │                │        │
│   │ Tracker     │◀──────────▶│ (Global State)  │                │        │
│   │ - logMood() │            │ - currentPatient│                │        │
│   │ - addNote() │            │ - patients[]    │                │        │
│   │ - getHistory│            │ - switchPatient │                │        │
│   └─────────────┘            └─────────────────┘                │        │
│         │                            │                          │        │
│         │                            │                          │        │
│         ▼                            ▼                          ▼        │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                    EVERMIND MCP SERVER                            │  │
│   │  ┌────────────────────────────────────────────────────────────┐  │  │
│   │  │ mapPatientToProfile()                                       │  │  │
│   │  │                                                             │  │  │
│   │  │ Input:                        Output:                       │  │  │
│   │  │ - PatientContext data         - patient_id                  │  │  │
│   │  │ - Mood history (7 days)       - name, age, stage            │  │  │
│   │  │ - Conversation notes          - core_identity               │  │  │
│   │  │ - Emergency context           - comfort_memory              │  │  │
│   │  │                               - calming_topics[]            │  │  │
│   │  │                               - recent_mood_summary         │  │  │
│   │  │                               - todays_notes                │  │  │
│   │  │                               - is_sos_call                 │  │  │
│   │  └────────────────────────────────────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                    PROMPT GENERATOR                               │  │
│   │  generateSystemPrompt(profile)                                    │  │
│   │                                                                   │  │
│   │  Creates comprehensive prompt with:                               │  │
│   │  - Patient profile data                                           │  │
│   │  - Grounding techniques (validation, reminiscence, sensory)       │  │
│   │  - CRITICAL tracking section (moods + notes)                      │  │
│   │  - Response strategy instructions                                 │  │
│   │  - Emergency contact info                                         │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                    VAPI CLIENT                                    │  │
│   │  createPersonalizedAssistant(profile)                             │  │
│   │                                                                   │  │
│   │  Returns:                                                         │  │
│   │  - model: Claude claude-sonnet-4-20250514 with system prompt                     │  │
│   │  - voice: Azure Neural (Jenny/Guy based on preference)            │  │
│   │  - transcriber: Deepgram Nova 2                                   │  │
│   │  - firstMessage: Emergency grounding opener                       │  │
│   │  - functions: [end_conversation]                                  │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                    VAPI CLOUD                                     │  │
│   │                                                                   │  │
│   │  ┌──────────┐    ┌──────────┐    ┌──────────┐                    │  │
│   │  │ Deepgram │───▶│  Claude  │───▶│  Azure   │                    │  │
│   │  │   STT    │    │claude-sonnet-4-20250514│    │   TTS    │                    │  │
│   │  └──────────┘    └──────────┘    └──────────┘                    │  │
│   │       ▲                                │                          │  │
│   │       │                                ▼                          │  │
│   │  [Microphone]                    [Speaker]                        │  │
│   │                                                                   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Steps

1. **User Input**: Caregiver logs moods/notes on Tracking page
2. **Storage**: Activity Tracker stores data in localStorage
3. **SOS Trigger**: Caregiver taps Help button
4. **Profile Mapping**: `mapPatientToProfile()` combines PatientContext + tracking data
5. **Prompt Generation**: `generateSystemPrompt()` creates AI instructions
6. **VAPI Config**: `createPersonalizedAssistant()` builds voice assistant config
7. **Voice Call**: VAPI connects user to AI with full context

---

## Component Architecture

### Component Hierarchy

```
App.jsx
├── Navbar.jsx
│   ├── SOSModal.jsx ────────────► Emergency voice calls
│   └── PatientSwitcher.jsx ─────► Patient selection
├── Home.jsx ────────────────────► Patient overview
└── Tracking.jsx ────────────────► Mood & notes logging
```

### Key Components

#### SOSModal.jsx
**Purpose**: Emergency grounding voice call interface

**Responsibilities**:
- Map patient data to MCP profile format
- Fetch tracking data from Activity Tracker
- Manage VAPI voice call lifecycle
- Display real-time transcripts

**Key Functions**:
```javascript
mapPatientToProfile(patient)  // Converts PatientContext → MCP format
fetchTrackingData(patientId)  // Gets moods, notes from Activity Tracker
startCall()                    // Initiates VAPI voice call
endCall()                      // Terminates voice call
```

#### PatientContext.jsx
**Purpose**: Global patient state management

**Provides**:
- `currentPatient` - Currently selected patient
- `patients[]` - All patient profiles
- `switchPatient(id)` - Change active patient
- `addPatient(data)` - Create new patient
- `updatePatient(id, data)` - Modify patient

---

## MCP Server Integration

### What is MCP?

**Model Context Protocol (MCP)** is a standard for providing structured context to AI models. In EverMind, the MCP Server:

1. **Aggregates Data**: Combines patient profiles with tracking data
2. **Structures Context**: Formats data for optimal AI consumption
3. **Prioritizes Information**: Emergency notes get highest priority

### MCP Profile Schema

```typescript
interface MCPProfile {
  // Core Identity
  patient_id: string;
  name: string;
  preferred_address: string;
  age: number;
  diagnosis_stage: string;
  
  // Context for AI
  core_identity: string;      // Background, personality, history
  safe_place: string;         // Where they feel safe
  comfort_memory: string;     // What brings them comfort
  
  // Behavioral Guidance
  common_trigger: string;     // What to avoid
  calming_strategies: string; // What works to calm them
  calming_topics: string[];   // Good conversation topics
  avoid_topics: string[];     // Topics to avoid
  
  // Support Network
  emergency_contacts: Contact[];
  doctor_name: string;
  doctor_phone: string;
  
  // Voice Preferences
  voice_preference: 'warm_female' | 'warm_male';
  
  // Real-time Tracking (from MCP Server)
  is_sos_call: boolean;           // Emergency flag
  recent_mood_summary: string;    // Last 7 days of moods
  todays_notes: string;           // Caregiver notes
  recent_activities: Activity[];   // Recent logged activities
}
```

### Tracking Data Priority

The MCP Server prioritizes notes in this order:
1. **[emergency]** - Highest priority, always first
2. **[behavior]** - Important behavioral observations
3. **[medical]** - Health-related notes
4. **[conversation]** - General conversation notes
5. **Other** - Miscellaneous notes

---

## AI Voice System

### VAPI Integration

```javascript
// vapiClient.js

// Initialize VAPI with public key
const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

// Create personalized assistant
function createPersonalizedAssistant(profile) {
  return {
    model: {
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      messages: [{ role: "system", content: generateSystemPrompt(profile) }],
      functions: [{ name: "end_conversation", ... }]
    },
    voice: {
      provider: "azure",
      voiceId: profile.voice_preference === 'warm_female' 
        ? "en-US-JennyNeural" 
        : "en-US-GuyNeural"
    },
    transcriber: { provider: "deepgram", model: "nova-2" },
    firstMessage: `Hi ${profile.preferred_address}, it's okay, I'm right here...`
  };
}
```

### Event Handling

```javascript
vapi.on('call-start', handleCallStart);    // Call connected
vapi.on('call-end', handleCallEnd);        // Call ended
vapi.on('message', handleMessage);          // Transcript updates
vapi.on('error', handleError);              // Error handling
vapi.on('speech-start', handleSpeechStart); // User speaking
vapi.on('speech-end', handleSpeechEnd);     // User stopped
```

### Prompt Structure

The system prompt follows this structure:

```
1. MISSION STATEMENT (SOS vs regular call)
2. PATIENT PROFILE (memorize this)
3. CRITICAL TRACKING DATA (from MCP Server)
4. GROUNDING TECHNIQUES (5 evidence-based methods)
5. RESPONSE STRATEGY (acknowledge → validate → redirect)
6. CONVERSATION RULES (pace, length, tone)
7. CRITICAL RULES (what never to do)
```

---

## State Management

### PatientContext State

```javascript
{
  currentPatient: Patient | null,
  currentPatientId: string | null,
  patients: Patient[],
  patientsMap: Record<string, Patient>,
  isLoading: boolean,
  hasOnboarded: boolean
}
```

### localStorage Keys

| Key | Purpose |
|-----|---------|
| `evermind_patients` | All patient profiles |
| `evermind_currentPatientId` | Selected patient ID |
| `evermind_hasOnboarded` | Onboarding completion flag |
| `care_tracking:moods` | Mood logs by patient/date |
| `care_tracking:conversations` | Conversation notes |
| `care_tracking:emergency_context` | Emergency context |

---

## File Structure

```
src/
├── components/
│   ├── SOSModal.jsx          # Emergency voice call modal
│   ├── PatientSwitcher.jsx   # Patient selection UI
│   ├── EmergencyModal.jsx    # Quick emergency contacts
│   ├── Navbar.jsx            # Navigation with Help button
│   └── VoiceSession.jsx      # Full-page voice session
│
├── context/
│   └── PatientContext.jsx    # Global patient state
│
├── pages/
│   ├── Home.jsx              # Patient dashboard
│   └── Tracking.jsx          # Mood & notes logging
│
├── utils/
│   ├── vapiClient.js         # VAPI voice integration
│   ├── promptGenerator.js    # AI system prompt builder
│   ├── activityTracker.js    # Mood/notes storage (MCP)
│   ├── mcpClient.js          # MCP server client
│   └── profiles.js           # Default patient profiles
│
├── styles/
│   ├── index.css             # Core styles
│   ├── navigation.css        # Nav components
│   └── tracking.css          # Tracking page
│
└── App.jsx                   # Main app with routing
```

---

## Building New Features

### Adding a New Tracking Data Type

1. **Update Activity Tracker** (`activityTracker.js`):
```javascript
export const logNewDataType = (patientId, data) => {
  // Store in localStorage
  // Track as activity for MCP
};
```

2. **Update Profile Mapping** (`SOSModal.jsx`):
```javascript
const fetchTrackingData = (patientId) => {
  // Add new data type to fetch
  const newData = getNewDataType(patientId);
  return { ...existing, newData };
};
```

3. **Update Prompt Generator** (`promptGenerator.js`):
```javascript
const newDataContext = profile.new_data
  ? `\n• NEW DATA: ${profile.new_data}`
  : '';
```

### Adding a New Voice Feature

1. **Update VAPI Client** (`vapiClient.js`):
```javascript
// Add new function to assistant config
functions: [
  { name: "new_function", description: "...", parameters: {...} }
]
```

2. **Handle in SOSModal**:
```javascript
if (message.functionCall?.name === 'new_function') {
  // Handle the function call
}
```

### Adding a New Patient Field

1. **Update PatientContext** default data
2. **Update Profile Mapping** in `mapPatientToProfile()`
3. **Update Prompt Generator** to use new field
4. **Update UI** components to display/edit field

---

## Best Practices

### Performance
- Use `useCallback` for event handlers
- Clean up timeouts on unmount
- Limit tracking data to last 7 days

### Accessibility
- All buttons have `aria-label`
- Color contrast meets WCAG guidelines
- Voice feedback for actions

### Error Handling
- Check VAPI configuration before calls
- Verify microphone permissions
- Graceful fallbacks for missing data

### Testing
- Log prompts for debugging: `logPromptDetails()`
- Validate prompts: `validatePromptComplete()`
- Check MCP health: `testMcpHealth()`

---

## Conclusion

EverMind's architecture is designed to seamlessly connect patient data with AI-powered voice support. The key insight is that **tracking data flows through the MCP Server** to become part of the AI's context, enabling truly personalized and responsive emergency grounding conversations.

For questions or contributions, see the main [README.md](./README.md).
