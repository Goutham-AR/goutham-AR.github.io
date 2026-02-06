import { Link } from "react-router-dom"
import type { BlogMetadata } from "../../types/blog"
import styles from "./BlogCard.module.css"

interface BlogCardProps {
  post: BlogMetadata
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`} className={styles.card}>
      <article>
        <div className={styles.meta}>
          <time className={styles.date}>{formatDate(post.date)}</time>
          {post.readTime && <span className={styles.readTime}>{post.readTime}</span>}
        </div>
        
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export default BlogCard
