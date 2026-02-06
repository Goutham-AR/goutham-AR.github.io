import Skills from "./Skills"
import Experience from "./Experience"
import Projects from "./Projects"
import Education from "./Education"
import Footer from "./Footer"

const Home = () => {
  return (
    <div className="container">
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Footer />
    </div>
  )
}

export default Home
