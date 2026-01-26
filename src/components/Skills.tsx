import styles from "./Skills.module.css"

const skillsData = {
  "Programming Languages": ["C++", "Golang", "C", "Java", "TypeScript", "Python", "C#", "Zig"],
  "Frameworks & Libraries": ["React", "Gin", "Spring", "Express", "Qt", "FastAPI", "NestJs", "ASP.Net"],
  "Databases": ["MySQL", "PostgreSQL", "MongoDB"],
  "Others": ["Kafka", "Druid", "Azure", "Docker", "Kubernetes", "SignalR", "Grafana", "ECharts"],
}

const Skills = () => {
  return (
    <section className="section" id="skills">
      <h2>
        <span className="mono" style={{ color: "var(--text-muted)" }}>01.</span> Technical Skills
      </h2>
      
      <div className={styles.grid}>
        {Object.entries(skillsData).map(([category, skills]) => (
          <div key={category} className={styles.category}>
            <h3 className={styles.categoryTitle}>{category}</h3>
            <div className={styles.tags}>
              {skills.map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
