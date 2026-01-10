/**
 * VAPI Client Utility
 * Handles voice calling functionality for Alzheimer's grounding conversations
 * 
 * Stage 3: Profile-driven conversations with 3-exchange structure
 * 
 * Setup:
 * 1. Get API key from https://vapi.ai (Dashboard > API Keys)
 * 2. Add to .env.local: VITE_VAPI_PUBLIC_KEY=your_key_here
 */

import Vapi from '@vapi-ai/web';
import { generateSystemPrompt, logPromptDetails, validatePromptComplete } from './promptGenerator';

// Check if API key is configured
const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

if (!apiKey || apiKey === 'your_vapi_public_key_here') {
  console.warn('[VAPI] ⚠️ API key not configured. Please add VITE_VAPI_PUBLIC_KEY to .env.local');
}

// Initialize VAPI client
export const vapi = new Vapi(apiKey || '');

/**
 * Check if VAPI is properly configured
 * @returns {boolean}
 */
export function isVapiConfigured() {
  return apiKey && apiKey !== 'your_vapi_public_key_here' && apiKey.length > 10;
}

/**
 * Check microphone permission
 * @returns {Promise<boolean>}
 */
export async function checkMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Release immediately
    return true;
  } catch (err) {
    console.error('[VAPI] Microphone permission denied:', err);
    return false;
  }
}

/**
 * Create a basic test assistant configuration
 * This is for Stage 2 testing - simple static prompt
 * @returns {object} Assistant configuration
 */
export function createTestAssistant() {
  return {
    model: {
      provider: "openai",
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a friendly assistant. Keep responses to one short sentence."
        }
      ],
      temperature: 0.7
    },
    voice: {
      provider: "azure",
      voiceId: "en-US-JennyNeural",
    },
    firstMessage: "Hello, can you hear me?",
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 120,
  };
}

/**
 * Create an assistant with personalized profile data
 * Stage 3: Full integration with MCP profiles
 * @param {object} profile - Patient profile from MCP
 * @returns {object} Assistant configuration
 */
export function createPersonalizedAssistant(profile) {
  if (!profile) {
    throw new Error('Profile is required to create personalized assistant');
  }

  // Generate dynamic system prompt from profile
  const systemPrompt = generateSystemPrompt(profile);

  // Log prompt for debugging (Task 3.1 testing requirement)
  logPromptDetails(systemPrompt, profile.name);

  // Validate no placeholders remain
  if (!validatePromptComplete(systemPrompt)) {
    console.warn('[VAPI] Warning: System prompt may have unresolved placeholders');
  }

  // Voice selection based on profile preference (Task 3.2)
  // Using Azure voices which work reliably
  const voiceConfig = profile.voice_preference === 'warm_female'
    ? { provider: "azure", voiceId: "en-US-JennyNeural" }  // Warm female
    : { provider: "azure", voiceId: "en-US-GuyNeural" };    // Warm male

  console.log(`[VAPI] Using ${profile.voice_preference} voice:`, voiceConfig.voiceId);

  // Customize first message based on profile type
  const isHackathon = !!profile.hackathonProject;
  const firstMessage = isHackathon
    ? `Hey ${profile.preferred_address}! I heard you're working on your hackathon project. How's it going? I'm here to help you through any stress or just chat if you need a break.`
    : `Hi ${profile.preferred_address}, I'm here to talk with you for a moment. How are you feeling right now?`;

  return {
    name: `${profile.name} Support`,
    model: {
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      messages: [
        {
          role: "system",
          content: systemPrompt
        }
      ],
      temperature: 0.7,
      // Function definitions for end_conversation - only when user wants to stop
      functions: [
        {
          name: "end_conversation",
          description: "Call this function ONLY when the user explicitly says goodbye, wants to end the call, or asks to stop. Do NOT call this automatically - let the conversation flow naturally.",
          parameters: {
            type: "object",
            properties: {
              reason: {
                type: "string",
                description: "Why the conversation is ending (e.g., 'user said goodbye', 'user requested to end')"
              },
              user_state: {
                type: "string",
                enum: ["calm", "better", "same", "needs_follow_up"],
                description: "Assessment of the user's emotional state at end of conversation"
              }
            },
            required: ["reason", "user_state"]
          }
        }
      ]
    },
    voice: voiceConfig,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US"
    },
    firstMessage: firstMessage,

    // Call settings - extended for longer conversations
    silenceTimeoutSeconds: 60,      // 60 seconds before timeout
    maxDurationSeconds: 600,        // 10 minutes max
    responseDelaySeconds: 0.3,      // Quick responses for natural flow
    endCallFunctionEnabled: false,  // We handle ending via function call

    // Metadata for tracking
    metadata: {
      patientId: profile.patient_id,
      patientName: profile.name,
      voicePreference: profile.voice_preference,
      isHackathonMode: isHackathon
    }
  };
}

// Log VAPI configuration status on load
console.log('[VAPI] Client initialized. Configured:', isVapiConfigured());
