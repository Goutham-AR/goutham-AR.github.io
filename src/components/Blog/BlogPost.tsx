import { useEffect } from "react"
import { useParams, Link, Navigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { getBlogPost } from "../../utils/blogLoader"
import styles from "./BlogPost.module.css"
import "highlight.js/styles/github-dark.css"

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getBlogPost(slug) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="container">
      <article className={styles.article}>
        <header className={styles.header}>
          <Link to="/blog" className={styles.back}>
            <BackIcon />
            <span>Back to blog</span>
          </Link>
          
          <div className={styles.meta}>
            <time className={styles.date}>{formatDate(post.date)}</time>
            {post.readTime && <span className={styles.readTime}>{post.readTime}</span>}
          </div>
          
          <h1 className={styles.title}>{post.title}</h1>
          
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <span key={tag} className="tag tag--accent">{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className={styles.footer}>
          <Link to="/blog" className={styles.backButton}>
            ← Back to all posts
          </Link>
        </footer>
      </article>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)

export default BlogPost
