"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical } from "lucide-react"

type Answer = {
  answer: string
  isCorrect: boolean
  order: number
}

type Question = {
  question: string
  explanation: string
  order: number
  points: number
  answers: Answer[]
}

type Test = {
  title: string
  description: string
  passingScore: number
  timeLimit: number | null
  questions: Question[]
}

type Topic = {
  title: string
  description: string
  videoUrl: string
  duration: number
  order: number
  isFree: boolean
}

export type Section = {
  id?: string
  title: string
  description: string
  order: number
  requireTest: boolean
  topics: Topic[]
  test: Test | null
}

type SectionFormProps = {
  section: Section
  onUpdate: (section: Section) => void
  onRemove: () => void
  sectionIndex: number
}

export function SectionForm({ section, onUpdate, onRemove, sectionIndex }: SectionFormProps) {
  const updateField = (field: string, value: any) => {
    onUpdate({ ...section, [field]: value })
  }

  const addTopic = () => {
    const newTopics = [...section.topics, {
      title: "New Topic",
      description: "",
      videoUrl: "https://example.com/video.mp4",
      duration: 10,
      order: section.topics.length,
      isFree: false
    }]
    updateField("topics", newTopics)
  }

  const updateTopic = (index: number, field: string, value: any) => {
    const newTopics = [...section.topics]
    newTopics[index] = { ...newTopics[index], [field]: value }
    updateField("topics", newTopics)
  }

  const removeTopic = (index: number) => {
    updateField("topics", section.topics.filter((_, i) => i !== index))
  }

  const addTest = () => {
    updateField("test", {
      title: "Section Test",
      description: "Complete this test to unlock the next section",
      passingScore: 70,
      timeLimit: 30,
      questions: []
    })
  }

  const removeTest = () => {
    updateField("test", null)
    updateField("requireTest", false)
  }

  const updateTest = (field: string, value: any) => {
    if (section.test) {
      updateField("test", { ...section.test, [field]: value })
    }
  }

  const addQuestion = () => {
    if (section.test) {
      const newQuestions = [...section.test.questions, {
        question: "New question?",
        explanation: "",
        order: section.test.questions.length,
        points: 1,
        answers: [
          { answer: "Option A", isCorrect: true, order: 0 },
          { answer: "Option B", isCorrect: false, order: 1 }
        ]
      }]
      updateTest("questions", newQuestions)
    }
  }

  const updateQuestion = (qIndex: number, field: string, value: any) => {
    if (section.test) {
      const newQuestions = [...section.test.questions]
      newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value }
      updateTest("questions", newQuestions)
    }
  }

  const removeQuestion = (qIndex: number) => {
    if (section.test) {
      updateTest("questions", section.test.questions.filter((_, i) => i !== qIndex))
    }
  }

  const addAnswer = (qIndex: number) => {
    if (section.test) {
      const newQuestions = [...section.test.questions]
      newQuestions[qIndex].answers.push({
        answer: "New option",
        isCorrect: false,
        order: newQuestions[qIndex].answers.length
      })
      updateTest("questions", newQuestions)
    }
  }

  const updateAnswer = (qIndex: number, aIndex: number, field: string, value: any) => {
    if (section.test) {
      const newQuestions = [...section.test.questions]
      newQuestions[qIndex].answers[aIndex] = {
        ...newQuestions[qIndex].answers[aIndex],
        [field]: value
      }
      updateTest("questions", newQuestions)
    }
  }

  const removeAnswer = (qIndex: number, aIndex: number) => {
    if (section.test) {
      const newQuestions = [...section.test.questions]
      newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, i) => i !== aIndex)
      updateTest("questions", newQuestions)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Section {sectionIndex + 1}</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={section.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={section.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`requireTest-${sectionIndex}`}
                checked={section.requireTest}
                onCheckedChange={(checked) => updateField("requireTest", checked)}
              />
              <Label htmlFor={`requireTest-${sectionIndex}`} className="cursor-pointer">
                Require test completion to unlock next section
              </Label>
            </div>
          </div>
          <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Topics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Topics & Videos</h4>
            <Button type="button" variant="outline" size="sm" onClick={addTopic}>
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </div>
          {section.topics.map((topic, tIndex) => (
            <Card key={tIndex} className="bg-muted/50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Topic Title</Label>
                      <Input
                        value={topic.title}
                        onChange={(e) => updateTopic(tIndex, "title", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Video URL</Label>
                      <Input
                        value={topic.videoUrl}
                        onChange={(e) => updateTopic(tIndex, "videoUrl", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTopic(tIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={topic.description}
                    onChange={(e) => updateTopic(tIndex, "description", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={topic.duration}
                      onChange={(e) => updateTopic(tIndex, "duration", Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      checked={topic.isFree}
                      onCheckedChange={(checked) => updateTopic(tIndex, "isFree", checked)}
                    />
                    <Label className="cursor-pointer">Free Preview</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Section Test</h4>
            {!section.test ? (
              <Button type="button" variant="outline" size="sm" onClick={addTest}>
                <Plus className="mr-2 h-4 w-4" />
                Add Test
              </Button>
            ) : (
              <Button type="button" variant="destructive" size="sm" onClick={removeTest}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Test
              </Button>
            )}
          </div>

          {section.test && (
            <Card className="border-primary/50">
              <CardContent className="pt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Test Title</Label>
                    <Input
                      value={section.test.title}
                      onChange={(e) => updateTest("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Passing Score (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={section.test.passingScore}
                      onChange={(e) => updateTest("passingScore", Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={section.test.description}
                      onChange={(e) => updateTest("description", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Limit (minutes, 0 for no limit)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={section.test.timeLimit || 0}
                      onChange={(e) => updateTest("timeLimit", e.target.value === "0" ? null : Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Questions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </div>

                  {section.test.questions.map((question, qIndex) => (
                    <Card key={qIndex} className="bg-background">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Question {qIndex + 1}</Label>
                              <Textarea
                                value={question.question}
                                onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                                required
                                rows={2}
                              />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Explanation (shown after answer)</Label>
                                <Textarea
                                  value={question.explanation}
                                  onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Points</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(qIndex, "points", Number(e.target.value))}
                                />
                              </div>
                            </div>

                            {/* Answers */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Answers</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addAnswer(qIndex)}
                                >
                                  <Plus className="mr-2 h-3 w-3" />
                                  Add Answer
                                </Button>
                              </div>
                              {question.answers.map((answer, aIndex) => (
                                <div key={aIndex} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={answer.isCorrect}
                                    onCheckedChange={(checked) => updateAnswer(qIndex, aIndex, "isCorrect", checked)}
                                  />
                                  <Input
                                    value={answer.answer}
                                    onChange={(e) => updateAnswer(qIndex, aIndex, "answer", e.target.value)}
                                    placeholder="Answer option"
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAnswer(qIndex, aIndex)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(qIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
