import styles from "./Experience.module.css"

interface ExperienceItem {
  role: string
  company: string
  period: string
  highlights: string[]
}

const experiences: ExperienceItem[] = [
  {
    role: "Software Developer",
    company: "Zero Pixels",
    period: "May 2023 – Present",
    highlights: [
      "Built AIDO, an autonomous multi-agent system that reads Azure DevOps work items and implements code changes end-to-end, eliminating manual coding for ~40 recurring ticket types and cutting average resolution time from ~3 days to under 4 hours.",
      "Redesigned a synchronous report generation system into an async architecture with WebSocket-based (SignalR) progress streaming, reducing perceived wait time from 60–90 seconds of blocking to sub-second acknowledgment with live status updates.",
      "Diagnosed and resolved a 60-second synchronisation lag in an async invoice pipeline surfacing stale data to customers, root-caused to an event ordering issue and fixed with zero downtime.",
      "Built a high-concurrency Go server to offload unit test execution and SonarQube analysis from developer machines, serving 30+ engineers daily and saving an estimated 15–20 minutes per developer per build cycle.",
      "Engineered an Azure-based event pipeline with at-least-once delivery guarantees to process 200K+ daily invoice messages, enabling real-time cleansing and downstream analytics on fragmented financial data.",
      "Patched and maintained a private fork of the Agenda job scheduler after upstream went inactive, keeping background job processing stable across a production deployment.",
      "Sole developer for a client — built and delivered a data-heavy React web application end-to-end, including complex ECharts visualisations (multi-series time-series, drill-down charts), server-state management with TanStack Query, and REST API integration.",
    ],
  },
]

const Experience = () => {
  return (
    <section className="section" id="experience">
      <h2>
        <span className="mono" style={{ color: "var(--text-muted)" }}>02.</span> Work Experience
      </h2>
      
      <div className={styles.timeline}>
        {experiences.map((exp, index) => (
          <article key={index} className={styles.item}>
            <header className={styles.header}>
              <div>
                <h3 className={styles.role}>{exp.role}</h3>
                <p className={styles.company}>@ {exp.company}</p>
              </div>
              <time className={styles.period}>{exp.period}</time>
            </header>
            
            <ul className={styles.highlights}>
              {exp.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Experience
