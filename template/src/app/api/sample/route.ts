import { NextResponse } from 'next/server'
import { processEntries } from '@/lib/sampleService'
import type { VoiceEntry } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const entries: VoiceEntry[] = body.entries

    if (!Array.isArray(entries)) {
      return NextResponse.json(
        { error: 'Invalid input: entries must be an array' },
        { status: 400 }
      )
    }

    const result = processEntries(entries)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing entries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 