import { type NextRequest, NextResponse } from "next/server"

interface AnalysisResult {
  needsAI: boolean
  title: string
  explanation: string
  alternatives?: string[]
}

// Keywords that typically indicate AI agent needs
const AI_KEYWORDS = [
  "natural language",
  "conversation",
  "chat",
  "understand context",
  "learning",
  "adapt",
  "personalize",
  "intelligent",
  "reasoning",
  "complex decision",
  "multiple steps",
  "workflow automation",
  "content generation",
  "creative",
  "analysis",
  "prediction",
]

// Keywords that suggest simpler solutions
const SIMPLE_KEYWORDS = [
  "schedule",
  "reminder",
  "backup",
  "sync",
  "copy",
  "move",
  "sort",
  "organize",
  "filter",
  "search",
  "notification",
  "alert",
  "report",
  "dashboard",
  "form",
  "database",
]

function analyzeProblem(problem: string): AnalysisResult {
  const lowerProblem = problem.toLowerCase()

  // Count AI vs simple indicators
  const aiScore = AI_KEYWORDS.filter((keyword) => lowerProblem.includes(keyword)).length

  const simpleScore = SIMPLE_KEYWORDS.filter((keyword) => lowerProblem.includes(keyword)).length

  // Specific pattern matching
  const needsComplexReasoning = /understand|interpret|analyze|decide|choose|recommend/i.test(problem)
  const needsPersonalization = /personalize|customize|adapt|learn/i.test(problem)
  const needsConversation = /chat|talk|conversation|dialogue|respond/i.test(problem)
  const isSimpleAutomation = /schedule|backup|sync|copy|move|sort|organize/i.test(problem)
  const isDataProcessing = /database|spreadsheet|csv|report|dashboard/i.test(problem)

  // Decision logic
  if (needsConversation || needsPersonalization || (needsComplexReasoning && aiScore > simpleScore)) {
    return {
      needsAI: true,
      title: "✅ This may need an AI Agent",
      explanation:
        "Your problem involves complex reasoning, personalization, or conversational interfaces that would benefit from AI capabilities.",
      alternatives:
        aiScore > 0
          ? [
              "Consider using existing AI platforms like ChatGPT API, Claude, or specialized AI tools",
              "Look into no-code AI builders like Zapier AI or Microsoft Power Platform AI Builder",
            ]
          : undefined,
    }
  }

  if (isSimpleAutomation || isDataProcessing || simpleScore > aiScore) {
    const alternatives = []

    if (isSimpleAutomation) {
      alternatives.push("Use automation tools like Zapier, IFTTT, or Microsoft Power Automate")
      alternatives.push("Write simple scripts in Python or JavaScript")
    }

    if (isDataProcessing) {
      alternatives.push("Use spreadsheet tools like Excel, Google Sheets, or Airtable")
      alternatives.push("Try database solutions like Notion, Supabase, or simple SQL databases")
    }

    if (/notification|alert|reminder/i.test(problem)) {
      alternatives.push("Use calendar apps, task managers, or notification services")
    }

    if (/website|form|dashboard/i.test(problem)) {
      alternatives.push("Use no-code builders like Webflow, Bubble, or Retool")
    }

    return {
      needsAI: false,
      title: "⚡ A simpler solution might work",
      explanation:
        "Your problem can likely be solved with existing tools, automation, or simple scripts without needing a full AI agent.",
      alternatives:
        alternatives.length > 0
          ? alternatives
          : [
              "Consider existing SaaS tools or simple automation",
              "Look into no-code/low-code platforms",
              "Try basic scripting or workflow automation tools",
            ],
    }
  }

  // Default case - lean towards simpler solution
  return {
    needsAI: false,
    title: "⚡ A simpler solution might work",
    explanation:
      "While your problem could potentially use AI, it might be worth exploring simpler alternatives first to save time and complexity.",
    alternatives: [
      "Research existing tools and services that solve similar problems",
      "Consider if basic automation or scripting could work",
      "Look into specialized software for your specific use case",
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const { problem } = await request.json()

    if (!problem || typeof problem !== "string") {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
    }

    const result = analyzeProblem(problem)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing problem:", error)
    return NextResponse.json({ error: "Failed to analyze problem" }, { status: 500 })
  }
}
