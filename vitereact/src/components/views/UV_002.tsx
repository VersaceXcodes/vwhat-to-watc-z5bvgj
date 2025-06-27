import React from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { Link } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react-router-dom'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'; // Used for implicit navigation back to the input form perhaps
import { useMutation, useQueryClient } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@tanstack/react-query'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import axios from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'axios'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { v4 as uuidv4 } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'uuid'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Import types and store interfaces
import { useAppStore } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/store/main'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import type { ContentDetails, RecommendationResponse, RegenerateRequest } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/store/main'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'; // Import types directly from store

// --- Environment Variables ---
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'http://localhost:3000'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}`;

// --- API Fetching Function ---
// This function is for API calls made by mutations or potentially by parent components.
// UV_002 itself should not fetch initial data.
interface RegenerateRequestPayload {
  session_id: string;
}

const fetch_regenerate_recommendation = async (requestData: RegenerateRequestPayload): Promise<RecommendationResponse> => {
  const { data } = await axios.post<RecommendationResponse>(
    `${API_BASE_URL}/recommendations/regenerate`,
    requestData
  );
  return data;
};

// --- UV_002 Component Definition ---
// This component is designed as a PRESENTATIONAL component.
// It receives the recommendation data and a handler for the '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Get Another'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' button via props.
interface UV_002Props {
  contentDetails: ContentDetails | null;
  onRegenerate: (sessionId: string) => void;
  isLoadingRegenerate: boolean;
  regenerateError: string | null;
  isInitialLoad: boolean; // To signal if the initial recommendation is still loading
  initialLoadError: string | null; // To signal if initial recommendation failed
}

const UV_002: React.FC<UV_002Props> = ({
  contentDetails,
  onRegenerate,
  isLoadingRegenerate,
  regenerateError,
  isInitialLoad,
  initialLoadError
}) => {

  // Helper to format runtime
  const format_runtime = (minutes: number | null | undefined): string => {
    if (minutes === null || minutes === undefined) return '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'N/A'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'; // Provide a placeholder
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Render loading state
  if (isInitialLoad) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="text-center p-8">
          <p className="text-gray-600 text-lg mb-4">Loading Recommendation...</p>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (initialLoadError) {
    return (
      <div className="text-center p-8 font-medium text-gray-600">
        <p className="text-red-500 text-lg font-semibold mb-4">{initialLoadError}</p>
        <button 
          onClick={() => onRegenerate(localStorage.getItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"') || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"''"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')} 
          disabled={isLoadingRegenerate} 
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingRegenerate ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Trying Again...'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Try Loading Again'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}
        </button>
      </div>
    );
  }

  // Render no data found state
  if (!contentDetails) {
    return (
      <div className="text-center p-8 font-medium text-gray-600">
        <p>No suitable recommendation found. Please try adjusting your search criteria.</p>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Adjust Criteria</Link>
      </div>
    );
  }

  // Successfully loaded recommendation data
  const {
    title,
    synopsis,
    poster_url,
    content_type,
    runtime_minutes,
    seasons_count,
    release_year,
    content_rating,
    genres,
    streaming_services,
  } = contentDetails;

  // Use a placeholder image if poster_url is missing or invalid
  const safePosterUrl = poster_url || `https://picsum.photos/seed/${encodeURIComponent(title)}/600/800`;

  return (
    <div className="max-w-sm md:max-w-md lg:max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-8">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-72 w-full object-cover md:h-full md-w-48 lg:w-64"
            src={safePosterUrl}
            alt={`Poster for ${title}`}
            onError={(e) => {
              // Prevent infinite loop and use a fallback
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(title)}/600/800`; // Fallback fallback!
            }}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{content_type}</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
          <p className="mt-2 text-slate-500 font-medium">{release_year} - {content_rating || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'N/A'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}</p>
          <p className="mt-2 text-slate-500 font-medium">
            {runtime_minutes !== null && runtime_minutes !== undefined ? format_runtime(runtime_minutes) : seasons_count !== null && seasons_count !== undefined ? `${seasons_count} Season(s)` : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'N/A'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}
          </p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Synopsis</h3>
            <p className="text-slate-600 text-sm mt-1">{synopsis}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Genres</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {genres.map((genre, index) => (
                <span key={index /* Assumes genre names are unique enough here */ } className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Available On</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {streaming_services.map((service, index) => (
                <span key={index /* Assumes service names are unique enough here */ } className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {regenerateError && (
            <p className="mt-4 text-center text-red-500 text-sm">{regenerateError}</p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => onRegenerate(localStorage.getItem('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"') || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"''"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')} // Pass session_id from localStorage
              disabled={isLoadingRegenerate}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRegenerate ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Getting Another...'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Get Another Recommendation'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}
            </button>
          </div>

          <div className="mt-4 text-center">
             <Link to="/" className="text-sm text-blue-600 hover:underline">Change Preferences</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UV_002;







