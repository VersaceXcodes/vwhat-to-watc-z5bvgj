import { create } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'zustand'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { persist } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'zustand/middleware'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import axios from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'axios'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { v4 as uuidv4 } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'uuid'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'; // For generating session IDs

// --- API Base URL ---
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'http://localhost:3000'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}`;

// --- TypeScript Interfaces ---

// From OpenAPI spec
export interface Genre {
  genre_id: number;
  genre_name: string;
}

export interface Mood {
  mood_id: number;
  mood_name: string;
}

export interface StreamingService {
  service_id: number;
  service_name: string;
  service_logo_url: string | null;
}

export interface ContentDetails {
  content_id: number;
  title: string;
  synopsis: string;
  poster_url: string;
  content_type: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' | '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
  runtime_minutes: number | null;
  seasons_count: number | null;
  release_year: number;
  content_rating: string | null;
  genres: string[];
  streaming_services: string[];
}

export interface RecommendationResponse {
  recommended_content: ContentDetails | null;
  message: string;
}

export interface RecommendationRequest {
  session_id: string;
  content_type: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' | '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' | '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Both'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
  mood: string;
  genres: string[];
  streaming_services: string[];
}

export interface RegenerateRequest {
  session_id: string;
}

// --- Store State Interface ---
interface AppState {
  // State variables
  session_id: string | null;
  available_genres: Genre[];
  available_moods: Mood[];
  available_services: StreamingService[];
  app_loading: boolean;
  app_error: string | null;

  // Actions (functions to modify state)
  initialize_app_state: () => Promise<void>;
  set_session_id: (new_session_id: string) => void;
  set_app_loading: (isLoading: boolean) => void;
  set_app_error: (error: string | null) => void;
  clear_app_error: () => void;
  set_available_genres: (genres: Genre[]) => void;
  set_available_moods: (moods: Mood[]) => void;
  set_available_services: (services: StreamingService[]) => void;
}

// --- Zustand Store Definition ---
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- State Variables ---
      session_id: null,
      available_genres: [],
      available_moods: [],
      available_services: [],
      app_loading: false,
      app_error: null,

      // --- Actions ---

      // Synchronous setters
      set_session_id: (new_session_id) => set({ session_id: new_session_id }),
      set_app_loading: (isLoading) => set({ app_loading: isLoading }),
      set_app_error: (error) => set({ app_error: error }),
      clear_app_error: () => set({ app_error: null }),
      set_available_genres: (genres) => set({ available_genres: genres }),
      set_available_moods: (moods) => set({ available_moods: moods }),
      set_available_services: (services) => set({ available_services: services }),

      // Asynchronous initialization action
      initialize_app_state: async () => {
        set({ app_loading: true, app_error: null });

        // 1. Handle Session ID
        let current_session_id = localStorage.getItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
        if (!current_session_id) {
          current_session_id = uuidv4();
          try {
              localStorage.setItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', current_session_id);
          } catch (e) {
             console.error("Failed to save session ID to localStorage:", e);
             // Fallback: Set to null if localStorage is unavailable or blocked
             current_session_id = null;
          }
        }
        set({ session_id: current_session_id });


        // 2. Fetch Lookup Data (Genres, Moods, Services)
        try {
          const [genresResponse, moodsResponse, servicesResponse] = await Promise.all([
            axios.get<any>(`${API_BASE_URL}/genres?limit=100`), // Fetching a larger limit for available options
            axios.get<any>(`${API_BASE_URL}/moods?limit=100`),
            axios.get<any>(`${API_BASE_URL}/streaming-services?limit=100`),
          ]);

          // Check if data exists and is array before setting
          if (genresResponse.data && Array.isArray(genresResponse.data.genres)) {
             set({ available_genres: genresResponse.data.genres });
          } else {
             throw new Error("Invalid genres data received from API.");
          }

          if (moodsResponse.data && Array.isArray(moodsResponse.data.moods)) {
             set({ available_moods: moodsResponse.data.moods });
          } else {
             throw new Error("Invalid moods data received from API.");
          }

          if (servicesResponse.data && Array.isArray(servicesResponse.data.streaming_services)) {
             set({ available_services: servicesResponse.data.streaming_services });
          } else {
             throw new Error("Invalid streaming services data received from API.");
          }

          set({ app_loading: false });

        } catch (error) {
          console.error("Error initializing app state:", error);
          let errorMessage = "Failed to load application data. Please try refreshing.";
           if (axios.isAxiosError(error) && error.response) {
                errorMessage = `API Error: ${error.message} (Status: ${error.response.status})`;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
          set({ app_error: errorMessage, app_loading: false });
          // Ensure session ID remains if it was generated, even if lookups fail
          if (get().session_id === null && localStorage.getItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')) {
             set({ session_id: localStorage.getItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"') });
          } else if (get().session_id === null){
             const fallbackSessionId = uuidv4();
             set({ session_id: fallbackSessionId });
             try {
                localStorage.setItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', fallbackSessionId);
             } catch (e) {
                 console.error("Failed to save fallback session ID to localStorage:", e);
             }
          }
        }
      },
    }),
    {
      name: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'app-store'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', // name of the item in the storage (must be unique)
      storage: {
        getItem: (name) => {
          const data = localStorage.getItem(name);
          try {
            // Attempt to parse the data. If it fails, return null.
            // This handles cases where localStorage might contain invalid JSON.
            return data ? JSON.parse(data) : null;
          } catch (e) {
            console.error(`Error parsing localStorage item "${name}":`, e);
            // Remove the corrupted item to prevent future errors
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (e) {
            console.error(`Error stringifying and setting localStorage item "${name}":`, e);
            // Handle potential storage quota exceeded errors etc.
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      // Specify which parts of the state to persist.
      // `app_loading` and `app_error` are transient and should not persist.
      // `session_id` is persisted, but needs careful handling on re-initialization or fetch failure.
      partialize: (state) => ({
        session_id: state.session_id,
        available_genres: state.available_genres,
        available_moods: state.available_moods,
        available_services: state.available_services,
      }),
      // onRehydrateStorage hook to re-initialize the session ID if it was lost or if the store was cleared unexpectedly
      // It also ensures that the initial app state fetching logic correctly uses the persisted or newly generated session ID.
      onRehydrateStorage: (state) => {
        return (state, options) => {
          if (options?.hydrationCompleted) {
            console.log('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Hydration complete for app store'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
            // Restore session ID if it'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s null after hydration (e.g., if it wasn'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'t persisted correctly)
            // or just ensure it'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s set from the persisted value.
            // The initialize_app_state should handle session ID generation if null,
            // so we just need to ensure the persisted value is available.
            if (!state?.session_id) {
               const persistedSessionId = localStorage.getItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
               if (persistedSessionId) {
                 state.set_session_id(persistedSessionId);
               } else {
                 // If even localStorage doesn'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'t have it, generate a new one.
                 // This edge case ensures a session_id always exists.
                 const newSessionId = uuidv4();
                 state.set_session_id(newSessionId);
                 try {
                    localStorage.setItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', newSessionId);
                 } catch (e) {
                     console.error("Failed to save new session ID on rehydration:", e);
                 }
               }
            }

            // Optionally, re-fetch lookup data if they are empty after hydration,
            // although typically persist middleware should hydrate them.
            // This is a fallback mechanism.
            if (state?.available_genres.length === 0 ||
                state?.available_moods.length === 0 ||
                state?.available_services.length === 0) {
                 console.warn("Lookup data missing after hydration, attempting re-initialization.");
                 state?.initialize_app_state();
            }
          }
        };
      },
    }
  )
);

// --- Helper Function for Session ID Generation (if needed outside initialize_app_state) ---
// Not strictly necessary as initialize_app_state handles it, but good for encapsulation if used elsewhere.
export const generate_session_id = (): string => {
  // This ensures a session ID is maintained even if localStorage is unavailable.
  // The initialize_app_state will handle saving it.
  if (typeof window !== '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'undefined'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' && window.localStorage) {
    let sessionId = localStorage.getItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
    if (sessionId) {
      return sessionId;
    }
    sessionId = uuidv4();
    try {
      localStorage.setItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'what_to_watch_session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', sessionId);
    } catch(e) {
      console.error("Failed to save session ID on generation:", e);
    }
    return sessionId;
  }
  // Fallback for non-browser environments (e.g., SSR, though unlikely for this setup)
  return uuidv4();
};







