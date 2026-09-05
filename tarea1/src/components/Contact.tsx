import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  // Para reflejar los cambios de los campos del formulario en el estado formData
  // se copia el estado actual y se sobreescribe la propiedad correspondiente al
  // campo que se está editando, usando el nombre del campo como clave.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos del formulario enviados:", formData);
    setIsSent(true);
  };

  return (
    <section id="contact" className="bg-blue-50 p-8 rounded-lg shadow-sm border border-blue-100">
      <h3 className="text-3xl font-bold text-blue-900 mb-6">Contact</h3>

      { /* Renderizado condicional: si el formulario ha sido enviado,
      mostrar un mensaje de exito; de lo contrario, mostrar el formulario. */ }
      {isSent ? (
        <div className="bg-green-100 text-green-800 p-4 rounded border border-green-200">
          ¡Thanks for your message, {formData.name}! I will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              required
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition">
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}
