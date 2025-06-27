import React, { useState, useEffect } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { Link, useNavigate } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'react-router-dom'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'; // Using Link for navigation
import axios from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'axios'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';
import { useQuery, useMutation, useQueryClient } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@tanstack/react-query'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Import types from shared schemas
import {
  UserSavedRecommendations,
  ContentDetails,
  CreateUserSavedRecommendationsInput,
  SearchUserSavedRecommendationsInput,
  Content, // Assuming Content refers to the base content schema
  genresSchema, // For type hints if needed, though API response shape is more direct
  moodsSchema,
  streamingServicesSchema,
} from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@schema'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// Import from Zustand store
import { useAppStore } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'@/store/main'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// --- Constants ---
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'http://localhost:3000'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}`;

// --- Interfaces for View-Specific Data Handling ---

// Minimal interface for Saved Recommendation display
interface SavedRecommendationDisplay {
  user_saved_id: number;
  content_id: number; // Still need this to fetch full details if not embedded
  title: string;
  poster_url: string;
  release_year: number;
  genres: string[];
  saved_at: string;
  // Add other display fields as needed and available
}

// Interface for User Profile data (hypothetical, based on usersSchema)
interface UserProfileData {
  user_id: number;
  email: string;
  // Add other relevant user profile fields
}

// --- API Fetching Functions ---

// Hypothetical fetch for user profile data
// NOTE: Endpoint /users/me is NOT defined in the provided OpenAPI spec.
const fetchUserProfile = async (): Promise<UserProfileData> => {
  // TODO: Endpoint not found in OpenAPI spec / Backend Server main code.
  // Assuming an endpoint like /users/me exists and returns user data
  // based on authentication token. Mocking for now.
  console.warn('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'API Endpoint GET /users/me is not defined in OpenAPI spec. Using mock data.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');

  // Simulate API call if endpoint were available
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`); // Hypothetical endpoint
    return response.data as UserProfileData;
  } catch (error) {
    // Mock response if the endpoint doesn'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'t exist or fails
    if (axios.isAxiosError<UserProfileData>(error) && error.response) {
      // Handle specific API errors if the endpoint existed
      throw new Error(`API Error fetching user profile: ${error.message} (Status: ${error.response.status})`);
    } else {
      // Mock data in case of network error or missing endpoint
      console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Mocking user profile data due to missing API endpoint.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
      return {
        user_id: 1, // Mock user ID
        email: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'user@example.com'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', // Mock email
      };
    }
  }
};

// Fetch for logged-in user'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s saved recommendations
// NOTE: Endpoint /users/me/saved-recommendations is NOT defined in the provided OpenAPI spec.
const fetchUserSavedRecommendations = async (): Promise<UserSavedRecommendations[]> => {
  // TODO: Endpoint not found in OpenAPI spec / Backend Server main code.
  // Assuming an endpoint like /users/me/saved-recommendations exists and returns saved items.
  console.warn('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'API Endpoint GET /users/me/saved-recommendations is not defined in OpenAPI spec. Using mock data.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');

  // Simulate API call if endpoint were available
  try {
    const params: SearchUserSavedRecommendationsInput = {
      limit: 100, // Fetch all for simplicity in MVP
      sort_by: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'saved_at'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"',
      sort_order: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"',
    };
    const response = await axios.get<any>(`${API_BASE_URL}/users/me/saved-recommendations`, { params }); // Hypothetical endpoint
    return response.data.user_saved_recommendations || []; // Assuming response structure { user_saved_recommendations: UserSavedRecommendations[] }
  } catch (error) {
     // Mock data in case of network error or missing endpoint
     console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Mocking saved recommendations due to missing API endpoint.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
     // Ensure mock data conforms to UserSavedRecommendations interface, including content_id
     return [
       { user_saved_id: 1, user_id: 1, content_id: 101, saved_at: new Date().toISOString(), source_criteria: { mood: '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Amused'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' } },
       { user_saved_id: 2, user_id: 1, content_id: 102, saved_at: new Date(Date.now() - 86400000).toISOString(), source_criteria: { genres: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Sci-Fi'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'] } },
     ];
  }
};

// Fetch for specific Content Details needed for Saved Recommendations
// NOTE: Endpoint GET /content/{content_id} is implied but not explicitly defined in OpenAPI paths.
const fetchContentDetailsById = async (content_id: number): Promise<ContentDetails> => {
  // TODO: Endpoint not found in OpenAPI spec / Backend Server main code for single content item.
  // Assuming an endpoint like /content/{content_id} exists.
  console.warn(`API Endpoint GET /content/${content_id} is not explicitly defined in OpenAPI paths. Using mock data.`);

  // Simulate API call if endpoint were available
  try {
    const response = await axios.get<ContentDetails>(`${API_BASE_URL}/content/${content_id}`);
    return response.data;
  } catch (error) {
    // Mock data in case of network error or missing endpoint
    console.error(`Mocking content details for content_id ${content_id} due to missing API endpoint.`);
    return {
      content_id: content_id,
      title: `Mocked Content Title ${content_id}`,
      synopsis: `This is a mocked synopsis for content ID ${content_id}. The actual synopsis would be fetched from the API.`,
      poster_url: `https://picsum.photos/seed/${content_id}/200/300`,
      content_type: content_id % 2 === 0 ? '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' : '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"',
      runtime_minutes: content_id % 2 === 0 ? 120 : null,
      seasons_count: content_id % 2 !== 0 ? 5 : null,
      release_year: 2000 + (content_id % 20),
      content_rating: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'G'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'PG'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'PG-13'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'R'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV-Y7'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV-MA'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'][content_id % 6] || null,
      genres: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Action'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Comedy'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'][content_id % 2] || ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Drama'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'],
      streaming_services: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Netflix'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Hulu'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'][content_id % 3] || ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Prime Video'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'],
    };
  }
};

// Mutation to remove a saved recommendation
// NOTE: Endpoint DELETE /users/me/saved-recommendations/{user_saved_id} is NOT defined in the provided OpenAPI spec.
const removeSavedRecommendation = async (user_saved_id: number): Promise<void> => {
  // TODO: Endpoint not found in OpenAPI spec / Backend Server main code.
  console.warn(`API Endpoint DELETE /users/me/saved-recommendations/${user_saved_id} is not defined in OpenAPI spec. Cannot perform removal.`);

  // Simulate API call if endpoint were available
  try {
    await axios.delete(`${API_BASE_URL}/users/me/saved-recommendations/${user_saved_id}`); // Hypothetical endpoint
    // If successful, the queryClient will invalidate cached data, triggering a refetch.
  } catch (error) {
    console.error(`Error removing saved recommendation (ID: ${user_saved_id}):`, error);
    throw error; // Re-throw to be caught by mutation error handler
  }
};

// --- React Component ---

const UV_005: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Accessing Zustand store
  const logout = useAppStore(state => state.logout); // Assuming logout action is defined in the store
  const userId = useAppStore(state => {
     // For profile view, we typically need authenticated user info from the store.
     // If the store holds user data (e.g., state.currentUser), use it.
     // If not, we'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'ll rely on fetchUserProfile.
     // For a robust MVP+, you'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'d check auth status here.
     // For now, we proceed assuming user is logged in and fetchUserProfile will get details.
     return state.session_id; // Using session_id as a proxy for logged-in state for now if user isn'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'t stored directly
  });

  const [allSavedContentDetails, setAllSavedContentDetails] = useState<{ [key: number]: ContentDetails }>({});
  // Store a mapping from user_saved_id to content_id to help in state updates
  const [savedItemMapping, setSavedItemMapping] = useState<{ [key: number]: number }>({});

  // Fetch User Profile Data
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: errorProfile,
  } = useQuery<UserProfileData, Error>({
    queryKey: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'userProfile'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'],
    queryFn: fetchUserProfile,
    enabled: !!userId, // Only fetch if userId is available
    onError: (err) => {
      console.error("Failed to fetch user profile:", err.message);
      // Potentially redirect to login if profile fetch fails critically?
    },
  });

  // Fetch User'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s Saved Recommendations (list of UserSavedRecommendations)
  const {
    data: savedRecommendationsList,
    isLoading: isLoadingSavedRecs,
    isError: isErrorSavedRecs,
    error: errorSavedRecs,
  } = useQuery<UserSavedRecommendations[], Error>({
    queryKey: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'userSavedRecommendations'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'],
    queryFn: fetchUserSavedRecommendations,
    enabled: !!userId, // Only fetch if userId is available
    onSuccess: (data) => {
      // After fetching the list of saved recommendations,
      // fetch details for each one using their content_id.
      const contentIds = data.map(item => item.content_id);
      // Also, build the mapping for easier state updates later
      const mapping = data.reduce((acc, item) => {
        acc[item.user_saved_id] = item.content_id;
        return acc;
      }, {} as { [key: number]: number });
      setSavedItemMapping(mapping);
      fetchContentDetailsForSaved(contentIds);
    },
    onError: (err) => {
      console.error("Failed to fetch saved recommendations:", err.message);
      setAllSavedContentDetails({}); // Clear details if list fetch fails
      setSavedItemMapping({});
    },
  });

  // Function to fetch details for multiple saved items and manage state
  const fetchContentDetailsForSaved = async (contentIds: number[]) => {
    setAllSavedContentDetails({}); // Clear previous details before fetching new ones
    if (contentIds.length === 0) return;

    // Using Promise.all to fetch details concurrently
    const fetchPromises = contentIds.map(async (contentId) => {
      try {
        const details = await fetchContentDetailsById(contentId);
        return { [contentId]: details };
      } catch (error) {
        console.error(`Failed to fetch details for content ID ${contentId}:`, error);
        // Return a placeholder or null for failed fetches
        return { [contentId]: null as any }; // Use `any` type for mock null if schema expects specific fields
      }
    });

    try {
      const results = await Promise.all(fetchPromises);
      const fetchedDetails = results.reduce((acc, current) => {
        // Only add if details were successfully fetched (not null mock placeholder)
        if (current[Object.keys(current)[0]] !== null) {
          return { ...acc, ...current };
        }
        return acc;
      }, {} as { [key: number]: ContentDetails });
      setAllSavedContentDetails(fetchedDetails);
    } catch (error) {
      console.error("An error occurred while fetching content details for saved items:", error);
      // Handle overall error if needed
    }
  };

  // Mutation for removing a saved recommendation
  const mutationRemoveSaved = useMutation<void, Error, number>({
    mutationFn: (user_saved_id) => removeSavedRecommendation(user_saved_id),
    onMutate: async (deletedUserSavedId) => {
      // Optimistically update the UI: Remove the item from the displayed list
      queryClient.setQueryData<UserSavedRecommendations[]>(
        ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'userSavedRecommendations'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'],
        (oldData) => oldData?.filter(item => item.user_saved_id !== deletedUserSavedId) ?? []
      );

      // Also remove from details cache using the mapping
      setAllSavedContentDetails(prevDetails => {
        const contentIdToRemove = savedItemMapping[deletedUserSavedId];
        if (contentIdToRemove && prevDetails[contentIdToRemove]) {
          const { [contentIdToRemove]: _, ...rest } = prevDetails;
          return rest;
        }
        return prevDetails;
      });

      // Remove from mapping as well
      setSavedItemMapping(prevMapping => {
        const { [deletedUserSavedId]: _, ...rest } = prevMapping;
        return rest;
      });

      // Note: The actual removal from the UI happens when the query invalidation succeeds.
      // For immediate visual feedback, we'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'ve updated the cache.
    },
    onSuccess: () => {
      console.log('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Saved recommendation removed successfully.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"');
      // Data is already optimistically updated, but explicit invalidation is good practice.
      queryClient.invalidateQueries({ queryKey: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'userSavedRecommendations'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'] });
      // No need to re-fetch content details explicitly if they are managed separately in state `allSavedContentDetails` and cleared by `onMutate`
    },
    onError: (error, variables) => {
      console.error('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Failed to remove saved recommendation:'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', error);
      // Revert optimistic update if mutation fails
      queryClient.invalidateQueries({ queryKey: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'userSavedRecommendations'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'] }); // This will refetch the original data
      // Inform the user about the error
      alert(`Could not remove item. Please try again. Error: ${error.message}`);
    },
  });

  // Handle Logout
  const handleLogout = () => {
    // Call logout action from Zustand store
    logout();
    navigate('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'/'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'); // Redirect to homepage or login page after logout
  };

  const isLoading = isLoadingProfile || isLoadingSavedRecs || mutationRemoveSaved.isPending;
  const isError = isErrorProfile || isErrorSavedRecs || mutationRemoveSaved.isError;
  const errorMessage = errorProfile?.message || errorSavedRecs?.message || mutationRemoveSaved.error?.message;

  // Helper to get ContentDetails for a given user_saved_id
  const getSavedContent = (user_saved_id: number): ContentDetails | null => {
      // Get the content_id using the mapping state
      const contentId = savedItemMapping[user_saved_id];
      if (!contentId) return null; // content_id not found in mapping

      // Then use the content_id to retrieve from our cached details state
      const details = allSavedContentDetails[contentId];
      return details || null;
  };

  return (
    <>
      {/* Main container, full width */}
      <div className="relative flex flex-col min-h-screen w-full bg-gray-900 text-white p-4 md:p-8">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8 py-4 border-b border-gray-700">
          <div className="text-2xl font-bold text-indigo-400">My Profile</div>
          <nav>
            {/* Link back to the main recommendation page */}
            <Link to="/" className="text-gray-300 hover:text-indigo-400 transition duration-200 mr-4">
              Find More Movies
            </Link>
            {/* Logout Button */}
            {!isLoading && ( // Only show logout if not in a loading state that obscures it
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
              >
                Logout
              </button>
            )}
          </nav>
        </header>

        {/* Content Area */}
        <main className="flex-grow flex flex-col">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="ml-4 text-xl text-gray-300">Loading Profile...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-10">
              <p className="text-red-500 text-lg font-semibold">Error Loading Profile:</p>
              <p className="text-red-400 text-base">{errorMessage || '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'An unknown error occurred.'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'}</p>
              <button
                onClick={() => queryClient.refetchQueries({ queryKey: ['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'userProfile'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'userSavedRecommendations'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'] })}
                className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium transition duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && userProfile && (
            <>
              {/* User Profile Summary Section */}
              <section className="mb-10 p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-4 text-indigo-300 border-b border-gray-700 pb-2">Account Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xl font-medium text-gray-300">Email:</p>
                    <p className="text-lg text-gray-400">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-xl font-medium text-gray-300">User ID:</p>
                    <p className="text-lg text-gray-400">{userProfile.user_id}</p>
                  </div>
                  {/* Add other profile details here if fetched */}
                </div>
              </section>

              {/* Saved Recommendations Section */}
              <section className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-6 text-indigo-300 border-b border-gray-700 pb-2 flex justify-between items-center">
                  Saved Recommendations
                  {/* Potentially a button to clear all saved items, if implemented */}
                </h2>
                {savedRecommendationsList && savedRecommendationsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {savedRecommendationsList.map((savedItem) => {
                      const content = getSavedContent(savedItem.user_saved_id);
                      return content ? (
                        <div key={savedItem.user_saved_id} className="relative group bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                          {/* Poster Image */}
                          <img
                            src={content.poster_url || `https://picsum.photos/seed/${savedItem.content_id}/200/300`} // Fallback image
                            alt={`${content.title} poster`}
                            className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          {/* Overlay for details and actions */}
                          <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-2 truncate">{content.title} ({content.release_year})</h3>
                              <p className="text-xs text-gray-300 mb-1">
                                {content.content_type} | {content.genres.join('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')}
                              </p>
                              <p className="text-xs text-gray-400 mb-3">Saved: {new Date(savedItem.saved_at).toLocaleDateString()}</p>
                              {/* Optionally show synopsis snippet or more details link */}
                              <p className="text-sm text-gray-300 line-clamp-3">{content.synopsis}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              {/* Link to potential modal/detail view - not implemented here */}
                              {/* <Link to={`/content/${content.content_id}`} className="text-sm text-blue-400 hover:underline">Details</Link> */}
                              <button
                                onClick={() => mutationRemoveSaved.mutate(savedItem.user_saved_id)}
                                disabled={mutationRemoveSaved.isPending}
                                className="text-sm text-red-400 hover:underline disabled:text-red-600 disabled:cursor-not-allowed"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Placeholder for items whose details failed to load
                        <div key={savedItem.user_saved_id} className="relative group bg-gray-700 rounded-lg overflow-hidden shadow-lg p-4 flex flex-col justify-center items-center">
                          <p className="text-gray-400 text-sm text-center mb-2">Error loading details</p>
                          <button
                            onClick={() => mutationRemoveSaved.mutate(savedItem.user_saved_id)}
                            disabled={mutationRemoveSaved.isPending}
                            className="text-sm text-red-400 hover:underline disabled:text-red-600 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">You haven'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'t saved any recommendations yet.</p>
                    <Link to="/" className="mt-4 inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium transition duration-200">
                      Start Discovering
                    </Link>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default UV_005;







