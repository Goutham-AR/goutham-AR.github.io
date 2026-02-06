export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags?: string[]
  readTime?: string
}

export interface BlogMetadata {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  readTime?: string
}
