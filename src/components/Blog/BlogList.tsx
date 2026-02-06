import { useEffect } from "react"
import { getBlogMetadata } from "../../utils/blogLoader"
import BlogCard from "./BlogCard"
import styles from "./BlogList.module.css"

const BlogList = () => {
  const posts = getBlogMetadata()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container">
      <header className={styles.header}>
        <div className={styles.terminal}>
          <span className={styles.prompt}>$</span>
          <span className={styles.command}> cd ~/blog</span>
        </div>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Sharing my learnings in software engineering</p>
      </header>

      <section className={styles.content}>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default BlogList
