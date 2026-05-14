export type ActivityType = 'outdoor' | 'indoor' | 'productivity' | 'relaxation'
export type CategoryId = 'fitness' | 'study' | 'travel' | 'social' | 'relaxation'

export interface Activity {
  name: string
  emoji: string
  type: ActivityType
}

export interface CategoryInfo {
  id: CategoryId
  label: string
  icon: string
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'social', label: 'Social', icon: '🎉' },
  { id: 'relaxation', label: 'Relax', icon: '🧘' },
]

export type WeatherProfile = 'clear-warm' | 'clear-hot' | 'clear-cold' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy' | 'windy' | 'night'

export interface ActivitySuggestion {
  categories: Record<CategoryId, Activity[]>
  bestTimeToGoOutside: string
  suitabilityScore: number
  energyMood: string
  energyEmoji: string
  energyColor: string
  bgFrom: string
  bgVia: string
  bgTo: string
}

function getWeatherProfile(
  temp: number,
  code: number,
  wind: number,
): WeatherProfile {
  const h = new Date().getHours()
  const isNight = h < 6 || h >= 20

  if (code >= 95) return 'stormy'
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snowy'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy'
  if (code >= 45 && code <= 48) return 'foggy'
  if (wind >= 35) return 'windy'
  if (isNight && code <= 2) return 'night'
  if (code === 0 && temp >= 27) return 'clear-hot'
  if (code === 0 && temp >= 15) return 'clear-warm'
  if (code === 0) return 'clear-cold'
  if (code <= 3) return 'cloudy'
  if (temp >= 27) return 'clear-hot'
  if (temp >= 15) return 'clear-warm'
  return 'clear-cold'
}

const activities: Record<WeatherProfile, Record<CategoryId, Activity[]>> = {
  'clear-warm': {
    fitness: [
      { name: 'Cricket', emoji: '🏏', type: 'outdoor' },
      { name: 'Cycling', emoji: '🚴', type: 'outdoor' },
      { name: 'Running', emoji: '🏃', type: 'outdoor' },
      { name: 'Football', emoji: '⚽', type: 'outdoor' },
      { name: 'Tennis', emoji: '🎾', type: 'outdoor' },
      { name: 'Outdoor Yoga', emoji: '🧘', type: 'outdoor' },
      { name: 'Swimming', emoji: '🏊', type: 'outdoor' },
      { name: 'Gym Workout', emoji: '🏋️', type: 'indoor' },
      { name: 'Basketball', emoji: '🏀', type: 'outdoor' },
      { name: 'Hiking', emoji: '🥾', type: 'outdoor' },
      { name: 'Badminton', emoji: '🏸', type: 'indoor' },
      { name: 'Morning Stretch', emoji: '🤸', type: 'productivity' },
      { name: 'Walk & Think', emoji: '🚶', type: 'productivity' },
      { name: 'Park Walk', emoji: '🌳', type: 'relaxation' },
    ],
    study: [
      { name: 'Study in Park', emoji: '📚', type: 'outdoor' },
      { name: 'Photography', emoji: '📸', type: 'outdoor' },
      { name: 'Nature Sketching', emoji: '🎨', type: 'outdoor' },
      { name: 'Reading', emoji: '📖', type: 'indoor' },
      { name: 'Online Course', emoji: '💻', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Deep Work Session', emoji: '🧠', type: 'productivity' },
      { name: 'Learn a Skill', emoji: '📚', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
      { name: 'Listen to Podcast', emoji: '🎧', type: 'relaxation' },
    ],
    travel: [
      { name: 'City Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Road Trip', emoji: '🚗', type: 'outdoor' },
      { name: 'Beach Day', emoji: '🏖️', type: 'outdoor' },
      { name: 'Picnic', emoji: '🧺', type: 'outdoor' },
      { name: 'Sightseeing', emoji: '🏛️', type: 'outdoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Museum Visit', emoji: '🏛️', type: 'indoor' },
      { name: 'Plan Itinerary', emoji: '📋', type: 'productivity' },
      { name: 'Scenic Drive', emoji: '🚗', type: 'relaxation' },
      { name: 'Watch Travel Vlogs', emoji: '📺', type: 'relaxation' },
    ],
    social: [
      { name: 'Picnic with Friends', emoji: '🧺', type: 'outdoor' },
      { name: 'Beach Volleyball', emoji: '🏐', type: 'outdoor' },
      { name: 'BBQ Party', emoji: '🍖', type: 'outdoor' },
      { name: 'Cafe Hopping', emoji: '☕', type: 'outdoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Cooking Together', emoji: '🍳', type: 'indoor' },
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Networking Event', emoji: '🤝', type: 'productivity' },
      { name: 'Group Study', emoji: '👥', type: 'productivity' },
      { name: 'Hangout with Friends', emoji: '🍵', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Nature Walk', emoji: '🌳', type: 'outdoor' },
      { name: 'Sunbathing', emoji: '☀️', type: 'outdoor' },
      { name: 'Garden Stroll', emoji: '🌸', type: 'outdoor' },
      { name: 'Bird Watching', emoji: '🐦', type: 'outdoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Spa Day', emoji: '💆', type: 'indoor' },
      { name: 'Listen to Music', emoji: '🎵', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Mind Mapping', emoji: '🧠', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
      { name: 'Take a Nap', emoji: '😴', type: 'relaxation' },
    ],
  },
  'clear-hot': {
    fitness: [
      { name: 'Swimming', emoji: '🏊', type: 'outdoor' },
      { name: 'Surfing', emoji: '🏄', type: 'outdoor' },
      { name: 'Beach Volleyball', emoji: '🏐', type: 'outdoor' },
      { name: 'Indoor Gym', emoji: '🏋️', type: 'indoor' },
      { name: 'Indoor Swimming', emoji: '🏊', type: 'indoor' },
      { name: 'Early Morning Run', emoji: '🏃', type: 'outdoor' },
      { name: 'Table Tennis', emoji: '🏓', type: 'indoor' },
      { name: 'Exercise Break', emoji: '🏃', type: 'productivity' },
      { name: 'Light Stretching', emoji: '🧘', type: 'relaxation' },
    ],
    study: [
      { name: 'Photography Walk', emoji: '📸', type: 'outdoor' },
      { name: 'Reading', emoji: '📖', type: 'indoor' },
      { name: 'Online Course', emoji: '💻', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Deep Work Session', emoji: '🧠', type: 'productivity' },
      { name: 'Plan Your Week', emoji: '📋', type: 'productivity' },
      { name: 'Read by the Beach', emoji: '🌊', type: 'relaxation' },
    ],
    travel: [
      { name: 'Beach Day', emoji: '🏖️', type: 'outdoor' },
      { name: 'Pool Party', emoji: '🏊', type: 'outdoor' },
      { name: 'Road Trip to Coast', emoji: '🚗', type: 'outdoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Travel Vlogging', emoji: '🎥', type: 'indoor' },
      { name: 'Plan Itinerary', emoji: '📋', type: 'productivity' },
      { name: 'Watch Sunset', emoji: '🌅', type: 'relaxation' },
    ],
    social: [
      { name: 'Beach Party', emoji: '🎉', type: 'outdoor' },
      { name: 'BBQ', emoji: '🍖', type: 'outdoor' },
      { name: 'Pool Hangout', emoji: '🏊', type: 'outdoor' },
      { name: 'Ice Cream Date', emoji: '🍦', type: 'outdoor' },
      { name: 'Movie Night (AC)', emoji: '🎬', type: 'indoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Plan Group Outing', emoji: '📋', type: 'productivity' },
      { name: 'Evening Walk', emoji: '🚶', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Beside the Pool', emoji: '🏖️', type: 'outdoor' },
      { name: 'Sunbathing', emoji: '☀️', type: 'outdoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Cold Shower', emoji: '🚿', type: 'indoor' },
      { name: 'Listen to Music', emoji: '🎵', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Take a Nap', emoji: '😴', type: 'relaxation' },
    ],
  },
  'clear-cold': {
    fitness: [
      { name: 'Brisk Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Indoor Gym', emoji: '🏋️', type: 'indoor' },
      { name: 'Yoga', emoji: '🧘', type: 'indoor' },
      { name: 'Pilates', emoji: '🤸', type: 'indoor' },
      { name: 'Dance', emoji: '💃', type: 'indoor' },
      { name: 'Morning Stretch', emoji: '🤸', type: 'productivity' },
      { name: 'Walk in Sun', emoji: '🚶', type: 'relaxation' },
    ],
    study: [
      { name: 'Reading', emoji: '📖', type: 'indoor' },
      { name: 'Online Course', emoji: '💻', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'indoor' },
      { name: 'Deep Work Session', emoji: '🧠', type: 'productivity' },
      { name: 'Learn a Skill', emoji: '📚', type: 'productivity' },
      { name: 'Read by Window', emoji: '📖', type: 'relaxation' },
    ],
    travel: [
      { name: 'Scenic Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Travel Vlogging', emoji: '🎥', type: 'indoor' },
      { name: 'Plan Itinerary', emoji: '📋', type: 'productivity' },
      { name: 'Hot Chocolate Date', emoji: '☕', type: 'relaxation' },
    ],
    social: [
      { name: 'Cafe Meetup', emoji: '☕', type: 'outdoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Cooking Together', emoji: '🍳', type: 'indoor' },
      { name: 'Plan Weekend', emoji: '📋', type: 'productivity' },
      { name: 'Hot Drink Hangout', emoji: '☕', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Sunny Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Hot Bath', emoji: '🛁', type: 'indoor' },
      { name: 'Listen to Music', emoji: '🎵', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
    ],
  },
  cloudy: {
    fitness: [
      { name: 'Running', emoji: '🏃', type: 'outdoor' },
      { name: 'Cycling', emoji: '🚴', type: 'outdoor' },
      { name: 'Football', emoji: '⚽', type: 'outdoor' },
      { name: 'Hiking', emoji: '🥾', type: 'outdoor' },
      { name: 'Gym Workout', emoji: '🏋️', type: 'indoor' },
      { name: 'Badminton', emoji: '🏸', type: 'indoor' },
      { name: 'Walk & Think', emoji: '🚶', type: 'productivity' },
      { name: 'Music Walk', emoji: '🎧', type: 'relaxation' },
    ],
    study: [
      { name: 'Photography', emoji: '📸', type: 'outdoor' },
      { name: 'Study Session', emoji: '📚', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'indoor' },
      { name: 'Deep Work', emoji: '🧠', type: 'productivity' },
      { name: 'Plan Your Week', emoji: '📋', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
      { name: 'Brain Games', emoji: '🧩', type: 'relaxation' },
    ],
    travel: [
      { name: 'Walking Tour', emoji: '🚶', type: 'outdoor' },
      { name: 'Sightseeing', emoji: '🏛️', type: 'outdoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Museum Visit', emoji: '🏛️', type: 'indoor' },
      { name: 'Plan Itinerary', emoji: '📋', type: 'productivity' },
      { name: 'Scenic Drive', emoji: '🚗', type: 'relaxation' },
    ],
    social: [
      { name: 'Cafe Hopping', emoji: '☕', type: 'outdoor' },
      { name: 'Picnic', emoji: '🧺', type: 'outdoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Music Session', emoji: '🎸', type: 'indoor' },
      { name: 'Group Study', emoji: '👥', type: 'productivity' },
      { name: 'Hangout', emoji: '🍵', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Nature Walk', emoji: '🌳', type: 'outdoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Listen to Music', emoji: '🎵', type: 'indoor' },
      { name: 'Hot Coffee', emoji: '☕', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
    ],
  },
  rainy: {
    fitness: [
      { name: 'Gym Workout', emoji: '🏋️', type: 'indoor' },
      { name: 'Indoor Swimming', emoji: '🏊', type: 'indoor' },
      { name: 'Yoga', emoji: '🧘', type: 'indoor' },
      { name: 'Pilates', emoji: '🤸', type: 'indoor' },
      { name: 'Dance', emoji: '💃', type: 'indoor' },
      { name: 'Indoor Cycling', emoji: '🚴', type: 'indoor' },
      { name: 'Exercise Break', emoji: '🏃', type: 'productivity' },
      { name: 'Light Stretching', emoji: '🧘', type: 'relaxation' },
    ],
    study: [
      { name: 'Reading', emoji: '📖', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Online Course', emoji: '💻', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'indoor' },
      { name: 'Deep Work Session', emoji: '🧠', type: 'productivity' },
      { name: 'Learn a Skill', emoji: '📚', type: 'productivity' },
      { name: 'Read by Window', emoji: '🌧️', type: 'relaxation' },
    ],
    travel: [
      { name: 'Museum Visit', emoji: '🏛️', type: 'indoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Travel Vlogging', emoji: '🎥', type: 'indoor' },
      { name: 'Learn New Language', emoji: '🗣️', type: 'productivity' },
      { name: 'Watch Travel Films', emoji: '📺', type: 'relaxation' },
    ],
    social: [
      { name: 'Coffee Date', emoji: '☕', type: 'indoor' },
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Cooking Together', emoji: '🍳', type: 'indoor' },
      { name: 'Video Call Friends', emoji: '📱', type: 'indoor' },
      { name: 'Plan Weekend', emoji: '📋', type: 'productivity' },
      { name: 'Movie Marathon', emoji: '🎬', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Listen to Rain', emoji: '🌧️', type: 'indoor' },
      { name: 'Hot Coffee', emoji: '☕', type: 'indoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Hot Bath', emoji: '🛁', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
      { name: 'Take a Nap', emoji: '😴', type: 'relaxation' },
    ],
  },
  snowy: {
    fitness: [
      { name: 'Snow Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Indoor Gym', emoji: '🏋️', type: 'indoor' },
      { name: 'Yoga', emoji: '🧘', type: 'indoor' },
      { name: 'Indoor Swimming', emoji: '🏊', type: 'indoor' },
      { name: 'Morning Stretch', emoji: '🤸', type: 'productivity' },
      { name: 'Light Stretching', emoji: '🧘', type: 'relaxation' },
    ],
    study: [
      { name: 'Reading by Fire', emoji: '📖', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Online Course', emoji: '💻', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'indoor' },
      { name: 'Deep Work', emoji: '🧠', type: 'productivity' },
      { name: 'Learn a Skill', emoji: '📚', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
    ],
    travel: [
      { name: 'Snow Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Learn New Language', emoji: '🗣️', type: 'productivity' },
      { name: 'Watch Travel Films', emoji: '📺', type: 'relaxation' },
    ],
    social: [
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Hot Chocolate', emoji: '☕', type: 'indoor' },
      { name: 'Cooking Together', emoji: '🍳', type: 'indoor' },
      { name: 'Plan Weekend', emoji: '📋', type: 'productivity' },
      { name: 'Cozy Hangout', emoji: '🛋️', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Watch Snowfall', emoji: '❄️', type: 'indoor' },
      { name: 'Hot Chocolate', emoji: '☕', type: 'indoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Hot Bath', emoji: '🛁', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
      { name: 'Take a Nap', emoji: '😴', type: 'relaxation' },
    ],
  },
  stormy: {
    fitness: [
      { name: 'Indoor Workout', emoji: '🏋️', type: 'indoor' },
      { name: 'Yoga', emoji: '🧘', type: 'indoor' },
      { name: 'Dance', emoji: '💃', type: 'indoor' },
      { name: 'Stretching', emoji: '🤸', type: 'productivity' },
      { name: 'Deep Breathing', emoji: '🧘', type: 'relaxation' },
    ],
    study: [
      { name: 'Reading', emoji: '📖', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Online Course', emoji: '💻', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'indoor' },
      { name: 'Deep Work', emoji: '🧠', type: 'productivity' },
      { name: 'Listen to Podcast', emoji: '🎧', type: 'relaxation' },
    ],
    travel: [
      { name: 'Stay Indoors', emoji: '🏠', type: 'indoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Safety Check Home', emoji: '🔌', type: 'productivity' },
      { name: 'Watch Storm from Window', emoji: '🌩️', type: 'relaxation' },
    ],
    social: [
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Video Call Friends', emoji: '📱', type: 'indoor' },
      { name: 'Check on Neighbors', emoji: '🏠', type: 'productivity' },
      { name: 'Cozy Chat', emoji: '☕', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Stay Indoors', emoji: '🏠', type: 'indoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Listen to Rain', emoji: '🌧️', type: 'indoor' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
    ],
  },
  foggy: {
    fitness: [
      { name: 'Indoor Gym', emoji: '🏋️', type: 'indoor' },
      { name: 'Yoga', emoji: '🧘', type: 'indoor' },
      { name: 'Pilates', emoji: '🤸', type: 'indoor' },
      { name: 'Morning Stretch', emoji: '🤸', type: 'productivity' },
      { name: 'Gentle Yoga', emoji: '🧘', type: 'relaxation' },
    ],
    study: [
      { name: 'Reading', emoji: '📖', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'indoor' },
      { name: 'Deep Work', emoji: '🧠', type: 'productivity' },
      { name: 'Brain Games', emoji: '🧩', type: 'relaxation' },
    ],
    travel: [
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Travel Vlogging', emoji: '🎥', type: 'indoor' },
      { name: 'Learn New Language', emoji: '🗣️', type: 'productivity' },
      { name: 'Watch Travel Films', emoji: '📺', type: 'relaxation' },
    ],
    social: [
      { name: 'Cafe Meetup', emoji: '☕', type: 'indoor' },
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Video Call', emoji: '📱', type: 'indoor' },
      { name: 'Plan Group Event', emoji: '📋', type: 'productivity' },
      { name: 'Cozy Hangout', emoji: '🛋️', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Hot Coffee', emoji: '☕', type: 'indoor' },
      { name: 'Listen to Music', emoji: '🎵', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
    ],
  },
  windy: {
    fitness: [
      { name: 'Indoor Gym', emoji: '🏋️', type: 'indoor' },
      { name: 'Yoga', emoji: '🧘', type: 'indoor' },
      { name: 'Pilates', emoji: '🤸', type: 'indoor' },
      { name: 'Dance', emoji: '💃', type: 'indoor' },
      { name: 'Exercise Break', emoji: '🏃', type: 'productivity' },
      { name: 'Light Stretching', emoji: '🧘', type: 'relaxation' },
    ],
    study: [
      { name: 'Reading', emoji: '📖', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Online Course', emoji: '💻', type: 'indoor' },
      { name: 'Deep Work', emoji: '🧠', type: 'productivity' },
      { name: 'Listen to Podcast', emoji: '🎧', type: 'relaxation' },
    ],
    travel: [
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Travel Vlogging', emoji: '🎥', type: 'indoor' },
      { name: 'Learn New Language', emoji: '🗣️', type: 'productivity' },
      { name: 'Watch Travel Films', emoji: '📺', type: 'relaxation' },
    ],
    social: [
      { name: 'Cafe Meetup', emoji: '☕', type: 'indoor' },
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Board Games', emoji: '🎲', type: 'indoor' },
      { name: 'Cooking Together', emoji: '🍳', type: 'indoor' },
      { name: 'Plan Weekend', emoji: '📋', type: 'productivity' },
      { name: 'Cozy Hangout', emoji: '🛋️', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Hot Coffee', emoji: '☕', type: 'indoor' },
      { name: 'Listen to Music', emoji: '🎵', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'productivity' },
      { name: 'Read a Book', emoji: '📖', type: 'relaxation' },
    ],
  },
  night: {
    fitness: [
      { name: 'Night Run', emoji: '🏃', type: 'outdoor' },
      { name: 'Indoor Gym', emoji: '🏋️', type: 'indoor' },
      { name: 'Yoga', emoji: '🧘', type: 'indoor' },
      { name: 'Bedtime Stretch', emoji: '🤸', type: 'relaxation' },
    ],
    study: [
      { name: 'Night Reading', emoji: '📖', type: 'indoor' },
      { name: 'Coding', emoji: '💻', type: 'indoor' },
      { name: 'Journaling', emoji: '📝', type: 'indoor' },
      { name: 'Wind Down Write', emoji: '✍️', type: 'relaxation' },
    ],
    travel: [
      { name: 'Stargazing', emoji: '⭐', type: 'outdoor' },
      { name: 'Night Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Plan a Trip', emoji: '🗺️', type: 'indoor' },
      { name: 'Dream Destination', emoji: '🌟', type: 'relaxation' },
    ],
    social: [
      { name: 'Night Out', emoji: '🌃', type: 'outdoor' },
      { name: 'Movie Night', emoji: '🎬', type: 'indoor' },
      { name: 'Dinner Party', emoji: '🍽️', type: 'indoor' },
      { name: 'Video Call', emoji: '📱', type: 'indoor' },
      { name: 'Plan Tomorrow', emoji: '📋', type: 'productivity' },
      { name: 'Chill Hangout', emoji: '🛋️', type: 'relaxation' },
    ],
    relaxation: [
      { name: 'Stargazing', emoji: '⭐', type: 'outdoor' },
      { name: 'Night Walk', emoji: '🚶', type: 'outdoor' },
      { name: 'Listen to Music', emoji: '🎵', type: 'indoor' },
      { name: 'Meditation', emoji: '🧘', type: 'indoor' },
      { name: 'Prepare for Bed', emoji: '🌙', type: 'relaxation' },
    ],
  },
}

function getBestTime(
  profile: WeatherProfile,
  temp: number,
): string {
  switch (profile) {
    case 'clear-warm':
      return 'Anytime — perfect weather all day!'
    case 'clear-hot':
      return 'Early morning (6–9 AM) or evening (5–7 PM) — avoid peak heat'
    case 'clear-cold':
      return 'Late morning to early afternoon (10 AM – 3 PM) — warmest hours'
    case 'cloudy':
      return 'Midday (11 AM – 3 PM) — best light and comfort'
    case 'rainy':
      return 'Wait for a rain break — check radar before heading out'
    case 'snowy':
      return 'Late morning (10 AM – 1 PM) — best snow light'
    case 'stormy':
      return 'Not recommended — stay indoors until it passes'
    case 'foggy':
      return 'Late morning (10 AM onwards) — fog usually lifts by then'
    case 'windy':
      return 'Midday when winds are calmer'
    case 'night':
      return 'Now is the perfect time — enjoy the night!'
  }
}

function getSuitabilityScore(
  profile: WeatherProfile,
  temp: number,
  humidity: number,
  uv: number,
  wind: number,
  rainProb: number,
): number {
  let score = 50

  if (profile === 'clear-warm') score += 40
  else if (profile === 'clear-hot') score += 15
  else if (profile === 'cloudy') score += 20
  else if (profile === 'night') score += 20
  else if (profile === 'clear-cold') score += 10
  else if (profile === 'rainy') score -= 20
  else if (profile === 'snowy') score -= 10
  else if (profile === 'foggy') score -= 20
  else if (profile === 'windy') score -= 15
  else if (profile === 'stormy') score -= 40

  if (temp >= 18 && temp <= 28) score += 15
  else if (temp >= 10 && temp < 18) score += 5
  else if (temp >= 28 && temp <= 35) score += 5
  else if (temp > 35) score -= 10
  else if (temp < 0) score -= 10

  if (humidity >= 70) score -= 10
  if (uv >= 8) score -= 5
  if (wind >= 40) score -= 10
  else if (wind >= 25) score -= 5
  if (rainProb > 60) score -= 15
  else if (rainProb > 30) score -= 5

  return Math.max(0, Math.min(100, score))
}

function getEnergyMood(
  profile: WeatherProfile,
  temp: number,
): { mood: string; emoji: string; color: string } {
  switch (profile) {
    case 'clear-warm':
      return { mood: 'Energetic', emoji: '⚡', color: '#fbbf24' }
    case 'clear-hot':
      return { mood: 'Lazy', emoji: '😎', color: '#fb923c' }
    case 'clear-cold':
      return { mood: 'Focused', emoji: '🎯', color: '#60a5fa' }
    case 'cloudy':
      return { mood: 'Calm', emoji: '😌', color: '#94a3b8' }
    case 'rainy':
      return { mood: 'Cozy', emoji: '🫖', color: '#38bdf8' }
    case 'snowy':
      return { mood: 'Peaceful', emoji: '☮️', color: '#e2e8f0' }
    case 'stormy':
      return { mood: 'Intense', emoji: '🌩️', color: '#8b5cf6' }
    case 'foggy':
      return { mood: 'Mellow', emoji: '🌫️', color: '#64748b' }
    case 'windy':
      return { mood: 'Restless', emoji: '💨', color: '#818cf8' }
    case 'night':
      return { mood: 'Dreamy', emoji: '🌙', color: '#a78bfa' }
  }
}

function getGradient(profile: WeatherProfile): { bgFrom: string; bgVia: string; bgTo: string } {
  switch (profile) {
    case 'clear-warm':
      return { bgFrom: '#047857', bgVia: '#0d9488', bgTo: '#0369a1' }
    case 'clear-hot':
      return { bgFrom: '#c2410c', bgVia: '#ea580c', bgTo: '#d97706' }
    case 'clear-cold':
      return { bgFrom: '#075985', bgVia: '#1e40af', bgTo: '#312e81' }
    case 'cloudy':
      return { bgFrom: '#475569', bgVia: '#334155', bgTo: '#1f2937' }
    case 'rainy':
      return { bgFrom: '#1e3a5f', bgVia: '#1e293b', bgTo: '#312e81' }
    case 'snowy':
      return { bgFrom: '#334155', bgVia: '#1e3a5f', bgTo: '#1e1b4b' }
    case 'stormy':
      return { bgFrom: '#2e1065', bgVia: '#312e81', bgTo: '#0f172a' }
    case 'foggy':
      return { bgFrom: '#475569', bgVia: '#334155', bgTo: '#1f2937' }
    case 'windy':
      return { bgFrom: '#3730a3', bgVia: '#312e81', bgTo: '#1e1b4b' }
    case 'night':
      return { bgFrom: '#1e1b4b', bgVia: '#0f172a', bgTo: '#020617' }
  }
}

export function getActivitySuggestions(
  temp: number,
  humidity: number,
  wind: number,
  uv: number,
  code: number,
  rainProb: number,
): ActivitySuggestion {
  const profile = getWeatherProfile(temp, code, wind)

  const categories: Record<CategoryId, Activity[]> = {
    fitness: activities[profile].fitness,
    study: activities[profile].study,
    travel: activities[profile].travel,
    social: activities[profile].social,
    relaxation: activities[profile].relaxation,
  }

  const bestTimeToGoOutside = getBestTime(profile, temp)
  const suitabilityScore = getSuitabilityScore(profile, temp, humidity, uv, wind, rainProb)
  const energy = getEnergyMood(profile, temp)
  const { bgFrom, bgVia, bgTo } = getGradient(profile)

  return {
    categories,
    bestTimeToGoOutside,
    suitabilityScore,
    energyMood: energy.mood,
    energyEmoji: energy.emoji,
    energyColor: energy.color,
    bgFrom,
    bgVia,
    bgTo,
  }
}
