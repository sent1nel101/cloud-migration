/**
 * RoadmapDisplay Component
 * 
 * Displays the AI-generated career roadmap with all phases, skills, roles, and resources.
 * Includes print functionality for users to save/export their personalized roadmap.
 * 
 * Props:
 * - roadmap: Complete Roadmap object from API
 * 
 * Features:
 * - 4-phase milestone breakdown with actionable tasks
 * - Skill gaps analysis with visual indicators
 * - Recommended roles with salary/demand info
 * - Learning resources organized by category
 * - Printable layout optimized for PDF
 */

"use client";

import { useState } from "react";
import type { Roadmap } from "@/types/index";

interface RoadmapDisplayProps {
  /** AI-generated roadmap object to display */
  roadmap: Roadmap;
}

export default function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  // Track which resume version is selected (for Premium tier)
  const [selectedResumeIdx, setSelectedResumeIdx] = useState(0);

  /**
   * Triggers browser print dialog for PDF export.
   * Roadmap is already styled with @media print rules for clean output.
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="roadmap-container">
      <div className="roadmap-card" style={{ maxWidth: "896px", margin: "0 auto" }}>
        {/* Header */}
        <div className="roadmap-header">
          <h1>{roadmap.title}</h1>
          <p>{roadmap.summary}</p>

          <div className="timeline-grid">
            <div className="timeline-item">
              <div className="timeline-item-label">Timeline</div>
              <div className="timeline-item-value">
                {roadmap.timeline.total_months} months
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item-label">Start Date</div>
              <div className="timeline-item-value">
                {new Date(roadmap.timeline.start_date).toLocaleDateString()}
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-item-label">Target Completion</div>
              <div className="timeline-item-value">
                {new Date(
                  roadmap.timeline.estimated_completion
                ).toLocaleDateString()}
              </div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            Print Roadmap
          </button>
        </div>

        {/* Milestones */}
        <section className="milestones-section">
          <h2>Your Career Path</h2>
          <div>
            {roadmap.milestones.map((milestone) => (
              <div key={milestone.phase} className="milestone">
                <div className="milestone-header">
                  <div>
                    <h3>{milestone.title}</h3>
                    <p className="milestone-description">{milestone.description}</p>
                  </div>
                  <div className="milestone-duration">
                    {milestone.duration_months} months
                  </div>
                </div>
                <ul className="milestone-tasks">
                  {milestone.tasks.map((task, idx) => (
                    <li key={idx} className="milestone-task">
                      <span className="milestone-task-bullet">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Gaps */}
        {roadmap.skill_gaps && roadmap.skill_gaps.length > 0 && (
          <section className="skills-section">
            <h2>Skills You'll Need to Develop</h2>
            <div className="skills-grid">
              {roadmap.skill_gaps.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <span className="skill-dot"></span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Roles */}
        {roadmap.recommended_roles && roadmap.recommended_roles.length > 0 && (
          <section className="roles-section">
            <h2>Recommended Career Paths</h2>
            <div className="roles-grid">
              {roadmap.recommended_roles.map((role, idx) => (
              <div key={idx} className="role-card">
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <div className="role-meta">
                  <div className="role-meta-item">
                    <label>Demand</label>
                    <div style={{ display: "block", fontSize: "0.95rem", color: "var(--primary-color)", fontWeight: "600", marginTop: "0.25rem" }}>
                      {role.demand}
                    </div>
                  </div>
                  <div className="role-meta-item">
                    <label>Salary Range</label>
                    <div style={{ display: "block", fontSize: "0.95rem", color: "var(--primary-color)", fontWeight: "600", marginTop: "0.25rem" }}>
                      {role.salary_range}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </section>
        )}

        {/* Resources */}
        {roadmap.resource_categories && (
          <section style={{ margin: "2rem 0" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Learning Resources</h2>

            {/* Courses */}
            {roadmap.resource_categories.courses?.essential && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", color: "var(--primary-color)" }}>
                  Courses
                </h3>
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem" }}>Essential</h4>
                  <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: "1rem" }}>
                    {roadmap.resource_categories.courses.essential.map((course, idx) => (
                      <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                        • {course}
                      </li>
                    ))}
                  </ul>
                </div>
                {roadmap.resource_categories.courses.advanced && (
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.5rem" }}>Advanced</h4>
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      {roadmap.resource_categories.courses.advanced.map((course, idx) => (
                        <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                          • {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Certifications */}
            {roadmap.resource_categories.certifications && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", color: "var(--primary-color)" }}>
                  Certifications
                </h3>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {roadmap.resource_categories.certifications.map((cert, idx) => {
                    // Handle both string (FREE/PROFESSIONAL) and object (PREMIUM with ROI) formats
                    if (typeof cert === "string") {
                      return (
                        <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                          • {cert}
                        </li>
                      );
                    } else {
                      // Premium tier: show cert with ROI, cost, salary impact
                      return (
                        <li
                          key={idx}
                          style={{
                            padding: "0.75rem",
                            marginBottom: "0.75rem",
                            backgroundColor: "var(--bg-tertiary)",
                            borderRadius: "0.375rem",
                            borderLeft: "4px solid var(--primary-color)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                            <div>
                              <p style={{ fontWeight: "600", marginBottom: "0.25rem" }}>• {cert.cert}</p>
                              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                <span>⭐ ROI: {cert.roi}/100</span>
                                <span>💰 Cost: ${cert.cost}</span>
                                <span>⏱️ Time: {cert.time_months} months</span>
                              </div>
                            </div>
                            <div
                              style={{
                                backgroundColor: "var(--primary-color)",
                                color: "white",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "0.25rem",
                                fontSize: "0.85rem",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {cert.salary_impact}
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            )}

            {/* Communities */}
            {roadmap.resource_categories.communities && (
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", color: "var(--primary-color)" }}>
                  Communities
                </h3>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {roadmap.resource_categories.communities.map((community, idx) => (
                    <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                      • {community}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Professional Tier Content */}
        {(roadmap as any).professional_tier_content && (
          <section style={{ margin: "2rem 0", padding: "2rem", backgroundColor: "var(--bg-secondary)", borderRadius: "0.5rem", border: "2px solid var(--primary-color)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "var(--primary-color)" }}>
              ✓ Professional Tier Content
            </h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Real Courses & Learning Resources</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {(roadmap as any).professional_tier_content.courses && Array.isArray((roadmap as any).professional_tier_content.courses) ? (
                  (roadmap as any).professional_tier_content.courses.map((course: any, idx: number) => (
                    <li key={idx} style={{ padding: "0.75rem 0", color: "var(--text-primary)" }}>
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: "var(--primary-color)",
                          textDecoration: "none",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        🔗 {course.name}
                      </a>
                      {course.platform && <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginLeft: "0.5rem" }}>({course.platform})</span>}
                    </li>
                  ))
                ) : (
                  (roadmap as any).professional_tier_content.curated_courses?.map((course: string, idx: number) => (
                    <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                      • {course}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Industry Certifications</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {(roadmap as any).professional_tier_content.certifications && Array.isArray((roadmap as any).professional_tier_content.certifications) && (
                  (roadmap as any).professional_tier_content.certifications.map((cert: any, idx: number) => (
                    <li key={idx} style={{ padding: "0.75rem 0", color: "var(--text-primary)" }}>
                      <a 
                        href={cert.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: "var(--primary-color)",
                          textDecoration: "none",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        🏅 {cert.name}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Resume Enhancement Suggestions</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {(roadmap as any).professional_tier_content.resume_suggestions.map((suggestion: string, idx: number) => (
                  <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Portfolio Project Ideas</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {(roadmap as any).professional_tier_content.portfolio_ideas.map((idea: string, idx: number) => (
                  <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                    • {idea}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Premium Tier Content */}
        {(roadmap as any).premium_tier_content && (
          <section style={{ margin: "2rem 0", padding: "2rem", backgroundColor: "var(--bg-secondary)", borderRadius: "0.5rem", border: "2px solid #d4af37" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", color: "#d4af37" }}>
              ⭐ Premium Tier Content (Exclusive Career Coaching)
            </h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>AI-Powered Resume Rewrites (4 Versions)</h3>
              
              {/* Resume Tabs */}
              {(roadmap as any).premium_tier_content.resumes && Array.isArray((roadmap as any).premium_tier_content.resumes) && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {(roadmap as any).premium_tier_content.resumes.map((resume: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedResumeIdx(idx)}
                        style={{
                          padding: "0.5rem 1rem",
                          background: selectedResumeIdx === idx ? "var(--primary-color)" : "var(--bg-tertiary)",
                          color: selectedResumeIdx === idx ? "white" : "var(--text-primary)",
                          border: "1px solid var(--primary-color)",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {resume.type}
                      </button>
                    ))}
                  </div>
                  
                  {/* Resume Description */}
                  {(roadmap as any).premium_tier_content.resumes[selectedResumeIdx] && (
                    <>
                      <p style={{ color: "var(--text-secondary)", marginBottom: "0.75rem", fontSize: "0.9rem", fontStyle: "italic" }}>
                        {(roadmap as any).premium_tier_content.resumes[selectedResumeIdx].description}
                      </p>
                      
                      {/* Resume Content - render with whitespace preserved for bullets */}
                      <div style={{ color: "var(--text-primary)", padding: "1rem", backgroundColor: "var(--bg-primary)", borderRadius: "0.5rem", borderLeft: "4px solid #d4af37", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                        {(roadmap as any).premium_tier_content.resumes[selectedResumeIdx].content}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>LinkedIn Optimization Strategy</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {(roadmap as any).premium_tier_content.linkedin_optimization.map((tip: string, idx: number) => (
                  <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>1-on-1 Career Coaching Insights</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {(roadmap as any).premium_tier_content.career_coaching_insights.map((insight: string, idx: number) => (
                  <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.75rem" }}>Communities & Networking Groups</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {(roadmap as any).premium_tier_content.communities && Array.isArray((roadmap as any).premium_tier_content.communities) && (roadmap as any).premium_tier_content.communities.map((community: any, idx: number) => (
                  <li key={idx} style={{ padding: "0.75rem 0", color: "var(--text-primary)" }}>
                    <a 
                      href={community.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: "#d4af37",
                        textDecoration: "none",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      🔗 {community.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Next Steps */}
        {roadmap.next_steps && roadmap.next_steps.length > 0 && (
          <section style={{ padding: "2rem", backgroundColor: "var(--bg-secondary)", borderRadius: "0.5rem", margin: "2rem 0" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Next Steps</h2>
            <ol style={{ paddingLeft: "1.5rem" }}>
              {roadmap.next_steps.map((step, idx) => (
                <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
