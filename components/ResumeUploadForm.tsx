/**
 * Resume Upload Form Component
 * Handles file upload with drag-and-drop support
 */

"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

interface ResumeUploadFormProps {
  onSuccess?: () => void
}

export default function ResumeUploadForm({ onSuccess }: ResumeUploadFormProps) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]
  const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"]
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload PDF, DOCX, or TXT files."
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum size is 5MB."
    }

    return null
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0]
      const validationError = validateFile(droppedFile)

      if (validationError) {
        setError(validationError)
        setFile(null)
      } else {
        setError("")
        setFile(droppedFile)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const validationError = validateFile(selectedFile)

    if (validationError) {
      setError(validationError)
      setFile(null)
    } else {
      setError("")
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    setLoading(true)
    setProgress(0)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Determine file type from extension
      const extension = file.name.split(".").pop()?.toLowerCase()
      let fileType = "txt"
      if (extension === "pdf") fileType = "pdf"
      if (extension === "docx") fileType = "docx"

      formData.append("fileType", fileType)

      // Upload and parse resume
      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to parse resume")
      }

      const parsedData = await response.json()

      // Store parsed data in session storage for review page
      sessionStorage.setItem("parsedResumeData", JSON.stringify(parsedData))

      // Navigate to review page
      router.push("/resume-review")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      setError(message)
      console.error("Upload error:", err)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="resume-upload-form">
      <div
        className={`upload-dropzone ${isDragging ? "dragging" : ""} ${
          file ? "has-file" : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleFileSelect}
          disabled={loading}
          style={{ display: "none" }}
        />

        <div className="upload-content">
          {!file ? (
            <>
              <div className="upload-icon">📄</div>
              <h3>Upload Your Resume</h3>
              <p>Drag and drop your resume here or click to browse</p>
              <p className="file-info">
                Supported formats: PDF, DOCX, TXT (Max 5MB)
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="btn btn-primary"
                style={{ marginTop: "1rem" }}
              >
                Choose File
              </button>
            </>
          ) : (
            <>
              <div className="upload-icon">✓</div>
              <h3>{file.name}</h3>
              <p className="file-size">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setError("")
                }}
                disabled={loading}
                className="btn btn-secondary"
                style={{ marginRight: "0.5rem" }}
              >
                Change File
              </button>
            </>
          )}
        </div>

        {loading && (
          <div className="upload-progress">
            <p>Parsing your resume...</p>
            <div
              style={{
                height: "4px",
                background: "var(--border-color)",
                borderRadius: "2px",
                marginTop: "0.5rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "var(--primary-color)",
                  animation: "pulse 2s infinite",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ marginTop: "1rem" }}>
          ⚠️ {error}
        </div>
      )}

      {file && !loading && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="btn btn-primary"
          style={{ marginTop: "1.5rem", width: "100%" }}
        >
          Parse Resume
        </button>
      )}

      <style>{`
        .resume-upload-form {
          width: 100%;
          max-width: 600px;
        }

        .upload-dropzone {
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--bg-secondary);
        }

        .upload-dropzone:hover {
          border-color: var(--primary-color);
          background: rgba(59, 130, 246, 0.05);
        }

        .upload-dropzone.dragging {
          border-color: var(--primary-color);
          background: rgba(59, 130, 246, 0.1);
          transform: scale(1.01);
        }

        .upload-dropzone.has-file {
          border-color: var(--primary-color);
          background: rgba(34, 197, 94, 0.05);
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .upload-dropzone h3 {
          margin: 0.5rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .upload-dropzone p {
          margin: 0.25rem 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .file-info {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          margin-top: 0.5rem;
        }

        .file-size {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .upload-progress {
          margin-top: 1rem;
          text-align: center;
        }

        .upload-progress p {
          margin: 0 0 0.5rem 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .error-message {
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          color: #ef4444;
          font-size: 0.9rem;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 640px) {
          .upload-dropzone {
            padding: 1.5rem 1rem;
          }

          .upload-icon {
            font-size: 2rem;
          }

          .upload-dropzone h3 {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
