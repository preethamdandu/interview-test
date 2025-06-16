import { describe, it, expect } from 'vitest'
import { processEntries } from '../src/lib/sampleService.js'
import { VoiceEntry } from '../src/lib/types.js'

describe('processEntries', () => {
  // Test case 1: Verify goal detection from various patterns
  it('detects goals from voice entries', () => {
    // Create test entries with different types of goals
    const entries: VoiceEntry[] = [
      // Entry 1: "want to" pattern with a deadline
      {
        id: '1',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I want to learn Spanish before our trip to Madrid",
        transcript_user: "I want to learn Spanish before our trip to Madrid",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['language', 'travel'],
        category: null,
        created_at: '2024-03-20T10:00:00Z',
        updated_at: '2024-03-20T10:00:00Z',
        emotion_score_score: 0.5,
        embedding: null
      },
      // Entry 2: Time-based intention ("tomorrow I'm going to")
      {
        id: '2',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "Tomorrow I'm going to the dentist in the morning",
        transcript_user: "Tomorrow I'm going to the dentist in the morning",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['health'],
        category: null,
        created_at: '2024-03-20T11:00:00Z',
        updated_at: '2024-03-20T11:00:00Z',
        emotion_score_score: 0.3,
        embedding: null
      },
      // Entry 3: "need to" pattern with a deadline
      {
        id: '3',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I need to finish this certification course by July",
        transcript_user: "I need to finish this certification course by July",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['career', 'education'],
        category: null,
        created_at: '2024-03-20T12:00:00Z',
        updated_at: '2024-03-20T12:00:00Z',
        emotion_score_score: 0.7,
        embedding: null
      },
      // Entry 4: "plan to" pattern
      {
        id: '4',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I plan to start my own business by next summer",
        transcript_user: "I plan to start my own business by next summer",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['career', 'business'],
        category: null,
        created_at: '2024-03-20T13:00:00Z',
        updated_at: '2024-03-20T13:00:00Z',
        emotion_score_score: 0.8,
        embedding: null
      },
      // Entry 5: "should" pattern
      {
        id: '5',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I should sleep earlier, but I always end up scrolling late into the night",
        transcript_user: "I should sleep earlier, but I always end up scrolling late into the night",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['health', 'habits'],
        category: null,
        created_at: '2024-03-20T14:00:00Z',
        updated_at: '2024-03-20T14:00:00Z',
        emotion_score_score: 0.2,
        embedding: null
      },
      // Entry 6: "going to" pattern with specific time
      {
        id: '6',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I'm going to ask her out next weekend",
        transcript_user: "I'm going to ask her out next weekend",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['personal', 'social'],
        category: null,
        created_at: '2024-03-20T15:00:00Z',
        updated_at: '2024-03-20T15:00:00Z',
        emotion_score_score: 0.6,
        embedding: null
      },
      // Entry 7: "decided to" pattern
      {
        id: '7',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I've decided to finally quit smoking",
        transcript_user: "I've decided to finally quit smoking",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['health', 'habits'],
        category: null,
        created_at: '2024-03-20T16:00:00Z',
        updated_at: '2024-03-20T16:00:00Z',
        emotion_score_score: 0.9,
        embedding: null
      },
      // Entry 8: "have to" pattern
      {
        id: '8',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I have to finish my presentation slides by Friday",
        transcript_user: "I have to finish my presentation slides by Friday",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['work', 'deadline'],
        category: null,
        created_at: '2024-03-20T17:00:00Z',
        updated_at: '2024-03-20T17:00:00Z',
        emotion_score_score: 0.4,
        embedding: null
      },
      // Entry 9: "intend to" pattern (duplicate of entry 1 to test deduplication)
      {
        id: '9',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I intend to learn Spanish before our trip to Madrid",
        transcript_user: "I intend to learn Spanish before our trip to Madrid",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['language', 'travel'],
        category: null,
        created_at: '2024-03-20T18:00:00Z',
        updated_at: '2024-03-20T18:00:00Z',
        emotion_score_score: 0.7,
        embedding: null
      },
      // Entry 10: "aim to" pattern
      {
        id: '10',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I aim to run a marathon in under four hours",
        transcript_user: "I aim to run a marathon in under four hours",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['fitness', 'goal'],
        category: null,
        created_at: '2024-03-20T19:00:00Z',
        updated_at: '2024-03-20T19:00:00Z',
        emotion_score_score: 0.8,
        embedding: null
      }
    ]

    const result = processEntries(entries)

    // Verify the summary includes both entry count and goal count
    expect(result.summary).toBe('Analyzed 10 entries and detected 9 goals')

    // Verify tag frequencies are counted correctly
    expect(result.tagFrequencies).toEqual({
      'language': 2,
      'travel': 2,
      'health': 2,
      'career': 2,
      'education': 1,
      'business': 1,
      'habits': 2,
      'personal': 1,
      'social': 1,
      'work': 1,
      'deadline': 1,
      'fitness': 1,
      'goal': 1
    })

    // Verify we detected the expected number of goals (9 due to deduplication)
    expect(result.detectedGoals).toHaveLength(9)
    
    // Verify first goal: "want to" pattern with category
    expect(result.detectedGoals[0]).toMatchObject({
      task_text: 'learn Spanish',
      due_date: 'our trip to Madrid',
      status: 'pending',
      category: 'education',
      source_entry_id: '1',
      confidence: expect.any(Number)
    })

    // Verify second goal: time-based intention with category
    expect(result.detectedGoals[1]).toMatchObject({
      task_text: 'the dentist in the morning',
      due_date: 'tomorrow',
      status: 'pending',
      category: 'health',
      source_entry_id: '2',
      confidence: expect.any(Number)
    })

    // Verify third goal: "need to" pattern with category
    expect(result.detectedGoals[2]).toMatchObject({
      task_text: 'finish this certification course',
      due_date: 'July',
      status: 'pending',
      category: 'education',
      source_entry_id: '3',
      confidence: expect.any(Number)
    })

    // Verify fourth goal: "plan to" pattern with category
    expect(result.detectedGoals[3]).toMatchObject({
      task_text: 'start my own business',
      due_date: 'next summer',
      status: 'pending',
      category: 'career',
      source_entry_id: '4',
      confidence: expect.any(Number)
    })

    // Verify fifth goal: "should" pattern with category
    expect(result.detectedGoals[4]).toMatchObject({
      task_text: 'sleep earlier',
      status: 'pending',
      category: 'health',
      source_entry_id: '5',
      confidence: expect.any(Number)
    })

    // Verify sixth goal: "going to" pattern with category
    expect(result.detectedGoals[5]).toMatchObject({
      task_text: 'ask her out',
      due_date: 'next weekend',
      status: 'pending',
      category: 'personal',
      source_entry_id: '6',
      confidence: expect.any(Number)
    })

    // Verify seventh goal: "decided to" pattern with category
    expect(result.detectedGoals[6]).toMatchObject({
      task_text: 'finally quit smoking',
      status: 'pending',
      category: 'health',
      source_entry_id: '7',
      confidence: expect.any(Number)
    })

    // Verify eighth goal: "have to" pattern with category
    expect(result.detectedGoals[7]).toMatchObject({
      task_text: 'finish my presentation slides',
      due_date: 'Friday',
      status: 'pending',
      category: 'career',
      source_entry_id: '8',
      confidence: expect.any(Number)
    })

    // Verify ninth goal: "aim to" pattern with category
    expect(result.detectedGoals[8]).toMatchObject({
      task_text: 'run a marathon in under four hours',
      status: 'pending',
      category: 'health',
      source_entry_id: '10',
      confidence: expect.any(Number)
    })

    // Verify confidence scores are within valid range
    result.detectedGoals.forEach(goal => {
      expect(goal.confidence).toBeGreaterThanOrEqual(0)
      expect(goal.confidence).toBeLessThanOrEqual(1)
    })
  })

  // Test case 2: Verify handling of entries with no goals
  it('handles entries with no goals', () => {
    const entries: VoiceEntry[] = [
      {
        id: '1',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "Just had a great day at the beach",
        transcript_user: "Just had a great day at the beach",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['leisure'],
        category: null,
        created_at: '2024-03-20T10:00:00Z',
        updated_at: '2024-03-20T10:00:00Z',
        emotion_score_score: 0.8,
        embedding: null
      }
    ]

    const result = processEntries(entries)

    expect(result.summary).toBe('Analyzed 1 entries and detected 0 goals')
    expect(result.detectedGoals).toHaveLength(0)
    expect(result.tagFrequencies).toEqual({ 'leisure': 1 })
  })

  // Test case 3: Verify handling of empty entries array
  it('handles empty entries array', () => {
    const result = processEntries([])

    expect(result.summary).toBe('Analyzed 0 entries and detected 0 goals')
    expect(result.detectedGoals).toHaveLength(0)
    expect(result.tagFrequencies).toEqual({})
  })

  // Test case 4: Verify goal detection with mock data
  it('detects goals from mock data entries', () => {
    const entries: VoiceEntry[] = [
      {
        id: '1',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I want to get a promotion this year.",
        transcript_user: "I've been thinking I want to get a promotion this year.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['career'],
        category: null,
        created_at: '2025-06-01T09:00:00Z',
        updated_at: '2025-06-01T09:05:00Z',
        emotion_score_score: 0.05,
        embedding: null
      },
      {
        id: '2',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "My goal is to run a marathon in under four hours.",
        transcript_user: "My goal is to run a marathon in under four hours.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['fitness'],
        category: null,
        created_at: '2025-06-02T09:00:00Z',
        updated_at: '2025-06-02T09:05:00Z',
        emotion_score_score: 0.07,
        embedding: null
      },
      {
        id: '3',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I'm planning to start my own business by next summer.",
        transcript_user: "I've been thinking I'm planning to start my own business by next summer.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['career', 'business'],
        category: null,
        created_at: '2025-06-03T09:00:00Z',
        updated_at: '2025-06-03T09:05:00Z',
        emotion_score_score: 0.09,
        embedding: null
      },
      {
        id: '4',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I intend to learn Spanish before our trip to Madrid.",
        transcript_user: "I've been thinking I intend to learn Spanish before our trip to Madrid.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['language', 'travel'],
        category: null,
        created_at: '2025-06-04T09:00:00Z',
        updated_at: '2025-06-04T09:05:00Z',
        emotion_score_score: 0.11,
        embedding: null
      },
      {
        id: '5',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I really want to lose ten pounds before my birthday.",
        transcript_user: "I've been thinking I really want to lose ten pounds before my birthday.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['health', 'fitness'],
        category: null,
        created_at: '2025-06-05T09:00:00Z',
        updated_at: '2025-06-05T09:05:00Z',
        emotion_score_score: 0.13,
        embedding: null
      },
      {
        id: '6',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I need to finish this certification course by July.",
        transcript_user: "I've been thinking I need to finish this certification course by July.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['education', 'career'],
        category: null,
        created_at: '2025-06-06T09:00:00Z',
        updated_at: '2025-06-06T09:05:00Z',
        emotion_score_score: 0.15,
        embedding: null
      },
      {
        id: '7',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I'm going to ask her out next weekend.",
        transcript_user: "I've been thinking I'm going to ask her out next weekend.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['personal', 'social'],
        category: null,
        created_at: '2025-06-07T09:00:00Z',
        updated_at: '2025-06-07T09:05:00Z',
        emotion_score_score: 0.17,
        embedding: null
      },
      {
        id: '8',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I've decided to finally quit smoking.",
        transcript_user: "I've been thinking I've decided to finally quit smoking.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['health'],
        category: null,
        created_at: '2025-06-08T09:00:00Z',
        updated_at: '2025-06-08T09:05:00Z',
        emotion_score_score: 0.19,
        embedding: null
      },
      {
        id: '9',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I'm saving up to buy a new car.",
        transcript_user: "I've been thinking I'm saving up to buy a new car.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['finance'],
        category: null,
        created_at: '2025-06-09T09:00:00Z',
        updated_at: '2025-06-09T09:05:00Z',
        emotion_score_score: 0.21,
        embedding: null
      },
      {
        id: '10',
        user_id: 'user1',
        audio_url: null,
        transcript_raw: "I've been meaning to read at least one book a month.",
        transcript_user: "I've been thinking I've been meaning to read at least one book a month.",
        language_detected: 'en',
        language_rendered: 'en',
        tags_model: [],
        tags_user: ['education', 'habits'],
        category: null,
        created_at: '2025-06-10T09:00:00Z',
        updated_at: '2025-06-10T09:05:00Z',
        emotion_score_score: 0.23,
        embedding: null
      }
    ]

    const result = processEntries(entries)

    // Verify summary
    expect(result.summary).toBe('Analyzed 10 entries and detected 10 goals')

    // Verify tag frequencies
    expect(result.tagFrequencies).toEqual({
      'career': 3,
      'fitness': 2,
      'business': 1,
      'language': 1,
      'travel': 1,
      'health': 2,
      'education': 2,
      'personal': 1,
      'social': 1,
      'finance': 1,
      'habits': 1
    })

    // Verify goals
    expect(result.detectedGoals).toHaveLength(10)

    // Verify first goal (promotion)
    expect(result.detectedGoals[0]).toMatchObject({
      task_text: 'get a promotion',
      due_date: 'this year',
      status: 'pending',
      category: 'career',
      source_entry_id: '1',
      confidence: expect.any(Number)
    })

    // Verify second goal (marathon)
    expect(result.detectedGoals[1]).toMatchObject({
      task_text: 'run a marathon in under four hours',
      status: 'pending',
      category: 'health',
      source_entry_id: '2',
      confidence: expect.any(Number)
    })

    // Verify third goal (business)
    expect(result.detectedGoals[2]).toMatchObject({
      task_text: 'start my own business',
      due_date: 'next summer',
      status: 'pending',
      category: 'career',
      source_entry_id: '3',
      confidence: expect.any(Number)
    })

    // Verify fourth goal (Spanish)
    expect(result.detectedGoals[3]).toMatchObject({
      task_text: 'learn Spanish',
      due_date: 'our trip to Madrid',
      status: 'pending',
      category: 'education',
      source_entry_id: '4',
      confidence: expect.any(Number)
    })

    // Verify fifth goal (weight loss)
    expect(result.detectedGoals[4]).toMatchObject({
      task_text: 'lose ten pounds',
      due_date: 'my birthday',
      status: 'pending',
      category: 'health',
      source_entry_id: '5',
      confidence: expect.any(Number)
    })

    // Verify sixth goal (certification)
    expect(result.detectedGoals[5]).toMatchObject({
      task_text: 'finish this certification course',
      due_date: 'July',
      status: 'pending',
      category: 'education',
      source_entry_id: '6',
      confidence: expect.any(Number)
    })

    // Verify seventh goal (asking out)
    expect(result.detectedGoals[6]).toMatchObject({
      task_text: 'ask her out',
      due_date: 'next weekend',
      status: 'pending',
      category: 'personal',
      source_entry_id: '7',
      confidence: expect.any(Number)
    })

    // Verify eighth goal (quit smoking)
    expect(result.detectedGoals[7]).toMatchObject({
      task_text: 'finally quit smoking',
      status: 'pending',
      category: 'health',
      source_entry_id: '8',
      confidence: expect.any(Number)
    })

    // Verify ninth goal (saving for car)
    expect(result.detectedGoals[8]).toMatchObject({
      task_text: 'saving up to buy a new car',
      status: 'pending',
      category: 'finance',
      source_entry_id: '9',
      confidence: expect.any(Number)
    })

    // Verify tenth goal (reading)
    expect(result.detectedGoals[9]).toMatchObject({
      task_text: 'read at least one book a month',
      status: 'pending',
      category: 'education',
      source_entry_id: '10',
      confidence: expect.any(Number)
    })

    // Verify confidence scores are within valid range
    result.detectedGoals.forEach(goal => {
      expect(goal.confidence).toBeGreaterThanOrEqual(0)
      expect(goal.confidence).toBeLessThanOrEqual(1)
    })
  })
}) 