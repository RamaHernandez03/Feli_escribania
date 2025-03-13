import React from 'react';
import oficina from '../assets/feli3.jpg'; 

const colaboradores = [
  { nombre: 'Plan.Co', link: 'https://www.planco.ar/', categoria: 'Contable' },
  { nombre: 'Ignacio Alu', link: 'https://www.linkedin.com/in/ignacioalu/', categoria: 'Contable' },
  { nombre: 'Estudio Díaz Molina', link: 'https://www.linkedin.com/in/maria-florencia-diaz-molina-933291189/', categoria: 'Contable' },
  { nombre: 'Gisela Ríos', link: 'https://www.linkedin.com/in/gisela-rios-03b399159/', categoria: 'Derecho Marcario' },
  { nombre: 'Gisela Ríos', link: 'https://giselariosabogada.com/', categoria: 'Derecho Marcario' },
  { nombre: 'Marrac S.R.L.', link: 'https://www.marrac-srl.com/', categoria: 'Comercio Exterior' },
  { nombre: 'Mariano Martinuzzi', link: 'https://www.linkedin.com/in/mariano-martinuzzi/', categoria: 'Comercio Exterior' },
  { nombre: 'Yanina Leguizamon', link: '#', categoria: 'Logística y Habilitaciones' }
];

const Nosotros = () => {
  return (
    <div id="nosotros" className="bg-[#F5F1EB] min-h-screen flex items-center justify-center w-screen px-6 md:px-16 lg:px-24 py-12">
      <div className="flex flex-col md:flex-row max-w-7xl w-full items-center">
        <img
          src={oficina}
          alt="Oficina"
          className="w-full md:w-[40%] lg:w-[28%] rounded-xl shadow-lg object-cover mb-6 md:mb-0"
        />
        <div className="w-full md:w-3/4 md:ml-10 flex flex-col justify-center text-[#222222] text-center px-6 md:px-12">
          <h2 className="text-[#222222] text-3xl md:text-4xl font-bold relative inline-block pb-2 mx-auto">
            ¿Quiénes Somos?
            <span className="block w-40 md:w-64 h-1 mt-1 bg-[#D1AE85] mb-4 mx-auto"></span>
          </h2>
          <p className="mb-2 text-justify">
            Somos una escribanía con más de 10 años de experiencia en Derecho Societario y Registral, especializada en consultoría y asesoramiento ante organismos legales para empresas locales y extranjeras.
          </p>
          <p className="mb-2 text-justify">
            Trabajamos en conjunto con diversas áreas profesionales para ofrecer soluciones integrales y eficientes. Nuestro equipo, liderado por el Escribano Felipe La Riva junto a Rocío Torterola y María Celia Garcia Costero, combina modernidad y trayectoria en la función notarial.
          </p>
          <p className="text-justify">
            Nos comprometemos a brindar un servicio personalizado, garantizando seguridad jurídica con profesionalismo y confianza.
          </p>
          <h2 className="text-[#222222] mt-8 text-3xl md:text-4xl font-bold mx-auto">Colaboradores</h2>
          <span className="block w-40 md:w-60 h-1 mt-1 bg-[#D1AE85] mb-6 mx-auto"></span>
          <p className="text-justify mb-8">
            Creemos en el trabajo en equipo y en la importancia de rodearnos de profesionales que compartan nuestros valores de excelencia, confianza y compromiso.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
            {colaboradores.map((colaborador, index) => (
              <div key={index} className="mb-4 flex flex-col">
                <span className="text-[#222222] text-lg font-bold flex items-center">
                  <span className="text-[#D1AE85] mr-2 text-2xl">•</span>
                  <a 
                    href={colaborador.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-[#D1AE85] transition-colors whitespace-nowrap"
                  >
                    {colaborador.nombre}
                  </a>
                </span>
                <span className="text-sm text-[#555555] ml-5 whitespace-nowrap">{colaborador.categoria}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
