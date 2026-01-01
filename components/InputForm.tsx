/**
 * InputForm Component
 *
 * Collects user career information for AI roadmap generation.
 * Includes validation and skill management with tag-based interface.
 *
 * Props:
 * - onSubmit: Callback fired when form is valid and submitted
 * - loading: Boolean to disable form during API call
 */

"use client"

import { useState, useEffect } from "react"
import type { CareerInput } from "@/types/index"

interface InputFormProps {
  /** Callback function to handle form submission with validated data */
  onSubmit: (data: CareerInput) => void
  /** Whether the form is disabled (during API call) */
  loading: boolean
  /** Optional initial values to prefill the form */
  initialValues?: Partial<CareerInput>
}

export default function InputForm({
  onSubmit,
  loading,
  initialValues,
}: InputFormProps) {
  // Main form state - mirrors CareerInput interface
  const [formData, setFormData] = useState<CareerInput>({
    currentRole: initialValues?.currentRole || "",
    yearsExperience: initialValues?.yearsExperience || 0,
    goals: initialValues?.goals || "",
    skills: initialValues?.skills || [],
    educationLevel: initialValues?.educationLevel || "Bachelor's",
  })

  // Update form when initialValues change (for prefilling from URL params)
  useEffect(() => {
    if (initialValues) {
      setFormData({
        currentRole: initialValues.currentRole || "",
        yearsExperience: initialValues.yearsExperience || 0,
        goals: initialValues.goals || "",
        skills: initialValues.skills || [],
        educationLevel: initialValues.educationLevel || "Bachelor's",
      })
    }
  }, [initialValues])

  // Temporary input for adding skills (separate from formData array)
  const [skillInput, setSkillInput] = useState("")

  /**
   * Handles input change for all form fields.
   * Converts yearsExperience to number, keeps others as strings.
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsExperience" ? parseInt(value) || 0 : value,
    }))
  }

  /**
   * Adds a skill to the skills array from the skill input field.
   * Validates input is not empty before adding.
   */
  const addSkill = () => {
    if (skillInput.trim() && formData.skills) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }))
      setSkillInput("") // Clear input after adding
    }
  }

  /**
   * Removes a skill from the array by index.
   */
  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index),
    }))
  }

  /**
   * Validates form and calls onSubmit callback.
   * Requires: currentRole and yearsExperience > 0.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.currentRole || formData.yearsExperience === 0) {
      alert("Please fill in all required fields")
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="form space-y-6">
      <h2>Tell Us About Your Career</h2>

      {/* Current Role */}
      <div className="form-group">
        <label className="form-label">Current Job Title *</label>
        <input
          type="text"
          name="currentRole"
          value={formData.currentRole}
          onChange={handleChange}
          placeholder="e.g., Marketing Manager, Software Engineer"
          className="form-input"
          required
        />
      </div>

      {/* Years of Experience */}
      <div className="form-group">
        <label className="form-label">Years of Experience *</label>
        <input
          type="number"
          name="yearsExperience"
          value={formData.yearsExperience}
          onChange={handleChange}
          min="0"
          max="70"
          className="form-input"
          required
        />
      </div>

      {/* Education Level */}
      <div className="form-group">
        <label className="form-label">Highest Education Level</label>
        <select
          name="educationLevel"
          value={formData.educationLevel}
          onChange={handleChange}
          className="form-select"
        >
          <option>High School</option>
          <option>Associate's</option>
          <option>Bachelor's</option>
          <option>Master's</option>
          <option>PhD</option>
          <option>Other</option>
        </select>
      </div>

      {/* Skills */}
      <div className="form-group">
        <label className="form-label">Top Skills (Add 3-5)</label>
        <div className="skills-input-group">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
            placeholder="e.g., Project Management, Python"
            className="form-input"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={addSkill}
            className="btn btn-small btn-primary"
            style={{ width: "auto" }}
          >
            Add
          </button>
        </div>
        <div className="skills-list">
          {formData.skills?.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="skill-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Career Goals */}
      <div className="form-group">
        <label className="form-label">What Are Your Career Goals? *</label>
        <textarea
          name="goals"
          value={formData.goals}
          onChange={handleChange}
          placeholder="e.g., Transition into AI/ML roles, Stay in current industry but use AI tools, Explore data science..."
          rows={4}
          className="form-textarea"
          required
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Generating Your Roadmap..." : "Generate My Career Roadmap"}
      </button>

      <div
        style={{
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "6px",
          padding: "1rem",
          marginTop: "1.5rem",
        }}
      >
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)", margin: 0 }}
        >
          <strong>Note:</strong> You can generate your roadmap without creating
          an account. However, roadmaps are only saved and available in your
          personal dashboard when you create a free account. This allows you to
          access and update your roadmaps anytime.
        </p>
      </div>

      <p
        className="text-center text-sm"
        style={{ color: "var(--text-tertiary)" }}
      >
        Your data is used only to generate your roadmap and is not stored.
      </p>
    </form>
  )
}
