import React, { useState } from "react";

const Formulario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Mensaje enviado correctamente");
      } else {
        alert("Error al enviar el mensaje");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };  

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-[#F5F1EB] p-10 rounded-lg shadow-lg w-full max-w-md border-2 border-[#D1AE85]">
      <input name="nombre" type="text" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="p-3 rounded text-[#A89E97]" required />
      <input name="email" type="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} className="p-3  rounded text-[#A89E97]" required />
      <textarea name="mensaje" placeholder="Escribí tu mensaje..." value={formData.mensaje} onChange={handleChange} className="p-3 rounded h-24 text-[#A89E97]" required />

      {/* Botón para enviar el formulario */}
      <button type="submit" className="p-3 rounded-lg text-[#F5F1EB] font-semibold bg-[#D1AE85] hover:bg-[#A67C52] transition">
        Enviar mensaje
      </button>

      {/* Botón de WhatsApp */}
      <button
        type="button"
        onClick={() => window.open('https://wa.me/1151457318', '_blank')}
        className="bg-[#F5F1EB] border-2 font-semibold border-green-500 text-green-500 p-3 rounded-lg hover:bg-green-500 hover:text-[#F5F1EB] transition"
        >
            ¡Hablemos vía WhatsApp!
        </button>

    </form>
  );
};

export default Formulario;
