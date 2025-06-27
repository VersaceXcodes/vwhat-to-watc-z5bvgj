import React, { useState, useEffect, useCallback } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import axios from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'axios'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { useQuery, useMutation, useQueryClient } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@tanstack/react-query'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Import from the global Zustand store for lookup data and session management
import { useAppStore, Genre, Mood, StreamingService, ContentDetails } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/store/main'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Define the base URL for API calls
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'http://localhost:3000'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}`;

// --- Type Definitions for Component State ---

// Union type for Content Type selection
type ContentType = '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' | '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' | '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Both'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Type for Recommendation Request Payload
interface RecommendationRequestPayload {
  session_id: string;
  content_type: ContentType;
  mood: string;
  genres: string[];
  streaming_services: string[];
}

// Type for Recommendation Response
interface RecommendationResponse {
  recommended_content: ContentDetails | null;
  message: string;
}

// State for user selections
interface UserPreferences {
  content_type: ContentType;
  selected_mood: string | null;
  selected_genres: string[];
  selected_streaming_services: string[];
}

// --- Component ---

const UV_001_MainPreferenceInputForm: React.FC = () => {
  const queryClient = useQueryClient();

  // --- Global State Access ---
  const {
    session_id,
    available_genres,
    available_moods,
    available_services,
    app_loading: globalAppLoading, // Avoid conflict with local loading state
    app_error: globalAppError,
    initialize_app_state, // Action to fetch initial data
  } = useAppStore();

  // --- Local Component State ---
  const [preferences, setPreferences] = useState<UserPreferences>({
    content_type: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Both'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', // Default value
    selected_mood: null,
    selected_genres: [],
    selected_streaming_services: [],
  });

  const [recommendationResult, setRecommendationResult] = useState<ContentDetails | null>(null);
  const [recommendationMessage, setRecommendationMessage] = useState<string | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState<boolean>(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  // --- Initialization ---
  // Fetch initial data (genres, moods, services) and ensure session ID is set
  useEffect(() => {
    // Only initialize if data isn'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'t already loaded or if there was a global error
    if (!available_genres.length || !available_moods.length || !available_services.length) {
       initialize_app_state();
    }
  }, [initialize_app_state, available_genres, available_moods, available_services]);

  // --- Handlers for Input Changes ---

  const handleContentTypeChange = (type: ContentType) => {
    setPreferences((prev) => ({ ...prev, content_type: type }));
  };

  const handleMoodChange = (moodName: string) => {
    setPreferences((prev) => ({ ...prev, selected_mood: moodName }));
    // Clear specific mood error if any, when mood is selected
    if (recommendationError && recommendationError.includes('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'mood'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')) {
        setRecommendationError(null);
    }
  };

  const handleGenreChange = (genreName: string) => {
    setPreferences((prev) => {
      const newGenres = prev.selected_genres.includes(genreName)
        ? prev.selected_genres.filter((g) => g !== genreName)
        : [...prev.selected_genres, genreName];
      return { ...prev, selected_genres: newGenres };
    });
    // Clear specific genre error if any, when a genre is selected/deselected
    if (recommendationError && recommendationError.includes('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'genre'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')) {
        setRecommendationError(null);
    }
  };

  const handleServiceChange = (serviceName: string) => {
    setPreferences((prev) => {
      const newServices = prev.selected_streaming_services.includes(serviceName)
        ? prev.selected_streaming_services.filter((s) => s !== serviceName)
        : [...prev.selected_streaming_services, serviceName];
      return { ...prev, selected_streaming_services: newServices };
    });
    // Clear specific service error if any, when a service is selected/deselected
    if (recommendationError && recommendationError.includes('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'service'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')) {
        setRecommendationError(null);
    }
  };

  const handleSelectAllServices = useCallback(() => {
      const allServiceNames = available_services.map(s => s.service_name);
      setPreferences(prev => ({
          ...prev,
          selected_streaming_services: prev.selected_streaming_services.length === available_services.length ? [] : allServiceNames
      }));
      // Clear specific service error if any, when services are toggled
      if (recommendationError && recommendationError.includes('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'service'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')) {
        setRecommendationError(null);
      }
  }, [available_services, recommendationError]);

   const handleClearAllPreferences = useCallback(() => {
    setPreferences({
      content_type: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Both'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"',
      selected_mood: null,
      selected_genres: [],
      selected_streaming_services: [],
    });
    setRecommendationResult(null);
    setRecommendationMessage(null);
    setRecommendationError(null); // Clear errors
    setIsLoadingRecommendation(false); // Ensure loading is reset
  }, []);

  // --- API Mutations ---

  // Mutation for getting the initial recommendation
  const recommendationMutation = useMutation<
    RecommendationResponse,
    Error,
    { request: RecommendationRequestPayload }
  >({
    mutationFn: async ({ request }) => {
      setIsLoadingRecommendation(true);
      setRecommendationError(null); // Clear previous errors
      setRecommendationMessage(null);

      try {
        const response = await axios.post<RecommendationResponse>(`${API_BASE_URL}/recommendations`, request);
        return response.data;
      } catch (error: any) {
        console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Error fetching recommendation:'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', error);
        let errorMessage = '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Failed to get recommendation. Please try again.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data?.message || `API Error: ${error.message} (Status: ${error.response.status})`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setRecommendationError(errorMessage);
        setIsLoadingRecommendation(false);
        throw error; // Re-throw to let react-query handle the error state
      }
    },
    onSuccess: (data) => {
      setRecommendationResult(data.recommended_content);
      setRecommendationMessage(data.message);
    },
    onError: () => {
      // Error is already handled within mutationFn, just ensure loading state reset if needed
    },
    onSettled: () => {
        // Reset loading state always, regardless of success or error
        setIsLoadingRecommendation(false);
    }
  });

  // Mutation for regenerating the recommendation
  const regenerateRecommendationMutation = useMutation<
    RecommendationResponse,
    Error,
    { sessionId: string }
  >({
    mutationFn: async ({ sessionId }) => {
      setIsLoadingRecommendation(true);
      setRecommendationError(null);
      setRecommendationMessage(null);

      if (!sessionId) {
        const error = new Error("Session ID is missing for regeneration.");
        setRecommendationError("Cannot regenerate without a session. Please try again.");
        throw error;
      }

      try {
        // Corrected key name from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'sessionId'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' to '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' as per API spec
        const response = await axios.post<RecommendationResponse>(`${API_BASE_URL}/recommendations/regenerate`, { session_id: sessionId });
        return response.data;
      } catch (error: any) {
        console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Error regenerating recommendation:'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', error);
        let errorMessage = '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Failed to get another recommendation. Please try again.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
         if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.message || `API Error: ${error.message} (Status: ${error.response.status})`;
         } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setRecommendationError(errorMessage);
        setIsLoadingRecommendation(false);
        throw error;
      }
    },
    onSuccess: (data) => {
      setRecommendationResult(data.recommended_content);
      setRecommendationMessage(data.message);
    },
    onError: () => {
      // Errors are handled in mutationFn, ensuring loading state reset in onSettled
    },
    onSettled: () => {
        setIsLoadingRecommendation(false); // Ensure loading is reset
    }
  });

  // --- Event Handlers for API Calls ---

  const handleGetRecommendation = useCallback(() => {
    if (!session_id) {
      setRecommendationError('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Session not available. Please refresh the page.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
      return;
    }
    if (!preferences.selected_mood) {
        setRecommendationError('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Please select a mood.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
        return;
    }
      if (preferences.selected_genres.length === 0) {
        setRecommendationError('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Please select at least one genre.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
        return;
    }
      if (preferences.selected_streaming_services.length === 0) {
        setRecommendationError('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Please select at least one streaming service.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
        return;
    }

    // Prepare validated payload
    const requestPayload: RecommendationRequestPayload = {
      session_id: session_id,
      content_type: preferences.content_type,
      mood: preferences.selected_mood,
      genres: preferences.selected_genres,
      streaming_services: preferences.selected_streaming_services,
    };

    recommendationMutation.mutate({ request: requestPayload });
  }, [preferences, session_id, recommendationMutation]);

  const handleRegenerateRecommendation = useCallback(() => {
    if (!session_id) {
      setRecommendationError('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Session ID is missing. Cannot regenerate.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
      return;
    }
    regenerateRecommendationMutation.mutate({ sessionId: session_id }); // Pass session_id matching mutation parameter name
  }, [session_id, regenerateRecommendationMutation]);

  // --- Derived State for Button Enable/Disable ---
  const isPreferenceFormComplete = (
    preferences.selected_mood !== null &&
    preferences.selected_genres.length > 0 &&
    preferences.selected_streaming_services.length > 0
  );

  const isInitialDataReady = available_genres.length > 0 && available_moods.length > 0 && available_services.length > 0;

  const isAnyLoading = globalAppLoading || isLoadingRecommendation;
  const displayError = globalAppError || recommendationError;

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          What Should You Watch?
        </h1>

        {!isInitialDataReady && !globalAppError && (
          <div className="text-xl text-gray-600 mb-6">Loading preferences...</div>
        )}

        {globalAppError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 w-full max-w-md text-center" role="alert">
            <strong className="font-bold">Initialization Error! </strong>
            <span className="block sm:inline">{globalAppError}</span>
          </div>
        )}

        {!globalAppError && (
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 w-full max-w-3xl">
            {isAnyLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                  <p className="text-lg text-blue-600">
                     {isLoadingRecommendation ? "Finding your next favorite..." : "Loading options..."}
                  </p>
                </div>
              </div>
            )}

            {/* Preference Input Sections */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your Preferences</h3>

              {/* Content Type Selection */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Content Type</label>
                <div className="flex space-x-4">
                  {['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Both'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleContentTypeChange(type as ContentType)}
                      className={`px-5 py-2 rounded-full border transition-colors duration-150
                        ${preferences.content_type === type
                          ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-blue-500 text-white border-blue-500 shadow-md'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                          : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood Selection */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Current Mood</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {available_moods.map((mood) => (
                    <button
                      key={mood.mood_id}
                      onClick={() => handleMoodChange(mood.mood_name)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-150 border
                        ${preferences.selected_mood === mood.mood_name
                          ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-blue-100 border-blue-400 text-blue-800 font-semibold'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                          : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                        }`}
                    >
                      {mood.mood_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streaming Service Selection */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Streaming Services</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <button
                      onClick={handleSelectAllServices}
                      className={`px-4 py-2 rounded-lg transition-colors duration-150 border font-medium
                        ${preferences.selected_streaming_services.length === available_services.length && available_services.length > 0
                          ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-gray-300 border-gray-400 text-gray-800 cursor-not-allowed'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' // Indicate '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'All'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' is selected
                          : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                        }`}
                    >
                      {preferences.selected_streaming_services.length === available_services.length && available_services.length > 0 ? "All Selected" : "Select All"}
                    </button>
                  {available_services.map((service) => (
                    <button
                      key={service.service_id}
                      onClick={() => handleServiceChange(service.service_name)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-150 border flex items-center justify-center
                        ${preferences.selected_streaming_services.includes(service.service_name)
                          ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-blue-100 border-blue-400 text-blue-800 font-semibold'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                          : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                        }`}
                    >
                       {service.service_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Selection */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700 mb-2">Preferred Genres</label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2"> {/* Added max-height for scroll */}
                  {available_genres.map((genre) => (
                    <button
                      key={genre.genre_id}
                      onClick={() => handleGenreChange(genre.genre_name)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-150 border text-sm
                        ${preferences.selected_genres.includes(genre.genre_name)
                          ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-blue-500 text-white border-blue-600 font-medium shadow-sm'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                          : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'
                        }`}
                    >
                      {genre.genre_name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

             {/* Displaying Validation Errors proactively with helper text */}
            {!isPreferenceFormComplete && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 w-full text-center">
                    <p className="font-medium">Please complete all fields to find a recommendation.</p>
                </div>
            )}
            {recommendationError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full text-center">
                    <p className="font-medium">Input Error!</p>
                    <p>{recommendationError}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleClearAllPreferences}
                className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-400 transition-colors duration-150 w-full sm:w-auto"
              >
                Clear Preferences
              </button>
              <button
                onClick={handleGetRecommendation}
                disabled={!isInitialDataReady || !isPreferenceFormComplete}
                className={`px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 w-full sm:w-auto ${(!isInitialDataReady || !isPreferenceFormComplete) ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"''"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'hover:animate-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}`}
              >
                Find My Watch
              </button>
            </div>
          </div>
        )}

        {/* Recommendation Display Area */}
        {!isAnyLoading && !displayError && recommendationResult && (
          <div className="mt-10 bg-white rounded-lg shadow-xl p-6 md:p-10 w-full max-w-3xl">
            <h3 className="text-3xl font-bold text-gray-800 mb-5 text-center">{recommendationResult.title}</h3>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 md:w-1/3">
                <img
                  src={recommendationResult.poster_url || `/placeholder-poster.png`} // Fallback image if URL is missing
                  alt={`Poster for ${recommendationResult.title}`}
                  className="w-full h-64 md:h-auto object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    // Basic error handling for image loading itself
                    e.currentTarget.onerror = null; // Prevent infinite loop
                    e.currentTarget.src = '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'/fallback-poster.png'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'; // Use a specified fallback asset if available
                  }}
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-base text-gray-600 mb-4 leading-relaxed">
                  {recommendationResult.synopsis}
                </p>
                <div className="mb-4 text-sm text-gray-800">
                  <span className="font-semibold text-gray-900">Content Type:</span> {recommendationResult.content_type}
                  {recommendationResult.content_type === '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' && recommendationResult.runtime_minutes !== null && (
                    ` (${recommendationResult.runtime_minutes} mins)`
                  )}
                  {recommendationResult.content_type === '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' && recommendationResult.seasons_count !== null && (
                    ` (${recommendationResult.seasons_count} seasons)`
                  )}
                </div>
                <div className="mb-4 text-sm text-gray-800">
                  <span className="font-semibold text-gray-900">Release Year:</span> {recommendationResult.release_year}
                </div>
                 {recommendationResult.content_rating && (
                    <div className="mb-4 text-sm text-gray-800">
                        <span className="font-semibold text-gray-900">Rating:</span> <span className="bg-gray-200 px-2 py-1 rounded">{recommendationResult.content_rating}</span>
                    </div>
                 )}
                <div className="mb-4 text-sm text-gray-800">
                  <span className="font-semibold text-gray-900">Genres:</span> {recommendationResult.genres.join('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')}
                </div>
                <div className="text-sm text-gray-800">
                  <span className="font-semibold text-gray-900">Available On:</span> {recommendationResult.streaming_services.join('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')}
                </div>
              </div>
            </div>

             {/* Recommendation Message */}
            {recommendationMessage && (
                <p className="mt-5 text-center text-sm text-green-600 font-medium">{recommendationMessage}</p>
            )}

            {/* Regenerate Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleRegenerateRecommendation}
                className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
              >
                Show Another Recommendation
              </button>
            </div>
          </div>
        )}

        {!isAnyLoading && !displayError && !recommendationResult && (
            // This state is shown if no recommendation is fetched yet,
            // and no error occurred, but the form is ready.
            // The content above handles the "Please select..." errors on the main buttons.
            // This part can be a placeholder or simply allow the form to be visible.
            // If we reach here without recommendationResult, and no errors, it means
            // the "Find My Watch" button was likely disabled or not clicked yet.
            // No specific UI needed here if the form itself is visible and enabled.
             null
        )}

        {/* No Results Found Scenario */}
        {!isAnyLoading && !displayError && !recommendationResult && recommendationMessage?.includes("No suitable") && (
              <div className="mt-10 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded relative w-full max-w-md text-center">
                  <p className="font-semibold">No Matches Found!</p>
                  <p>We couldn'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'t find a perfect match with your current selections.</p>
                  <p className="mt-2">Try broadening your search criteria or selecting different options.</p>
              </div>
        )}
      </div>
    </>
  );
};

export default UV_001_MainPreferenceInputForm;







