import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Hobbies from './components/Hobbies';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Hero />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-16">
        <About />
        <Projects />
        <Skills />
        <Education />
        <Hobbies />
        <Contact />
      </main>
    </div>
  );
}

export default App;
