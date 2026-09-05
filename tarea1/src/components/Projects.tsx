const projectsData = [
  {
    title: "Autonomous Navigation Robot for Inclusive Mobility at ITESO",
    date: "01/2025 - Present",
    desc: "Autonomous assistive robot developed with ROS2, combining computer vision, A* navigation, GPS communication, and PID motor control to support inclusive mobility and guidance for people with disabilities at ITESO University."
  },
  {
    title: "Autonomous Coffee Bean Collection and Sorting Robot",
    date: "09/2024 - 01/2025",
    desc: "Developed an autonomous robot for coffee bean collection and transportation, implementing a PID-based motor control system and BFS navigation for obstacle avoidance and path planning. The project competed in the Mexican Robotics Tournament (TMR) at national and Latin American levels, achieving first place."
  },
  {
    title: "Java Clustering Library",
    date: "09/2024 - 01/2025",
    desc: "Developed a modular clustering library in Java, emphasizing clean architecture, extensibility, and performance. Implemented core clustering algorithms, customizable distance metrics, and validation methods to support scalable data processing."
  }
];

export default function Projects() {
  return (
    <section id="projects">
      <h3 className="text-3xl font-bold text-blue-900 mb-6">Relevant Projects</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.map((proj, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
            <h4 className="text-xl font-semibold mb-2">{proj.title}</h4>
            <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{proj.date}</span>
            <p className="mt-4 text-gray-600 text-sm">{proj.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
