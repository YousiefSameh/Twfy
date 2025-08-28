import { NextRequest, NextResponse } from 'next/server'
import { ConfigParser } from '@/lib/parser'
import { CssGenerator } from '@/lib/generator'
import { parseConfigString } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { config, options = {} } = await request.json()

    if (!config) {
      return NextResponse.json(
        { error: 'Config content is required' },
        { status: 400 }
      )
    }

    // Parse the config string into a JavaScript object
    const parsedConfig = parseConfigString(config)
    
    // Parse the Tailwind config into a normalized theme
    const parser = new ConfigParser()
    const { theme, report } = parser.parse(parsedConfig)
    
    // Generate CSS from the parsed theme
    const generator = new CssGenerator()
    const result = generator.generate(theme, options)
    
    // Merge parser report with generator result
    result.report = {
      ...result.report,
      ...report,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Conversion error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown conversion error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
