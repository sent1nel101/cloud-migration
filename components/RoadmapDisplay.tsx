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

import type { Roadmap } from "@/types/index";

interface RoadmapDisplayProps {
  /** AI-generated roadmap object to display */
  roadmap: Roadmap;
}

export default function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
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

        {/* Recommended Roles */}
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

        {/* Resources */}
        <section style={{ margin: "2rem 0" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Learning Resources</h2>

          {/* Courses */}
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
          </div>

          {/* Certifications */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", color: "var(--primary-color)" }}>
              Certifications
            </h3>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {roadmap.resource_categories.certifications.map((cert, idx) => (
                <li key={idx} style={{ padding: "0.5rem 0", color: "var(--text-primary)" }}>
                  • {cert}
                </li>
              ))}
            </ul>
          </div>

          {/* Communities */}
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
        </section>

        {/* Next Steps */}
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
      </div>
    </div>
  );
}
