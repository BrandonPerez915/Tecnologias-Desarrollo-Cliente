export default function Hero() {
  return (
    <header className="bg-blue-900 text-white py-20 px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">Brandon Pérez Saldaña</h1>
      <h2 className="text-2xl font-light mb-6">Software Engineering Student</h2>
      <div className="flex justify-center space-x-4 text-sm">
        <p>📍 Guadalajara, Jalisco</p>
        <p>✉️ brandon.perez@iteso.mx</p>
        <p>📱 33-1118-3557</p>
      </div>
      <div className="mt-6 flex justify-center space-x-6">
        <a href="https://github.com/BrandonPerez915" className="hover:text-blue-300 transition">GitHub</a>
        <a href="https://www.linkedin.com/in/brandon-p%C3%A9rez-714853286/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition">LinkedIn</a>
      </div>
    </header>
  );
}
