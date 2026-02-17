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
      "Developed AIDO, an autonomous AI system that automates coding tasks from Azure DevOps via a multi-agent orchestration engine to reduce ticket resolution time.",
      "Redesigned the report generation system from synchronous requests to an asynchronous architecture using WebSockets, providing instant API acknowledgments and real-time progress updates.",
      "Fixed a critical 30-second synchronization lag in asynchronous architecture to resolve production data inconsistencies and stale invoice data.",
      "Built a high-concurrency Go server to centralize unit testing and SonarQube analysis, saving local computation resources for over 20 developers.",
      "Engineered an Azure-based pipeline with at least-once processing guarantees to handle over 200K daily messages for real-time invoice data cleansing.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Zero Pixels",
    period: "May 2023 - Sep 2023",
    highlights: [
      "Optimized database query patterns and indexing for a high-traffic messaging application to improve response times.",
      "Integrated and maintained Agenda for background job processing, including patching a private fork.",
      "Developed three dashboard modules in React using ECharts for B2B analytics data visualization.",
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
