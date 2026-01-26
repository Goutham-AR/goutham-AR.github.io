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
      "Designed a scalable Azure Function app using AI to cleanse invoice line items. The system processes 200K+ Kafka messages per day and utilizes PostgreSQL for analytics.",
      "Built a Kafka-to-Azure Queue pipeline featuring custom offset management to ensure exactly-once processing and horizontal scalability.",
      "Diagnosed synchronous HTTP bottlenecks and re-architected the system into an asynchronous background worker model, achieving sub-second API response times.",
      "Integrated SignalR for real-time frontend updates on job progress, combined with secure presigned URLs for Azure Blob Storage downloads.",
      "Developed a Node.js proxy for Druid with caching and authorization; implemented fine-grained access control using Open Policy Agent (OPA) and enhanced observability with Grafana.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "Zero Pixels",
    period: "May 2023 - Sep 2023",
    highlights: [
      "Built a dating app backend using Node.js, Express, and MongoDB, optimizing queries via custom indexes for a 40% speed increase.",
      "Led the development of a B2B dashboard using React, React Query, and ECharts for data visualization.",
      "Patched a private fork of the 'Agenda' library for background processing and resolved critical production bugs in collaboration with mobile developers.",
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
