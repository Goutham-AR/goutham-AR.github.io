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
    period: "Sep 2023 - Present",
    highlights: [
      "Developed an autonomous AI system (AIDO) that eliminated manual coding tasks by automatically implementing changes from Azure DevOps work items through a multi agent orchestration engine, reducing average ticket resolution time.",
      "Eliminated critical performance bottlenecks by transitioning synchronous reporting to an asynchronous background worker architecture, integrated a real time progressive download manager that reduced API response times to sub-second levels and solved the issue of \"blind\" downloads with live progress tracking and automatic retries.",
      "Diagnosed and fixed a critical 30 second synchronization lag in an asynchronous architecture that caused stale invoice data, restored system integrity to high accuracy and eliminated customer-reported discrepancies.",
      "Built a high concurrency Go server serving 20+ developers daily to offload heavy unit testing and SonarQube analysis from local machines, saving the engineering team local computation time and resources per build cycle.",
      "Engineered an Azure based pipeline with at least once processing guarantees to handle 200K+ daily messages, enabling real time cleansing and analysis of massive volumes of fragmented invoice data.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Zero Pixels",
    period: "May 2023 - Sep 2023",
    highlights: [
      "Optimized database query patterns and indexing for a high traffic messaging app, achieving a reduction in query response times and smoother real time user interactions.",
      "Integrated and maintained Agenda for background job processing, including patching a private fork due to upstream inactivity.",
      "Replaced static reporting with an interactive B2B dashboard, providing stakeholders with real time data visualizations and automated API integrations that reduced reporting cycle time from weekly to on-demand.",
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
