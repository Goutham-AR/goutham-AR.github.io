import styles from "./Projects.module.css"

interface Project {
  title: string
  description: string
  tech: string[]
  highlight?: string
}

const projects: Project[] = [
  {
    title: "Programming Language (Compiler/VM)",
    description: "Designed a custom compiler and Virtual Machine. Initially built in C++, then rewritten in Rust to leverage memory safety and concurrency features.",
    tech: ["C++", "Rust", "LLVM"],
    highlight: "Systems Programming",
  },
  {
    title: "3D Game Engine",
    description: "Built a lightweight engine using C++ and OpenGL. Features include custom rendering, input handling, and physics modules with a focus on modularity.",
    tech: ["C++", "OpenGL", "GLSL"],
    highlight: "Graphics Programming",
  },
  {
    title: "Distributed Key-Value Store",
    description: "Implemented a distributed store in Go using the RAFT consensus algorithm. Features leader election, log replication, and fault tolerance.",
    tech: ["Go", "RAFT", "gRPC"],
    highlight: "Distributed Systems",
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
