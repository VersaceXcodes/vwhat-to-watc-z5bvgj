import { z } from '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'zod'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"';

// ===============================
// Users Schemas
// ===============================

export const usersSchema = z.object({
  user_id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  created_at: z.string(), // Primitive type: string
  updated_at: z.string(), // Primitive type: string
});

export const createUsersInputSchema = z.object({
  email: z.string().email(),
  password_hash: z.string().min(8), // Basic password strength
});

export const updateUsersInputSchema = z.object({
  user_id: z.number(),
  email: z.string().email().optional(),
  password_hash: z.string().min(8).optional(),
});

export const searchUsersInputSchema = z.object({
  user_id: z.number().optional(),
  email: z.string().email().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'user_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'email'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'created_at'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'created_at'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type Users = z.infer<typeof usersSchema>;
export type CreateUsersInput = z.infer<typeof createUsersInputSchema>;
export type UpdateUsersInput = z.infer<typeof updateUsersInputSchema>;
export type SearchUsersInput = z.infer<typeof searchUsersInputSchema>;

// ===============================
// Content Schemas
// ===============================

export const contentSchema = z.object({
  content_id: z.number(),
  title: z.string(),
  synopsis: z.string(),
  poster_url: z.string().url(),
  content_type: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']),
  runtime_minutes: z.number().int().nullable(),
  seasons_count: z.number().int().nullable(),
  release_year: z.number().int(),
  content_rating: z.string().nullable(),
  average_crit_score: z.number().nullable(),
  created_at: z.string(), // Primitive type: string
  updated_at: z.string(), // Primitive type: string
});

export const createContentInputSchema = z.object({
  title: z.string().min(1).max(255),
  synopsis: z.string().min(1),
  poster_url: z.string().url(),
  content_type: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']),
  runtime_minutes: z.number().int().nullable(),
  seasons_count: z.number().int().nullable(),
  release_year: z.number().int(),
  content_rating: z.string().nullable(),
  average_crit_score: z.number().nullable(),
});

export const updateContentInputSchema = z.object({
  content_id: z.number(),
  title: z.string().min(1).max(255).optional(),
  synopsis: z.string().min(1).optional(),
  poster_url: z.string().url().optional(),
  content_type: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).optional(),
  runtime_minutes: z.number().int().nullable().optional(),
  seasons_count: z.number().int().nullable().optional(),
  release_year: z.number().int().optional(),
  content_rating: z.string().nullable().optional(),
  average_crit_score: z.number().nullable().optional(),
});

export const searchContentInputSchema = z.object({
  query: z.string().optional(),
  content_type: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'Movie'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'TV Show'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).optional(),
  genre_ids: z.array(z.number()).optional(),
  mood_ids: z.array(z.number()).optional(),
  streaming_service_ids: z.array(z.number()).optional(),
  release_year_min: z.number().int().optional(),
  release_year_max: z.number().int().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'title'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'release_year'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'average_crit_score'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'created_at'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'created_at'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type Content = z.infer<typeof contentSchema>;
export type CreateContentInput = z.infer<typeof createContentInputSchema>;
export type UpdateContentInput = z.infer<typeof updateContentInputSchema>;
export type SearchContentInput = z.infer<typeof searchContentInputSchema>;

// ===============================
// Genres Schemas
// ===============================

export const genresSchema = z.object({
  genre_id: z.number(),
  genre_name: z.string(),
});

export const createGenresInputSchema = z.object({
  genre_name: z.string().min(1).max(100).unique(),
});

export const updateGenresInputSchema = z.object({
  genre_id: z.number(),
  genre_name: z.string().min(1).max(100).unique().optional(),
});

export const searchGenresInputSchema = z.object({
  genre_id: z.number().optional(),
  genre_name: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'genre_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'genre_name'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'genre_name'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type Genres = z.infer<typeof genresSchema>;
export type CreateGenresInput = z.infer<typeof createGenresInputSchema>;
export type UpdateGenresInput = z.infer<typeof updateGenresInputSchema>;
export type SearchGenresInput = z.infer<typeof searchGenresInputSchema>;

// ===============================
// ContentGenres Schemas
// ===============================

export const contentGenresSchema = z.object({
  content_id: z.number(),
  genre_id: z.number(),
});

export const createContentGenresInputSchema = z.object({
  content_id: z.number(),
  genre_id: z.number(),
});

// No separate update schema needed for junction table if only adding/removing relationships

export const searchContentGenresInputSchema = z.object({
  content_id: z.number().optional(),
  genre_id: z.number().optional(),
  limit: z.number().int().positive().default(100), // Higher limit for junction table
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'content_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'genre_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'content_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type ContentGenres = z.infer<typeof contentGenresSchema>;
export type CreateContentGenresInput = z.infer<typeof createContentGenresInputSchema>;
export type SearchContentGenresInput = z.infer<typeof searchContentGenresInputSchema>;

// ===============================
// Moods Schemas
// ===============================

export const moodsSchema = z.object({
  mood_id: z.number(),
  mood_name: z.string(),
});

export const createMoodsInputSchema = z.object({
  mood_name: z.string().min(1).max(100).unique(),
});

export const updateMoodsInputSchema = z.object({
  mood_id: z.number(),
  mood_name: z.string().min(1).max(100).unique().optional(),
});

export const searchMoodsInputSchema = z.object({
  mood_id: z.number().optional(),
  mood_name: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'mood_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'mood_name'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'mood_name'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type Moods = z.infer<typeof moodsSchema>;
export type CreateMoodsInput = z.infer<typeof createMoodsInputSchema>;
export type UpdateMoodsInput = z.infer<typeof updateMoodsInputSchema>;
export type SearchMoodsInput = z.infer<typeof searchMoodsInputSchema>;

// ===============================
// StreamingServices Schemas
// ===============================

export const streamingServicesSchema = z.object({
  service_id: z.number(),
  service_name: z.string(),
  service_logo_url: z.string().url().nullable(),
});


export const createStreamingServicesInputSchema = z.object({
  service_name: z.string().min(1).max(100).unique(),
  service_logo_url: z.string().url().nullable().optional(),
});

export const updateStreamingServicesInputSchema = z.object({
  service_id: z.number(),
  service_name: z.string().min(1).max(100).unique().optional(),
  service_logo_url: z.string().url().nullable().optional(),
});

export const searchStreamingServicesInputSchema = z.object({
  service_id: z.number().optional(),
  service_name: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'service_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'service_name'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'service_name'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type StreamingServices = z.infer<typeof streamingServicesSchema>;
export type CreateStreamingServicesInput = z.infer<typeof createStreamingServicesInputSchema>;
export type UpdateStreamingServicesInput = z.infer<typeof updateStreamingServicesInputSchema>;
export type SearchStreamingServicesInput = z.infer<typeof searchStreamingServicesInputSchema>;

// ===============================
// ContentStreamingServices Schemas
// ===============================

export const contentStreamingServicesSchema = z.object({
  content_id: z.number(),
  service_id: z.number(),
});

export const createContentStreamingServicesInputSchema = z.object({
  content_id: z.number(),
  service_id: z.number(),
});

// No separate update schema needed for junction table

export const searchContentStreamingServicesInputSchema = z.object({
  content_id: z.number().optional(),
  service_id: z.number().optional(),
  limit: z.number().int().positive().default(100), // Higher limit for junction table
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'content_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'service_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'content_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type ContentStreamingServices = z.infer<typeof contentStreamingServicesSchema>;
export type CreateContentStreamingServicesInput = z.infer<typeof createContentStreamingServicesInputSchema>;
export type SearchContentStreamingServicesInput = z.infer<typeof searchContentStreamingServicesInputSchema>;

// ===============================
// RecommendationLogs Schemas
// ===============================

export const recommendationLogsSchema = z.object({
  log_id: z.number(),
  session_id: z.string(),
  user_input_mood_ids: z.array(z.number()), // Assuming JSON is an array of numbers
  user_input_genre_ids: z.array(z.number()), // Assuming JSON is an array of numbers
  user_input_service_ids: z.array(z.number()), // Assuming JSON is an array of numbers
  user_input_content_type: z.string(),
  recommended_content_id: z.number().nullable(),
  recommendation_timestamp: z.string(), // Primitive type: string
  feedback_type: z.string().nullable(),
});

export const createRecommendationLogsInputSchema = z.object({
  session_id: z.string().min(1),
  user_input_mood_ids: z.array(z.number()),
  user_input_genre_ids: z.array(z.number()),
  user_input_service_ids: z.array(z.number()),
  user_input_content_type: z.string().min(1),
  recommended_content_id: z.number().nullable(),
  // recommendation_timestamp will be set by the server
  feedback_type: z.string().nullable(),
});

export const updateRecommendationLogsInputSchema = z.object({
  log_id: z.number(),
  session_id: z.string().min(1).optional(),
  user_input_mood_ids: z.array(z.number()).optional(),
  user_input_genre_ids: z.array(z.number()).optional(),
  user_input_service_ids: z.array(z.number()).optional(),
  user_input_content_type: z.string().min(1).optional(),
  recommended_content_id: z.number().nullable().optional(),
  feedback_type: z.string().nullable().optional(),
});

export const searchRecommendationLogsInputSchema = z.object({
  log_id: z.number().optional(),
  session_id: z.string().optional(),
  user_input_content_type: z.string().optional(),
  recommended_content_id: z.number().nullable().optional(),
  feedback_type: z.string().nullable().optional(),
  created_after: z.string().optional(), // For filtering by timestamp
  created_before: z.string().optional(), // For filtering by timestamp
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'log_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'recommendation_timestamp'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'session_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'recommendation_timestamp'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type RecommendationLogs = z.infer<typeof recommendationLogsSchema>;
export type CreateRecommendationLogsInput = z.infer<typeof createRecommendationLogsInputSchema>;
export type UpdateRecommendationLogsInput = z.infer<typeof updateRecommendationLogsInputSchema>;
export type SearchRecommendationLogsInput = z.infer<typeof searchRecommendationLogsInputSchema>;

// ===============================
// UserSavedRecommendations Schemas
// ===============================

export const userSavedRecommendationsSchema = z.object({
  user_saved_id: z.number(),
  user_id: z.number(),
  content_id: z.number(),
  saved_at: z.string(), // Primitive type: string
  source_criteria: z.any().nullable(), // JSON can be Zod'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'s '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'any'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"' or a more specific schema if structure is known
});

export const createUserSavedRecommendationsInputSchema = z.object({
  user_id: z.number(),
  content_id: z.number(),
  source_criteria: z.any().nullable().optional(), // JSON
});

export const updateUserSavedRecommendationsInputSchema = z.object({
  user_saved_id: z.number(),
  source_criteria: z.any().nullable().optional(), // JSON
});

export const searchUserSavedRecommendationsInputSchema = z.object({
  user_saved_id: z.number().optional(),
  user_id: z.number().optional(),
  content_id: z.number().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
  sort_by: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'user_saved_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'user_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'content_id'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'saved_at'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'saved_at'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'),
  sort_order: z.enum(['"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'asc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"', '"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"']).default('"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'desc'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"'"')
});

export type UserSavedRecommendations = z.infer<typeof userSavedRecommendationsSchema>;
export type CreateUserSavedRecommendationsInput = z.infer<typeof createUserSavedRecommendationsInputSchema>;
export type UpdateUserSavedRecommendationsInput = z.infer<typeof updateUserSavedRecommendationsInputSchema>;
export type SearchUserSavedRecommendationsInput = z.infer<typeof searchUserSavedRecommendationsInputSchema>;







