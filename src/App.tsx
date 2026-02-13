import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Header from "./components/Header"
import Home from "./components/Home"
import BlogList from "./components/Blog/BlogList"
import BlogPost from "./components/Blog/BlogPost"
import { useTheme } from "./hooks/useTheme"
import { useMetrics } from "./hooks/useMetrics"
import { config } from "./config"

// Component to track metrics inside Router context
function MetricsTracker() {
  useMetrics()
  return null
}

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      {config.features.metrics && <MetricsTracker />}
      <Header theme={theme} onThemeToggle={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {config.features.blog && (
            <>
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </>
          )}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
