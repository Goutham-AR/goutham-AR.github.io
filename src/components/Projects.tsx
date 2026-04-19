import styles from "./Projects.module.css"

interface Project {
  title: string
  description: string
  tech: string[]
  highlight?: string
}

const projects: Project[] = [
  {
    title: "Solv",
    description: "Complete compiler toolchain from scratch: lexer, recursive descent parser, bytecode compiler, and a stack-based VM with OOP support and an interactive REPL. ~8,000 lines of C; benchmarks run 3–5× faster than a naive tree-walk interpreter.",
    tech: ["C", "Compiler Design", "VM"],
    highlight: "Systems Programming",
  },
  {
    title: "Cross-platform 2D/3D Game Engine",
    description: "Modular, layer-based engine with custom 2D/3D renderers, an event-driven input system, and CMake build configuration. Integrates GLFW, ImGui, and GLM; capable of rendering ~50K sprites at 60 fps on mid-range hardware.",
    tech: ["C++", "OpenGL", "GLFW", "ImGui"],
    highlight: "Graphics Programming",
  },
  {
    title: "Anchor DB",
    description: "Distributed key-value store built from scratch in C, progressing from an in-memory hash table through a full LSM-tree storage engine (MemTable, SSTable, WAL, compaction, Bloom filters) toward Raft-based consensus and hash-ring partitioning.",
    tech: ["C", "LSM-Tree", "Distributed Systems"],
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
