"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface AnalysisResult {
  needsAI: boolean
  title: string
  explanation: string
  alternatives?: string[]
}

export default function HomePage() {
  const [problem, setProblem] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!problem.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem: problem.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze problem")
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error analyzing problem:", error)
      // Show a fallback result
      setResult({
        needsAI: false,
        title: "Analysis Error",
        explanation: "Sorry, we couldn't analyze your problem right now. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setProblem("")
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Do you really need an Agent?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Paste your problem below and we'll tell you whether it actually needs an AI agent, or if there's a simpler
              solution.
            </p>
          </div>

          {/* Input Form */}
          {!result && (
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Describe your problem here... (e.g., 'I need to automatically respond to customer emails' or 'I want to organize my photo collection')"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="min-h-32 resize-none"
                    disabled={isLoading}
                  />
                  <Button type="submit" className="w-full" disabled={!problem.trim() || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze My Problem"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              <Card
                className={`shadow-lg border-2 ${
                  result.needsAI
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                    : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    {/* Removed emoji icons from results display */}
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-semibold mb-2 ${
                          result.needsAI ? "text-green-800 dark:text-green-200" : "text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {result.title}
                      </h3>
                      <h4
                        className={`text-sm font-medium mb-1 ${
                          result.needsAI ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        Why?
                      </h4>
                      <p
                        className={`mb-4 ${
                          result.needsAI ? "text-green-700 dark:text-green-300" : "text-yellow-700 dark:text-yellow-300"
                        }`}
                      >
                        {result.explanation}
                      </p>

                      {result.alternatives && result.alternatives.length > 0 && (
                        <div>
                          <h4
                            className={`font-medium mb-2 ${
                              result.needsAI
                                ? "text-green-800 dark:text-green-200"
                                : "text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            Suggested alternatives:
                          </h4>
                          <ul
                            className={`list-disc list-inside space-y-1 ${
                              result.needsAI
                                ? "text-green-700 dark:text-green-300"
                                : "text-yellow-700 dark:text-yellow-300"
                            }`}
                          >
                            {result.alternatives.map((alt, index) => (
                              <li key={index}>{alt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleReset} variant="outline" className="w-full bg-transparent">
                Try Another Problem
              </Button>
            </div>
          )}
        </div>
      </div>

      <footer className="p-4">
        <div className="text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/apb7-too"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              apb7-too
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
