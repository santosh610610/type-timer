"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Timer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [randomText, setRandomText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [showChallenge, setShowChallenge] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateRandomText = useCallback(() => {
    const phrases = [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "How vexingly quick daft zebras jump!",
      "Sphinx of black quartz, judge my vow.",
      "Two driven jocks help fax my big quiz.",
      "The five boxing wizards jump quickly.",
      "Jackdaws love my big sphinx of quartz.",
      "The jay, pig, fox, zebra and my wolves quack!",
      "Quick zephyrs blow, vexing daft Jim.",
      "Watch 'Jeopardy!', Alex Trebek's fun TV quiz game.",
    ]
    const numLines = Math.random() < 0.5 ? 1 : 2
    const selectedPhrases = Array.from({ length: numLines }, () => phrases[Math.floor(Math.random() * phrases.length)])
    setRandomText(selectedPhrases.join(" "))
  }, [])

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time * 1000
      const updateTimer = () => {
        const newTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setTime(newTime)

        if (newTime === 285 && !showChallenge) {
          // 4 minutes and 45 seconds
          setShowChallenge(true)
          generateRandomText()
          if (inputRef.current) inputRef.current.focus()
        }

        timeoutRef.current = setTimeout(updateTimer, 100)
      }
      timeoutRef.current = setTimeout(updateTimer, 100)
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isRunning, showChallenge, generateRandomText, time])

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60

    return [hours, minutes, seconds].map((unit) => unit.toString().padStart(2, "0")).join(":")
  }

  const handleStartPause = () => {
    setIsRunning((prevState) => !prevState)
  }

  const handleStop = () => {
    setIsRunning(false)
    setTime(0)
  }

  const handleReset = () => {
    setTime(0)
    setIsRunning(false)
  }

  const handleChallengeSubmit = () => {
    if (userInput.toLowerCase() === randomText.toLowerCase()) {
      setTime(0)
      setIsRunning(true)
      setShowChallenge(false)
      setUserInput("")
      startTimeRef.current = Date.now()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="pt-12 px-8 pb-8 bg-white rounded-2xl shadow-md">
        {/* <h1 className="mb-6 text-4xl font-bold text-center text-gray-800">Simple Timer</h1> */}
        <div className="mb-8 text-6xl font-mono text-center text-gray-700">{formatTime(time)}</div>
        <div className="flex justify-center space-x-4 mb-4">
          <Button onClick={handleStartPause} className="w-24">
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={handleStop} className="w-24" variant="destructive">
            Stop
          </Button>
          <Button onClick={handleReset} className="w-24" variant="outline">
            Reset
          </Button>
        </div>
        {showChallenge && (
          <div className="mt-4">
            <p className="text-center mb-2 max-w-md">Type this text:</p>
            <p className="text-center mb-4 font-bold text-lg max-w-md">{randomText}</p>
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow"
                placeholder="Type the text here"
              />
              <Button onClick={handleChallengeSubmit}>Submit</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

