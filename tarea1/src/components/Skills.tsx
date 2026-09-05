export default function Skills() {
  return (
    <section id="skills" className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-3xl font-bold text-blue-900 mb-6">Technical Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Programming Languages</h4>
          <p className="text-gray-600">Java, Python, C, C++, JavaScript, Assembly (RISC-V)</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Frameworks & Technologies</h4>
          <p className="text-gray-600">Spring Boot, React, Vite, ROS2</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Web & Tools</h4>
          <p className="text-gray-600">HTML, CSS, Tailwind, Express, Figma, GitHub, Visual Studio Code, Microsoft Office</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Languages</h4>
          <p className="text-gray-600">Spanish (Native), English (B2)</p>
        </div>
      </div>
    </section>
  );
}
