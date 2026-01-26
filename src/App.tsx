import "./App.css"
import Header from "./components/Header"
import Skills from "./components/Skills"
import Experience from "./components/Experience"
import Projects from "./components/Projects"
import Education from "./components/Education"
import Footer from "./components/Footer"

function App() {
  return (
    <main className="container">
      <Header />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Footer />
    </main>
  )
}

export default App
