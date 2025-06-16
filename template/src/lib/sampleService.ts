import { VoiceEntry, ProcessedResult, DetectedGoal } from './types.js'

/**
 * Detects goals and intentions from a transcript
 * @param transcript The transcript text to analyze
 * @param entryId The ID of the source entry
 * @returns Array of detected goals or empty array if none found
 */
function detectGoals(transcript: string, entryId: string): DetectedGoal[] {
  const goals: DetectedGoal[] = []
  const seenTasks = new Set<string>() // Track unique tasks
  
  // Define regex patterns to match common goal/intention expressions
  const goalPatterns = [
    /(?:want|need|plan|going|intend|decided|aim|hope) to ([^.,!?]+)/gi,
    /(?:should|must|have to|got to) ([^.,!?]+)/gi,
    /(?:tomorrow|next week|this weekend|today|tonight) (?:I'm|I am|I will|I'll) ([^.,!?]+)/gi,
    /(?:by|before|until) ([^.,!?]+) (?:I will|I'll|I'm going to) ([^.,!?]+)/gi
  ]

  // Try each pattern on the transcript
  for (const pattern of goalPatterns) {
    let match
    // Find all matches in the transcript
    while ((match = pattern.exec(transcript)) !== null) {
      // Extract the task text from the match
      const taskText = match[1]?.trim() || match[2]?.trim()
      
      // Skip if no task text or if we've seen this task before
      if (!taskText || seenTasks.has(taskText.toLowerCase())) {
        continue
      }
      
      // Add to seen tasks
      seenTasks.add(taskText.toLowerCase())
      
      // Create a new goal object with the detected information
      goals.push({
        task_text: taskText,
        due_date: extractDueDate(transcript),
        status: 'pending',
        category: detectCategory(taskText, transcript),
        confidence: calculateConfidence(match[0], transcript),
        source_entry_id: entryId
      })
    }
  }

  return goals
}

/**
 * Detects the category of a goal based on keywords and context
 */
function detectCategory(taskText: string, transcript: string): string | null {
  const categories = {
    health: ['health', 'exercise', 'diet', 'sleep', 'doctor', 'dentist', 'fitness'],
    career: ['work', 'job', 'career', 'business', 'promotion', 'certification'],
    education: ['learn', 'study', 'course', 'degree', 'certification', 'language'],
    personal: ['relationship', 'family', 'friends', 'social', 'hobby'],
    finance: ['money', 'save', 'invest', 'budget', 'finance']
  }

  const text = (taskText + ' ' + transcript).toLowerCase()
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  
  return null
}

/**
 * Extracts due date from transcript if present
 * Looks for common date/time expressions and specific date formats
 */
function extractDueDate(transcript: string): string | null {
  const datePatterns = [
    /(?:by|before|until|on) (tomorrow|next week|this weekend|today|tonight|\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(?:due|deadline) (?:is|on) (tomorrow|next week|this weekend|today|tonight|\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(?:by|before|until) (?:the end of )?(this|next) (week|month|year)/i,
    /(?:by|before|until) (?:the )?(first|second|third|fourth|last) (week|month)/
  ]

  for (const pattern of datePatterns) {
    const match = transcript.match(pattern)
    if (match) {
      return match[1] // Return the captured date
    }
  }
  return null
}

/**
 * Calculates confidence score for detected goal
 * Higher confidence for:
 * - Longer matches (more specific goals)
 * - Matches at the start of the transcript (more likely to be main point)
 * - Presence of specific time/date (more concrete goal)
 */
function calculateConfidence(match: string, transcript: string): number {
  const matchLength = match.length
  const transcriptLength = transcript.length
  const position = transcript.indexOf(match) / transcriptLength
  
  // Base confidence from length and position
  let confidence = Math.min(1, (matchLength / 20) * (1 - position))
  
  // Bonus for having a specific date/time
  if (extractDueDate(transcript)) {
    confidence += 0.2
  }
  
  // Bonus for having a category
  if (detectCategory(match, transcript)) {
    confidence += 0.1
  }
  
  return Math.min(1, confidence)
}

/**
 * processEntries
 * --------------
 * PURE function — no IO, no mutation, deterministic.
 * Analyzes voice entries to detect goals, intentions, and tag frequencies.
 */
export function processEntries(entries: VoiceEntry[]): ProcessedResult {
  const tagFrequencies: Record<string, number> = {}
  const detectedGoals: DetectedGoal[] = []

  // Process each entry
  for (const entry of entries) {
    // Count frequency of each user tag
    for (const tag of entry.tags_user) {
      tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1
    }

    // Deduplicate only within this entry
    const seenTasks = new Set<string>()
    const goals = [
      ...detectGoals(entry.transcript_raw, entry.id),
      ...detectGoals(entry.transcript_user, entry.id)
    ]
    for (const goal of goals) {
      const taskKey = goal.task_text.toLowerCase()
      if (!seenTasks.has(taskKey)) {
        seenTasks.add(taskKey)
        detectedGoals.push(goal)
      }
    }
  }

  // Return the processed results
  return {
    summary: `Analyzed ${entries.length} entries and detected ${detectedGoals.length} goals`,
    tagFrequencies,
    detectedGoals
  }
}

export default processEntries 