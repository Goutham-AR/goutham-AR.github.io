import styles from "./Projects.module.css"

interface Project {
  title: string
  description: string
  tech: string[]
  highlight?: string
}

const projects: Project[] = [
  {
    title: "Bytecode Compiled Interpreted Programming Language",
    description: "Features a lexical analyzer, recursive descent parser, and stack-based virtual machine with OOP support.",
    tech: ["C++", "Compiler Design", "VM"],
    highlight: "Systems Programming",
  },
  {
    title: "Cross-platform Game Engine",
    description: "Uses OpenGL, featuring a modular layer-based architecture, custom 2D/3D renderers, and an event-driven input system.",
    tech: ["C++", "OpenGL", "GLSL"],
    highlight: "Graphics Programming",
  },
  {
    title: "Distributed Key-Value Store",
    description: "Implements RAFT consensus for leader election and log replication with fault tolerance.",
    tech: ["Go", "RAFT", "Distributed Systems"],
    highlight: "Backend Systems",
  },
]

const Projects = () => {
  return (
    <section className="section" id="projects">
      <h2>
        <span className="mono" style={{ color: "var(--text-muted)" }}>03.</span> Featured Projects
      </h2>
      
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <article key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <FolderIcon />
              {project.highlight && (
                <span className={styles.highlight}>{project.highlight}</span>
              )}
            </div>
            
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>{project.description}</p>
            
            <div className={styles.tech}>
              {project.tech.map((t) => (
                <span key={t} className="tag tag--accent">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const FolderIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={styles.folderIcon}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
)

export default Projects
