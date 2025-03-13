import React from "react";
import Formulario from "./Formulario";

const Contacto = () => {
  return (
    <div id="contacto" className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-[#A89E97] p-6 md:p-16 text-white gap-12 relative">
      <div className="hidden md:block absolute left-1/2 top-[15%] bottom-[15%] w-[4px] bg-[#D1AE85] transform -translate-x-1/2"></div>
      <div className="w-full md:w-1/2 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block pb-2 text-[#F5F1EB]">
          Contacto
          <span className="block w-40 h-1 bg-[#D1AE85] mt-2 mx-auto"></span>
        </h2>
        <p className="mt-4 mb-6 text-lg text-[#F5F1EB] font-semibold">¿Alguna duda? Hablemos vía Email o WhatsApp.</p>
        <div className="w-full max-w-[500px]">
          <Formulario />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block pb-2 text-[#F5F1EB]">
          Ubicación
          <span className="block w-40 h-1 bg-[#D1AE85] mt-2 mx-auto"></span>
        </h2>
        <p className="mt-4 mb-6 text-lg text-[#F5F1EB] font-semibold">Encontranos en dirección 123, Buenos Aires, Argentina.</p>
        <div className="w-full max-w-[500px] h-[400px] rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10903.77221819789!2d-58.38382211947709!3d-34.6009201663054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac42dabce9b%3A0xbaa2d156dbe4138d!2zUGl6emVyw61hIEfDvGVycsOtbg!5e0!3m2!1sen!2sar!4v1741645317618!5m2!1sen!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contacto;

