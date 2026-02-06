import type { BlogPost, BlogMetadata } from "../types/blog"

// This will be populated with blog posts at build time
const blogModules = import.meta.glob("/public/blogs/*.md", { 
  query: "?raw",
  import: "default",
  eager: true 
})

function parseFrontmatter(content: string): { metadata: Partial<BlogMetadata>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { metadata: {}, content }
  }

  const [, frontmatter, markdown] = match
  const metadata: Partial<BlogMetadata> = {}

  frontmatter.split("\n").forEach((line) => {
    const [key, ...values] = line.split(":")
    if (key && values.length) {
      const value = values.join(":").trim()
      if (key === "tags") {
        metadata[key] = value.split(",").map((tag) => tag.trim())
      } else {
        metadata[key as keyof BlogMetadata] = value as any
      }
    }
  })

  return { metadata, content: markdown }
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

function generateExcerpt(content: string, length = 160): string {
  const text = content.replace(/[#*`\[\]]/g, "").trim()
  return text.length > length ? text.substring(0, length) + "..." : text
}

export function getBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = []

  for (const path in blogModules) {
    const content = blogModules[path] as string
    const { metadata, content: markdown } = parseFrontmatter(content)
    
    const slug = path.split("/").pop()?.replace(".md", "") || ""
    const readTime = calculateReadTime(markdown)
    const excerpt = metadata.excerpt || generateExcerpt(markdown)

    posts.push({
      slug,
      title: metadata.title || "Untitled",
      date: metadata.date || new Date().toISOString().split("T")[0],
      excerpt,
      content: markdown,
      tags: metadata.tags,
      readTime: metadata.readTime || readTime,
    })
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug)
}

export function getBlogMetadata(): BlogMetadata[] {
  return getBlogPosts().map(({ content, ...metadata }) => metadata)
}
