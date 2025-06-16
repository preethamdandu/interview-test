# Sentari Interview Template

Welcome candidate! This repository is a **self-contained sandbox**. It does _not_ connect to any Supabase instance or external API; everything you need is already here.

---

## 1 Project Setup
```bash
pnpm install     # install locked dev-dependencies
pnpm lint        # ESLint + Prettier (zero warnings allowed)
pnpm test        # Vitest unit tests – must be green
cp env.example .env  # (optional) add your OpenAI key to run live calls
```

## 2 Domain Types & Mock Data
* `src/lib/types.ts` – exact TypeScript interfaces used in production.
* `Expanded_Diary_Entries.csv` – 200-row fixture at repo root (all DB columns).
* `src/lib/mockData.ts` – loads the CSV at runtime and exports it as `mockVoiceEntries`.
* `src/lib/openai.ts` – optional helper: if `OPENAI_API_KEY` is present it calls the real API, otherwise returns deterministic stubs so tests still pass offline.

> **Note:** the CSV mirrors our current production schema, but you're welcome to add extra columns in your local copy if your solution needs them (e.g. a temporary `score` field). Keep the original columns untouched so our automated checker can still parse the file.

## 3 Your Only Job
Open `src/lib/sampleFunction.ts` and complete the body of `processEntries()`.  
Requirements:
1. Pure & synchronous (no network or file-system side-effects unless you use the provided OpenAI helper).  
2. Must return a `ProcessedResult` object (defined in `types.ts`).  
3. Update / add tests in `tests/sampleFunction.test.ts` so coverage is > 90 %.  

## 4 Rules
✅ Do
* Keep TypeScript `strict` errors at **0**.
* Run `pnpm lint --fix` before commit.
* Document non-trivial logic with JSDoc.

🚫 Don't
* Touch files outside `src/` or modify config files.
* Add runtime dependencies (dev-deps are allowed if justified).
* Commit any secrets – keep your `.env` file local.

## 5 Submit
1. Push your fork / repo to GitHub (public or private link).  
2. Share the repo URL or a `patch.diff` file per the job portal instructions.

## 6 Goal Detection Implementation

### How do we detect actionable intent?

1. **Pattern Recognition**
   - We use regex patterns to identify common goal expressions
   - Patterns include: "want to", "need to", "plan to", "going to", etc.
   - We also detect time-based intentions ("tomorrow I will...")
   - Each pattern is weighted based on its specificity

2. **Context Analysis**
   - We analyze the surrounding context of detected goals
   - Extract due dates using common time expressions
   - Categorize goals based on keywords and context
   - Calculate confidence scores based on multiple factors

3. **Deduplication**
   - We prevent duplicate goals using a case-insensitive comparison
   - Track unique tasks across multiple entries
   - Merge similar goals with different phrasings

### Why this structure?

1. **Modular Design**
   - Separate functions for different aspects (detection, categorization, date extraction)
   - Easy to extend with new patterns or categories
   - Pure functions for better testing and reliability

2. **Rich Metadata**
   - Each goal includes:
     - Task text (the actual goal)
     - Due date (when applicable)
     - Category (for organization)
     - Confidence score (for filtering)
     - Source entry ID (for tracking)

3. **Flexible Integration**
   - The structure allows for easy integration with:
     - Task management systems
     - Calendar applications
     - Progress tracking
     - Analytics and reporting

### Integration with Reminders and Summaries

1. **Reminder Integration**
   - Goals with due dates can be converted to calendar events
   - Confidence scores help prioritize important goals
   - Categories enable smart grouping and filtering

2. **Summary Generation**
   - Goals can be grouped by category for overview
   - Due dates help create timeline-based summaries
   - Confidence scores help highlight high-priority items

3. **Future Enhancements**
   - Add priority levels based on confidence and context
   - Implement goal dependencies and relationships
   - Add progress tracking and milestone detection
   - Integrate with existing task management systems

That's it — good luck and happy coding!