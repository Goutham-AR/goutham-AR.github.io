import styles from "./Education.module.css"

const Education = () => {
  return (
    <section className="section" id="education">
      <h2>
        <span className="mono" style={{ color: "var(--text-muted)" }}>04.</span> Education
      </h2>
      
      <div className={styles.card}>
        <div className={styles.icon}>
          <GraduationIcon />
        </div>
        <div className={styles.content}>
          <h3 className={styles.degree}>B-Tech in Computer Science</h3>
          <p className={styles.institution}>Muthoot Institute of Technology and Science</p>
          <time className={styles.year}>2019 - 2023</time>
        </div>
      </div>
    </section>
  )
}

const GraduationIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)

export default Education
