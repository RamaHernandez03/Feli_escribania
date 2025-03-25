import React from 'react';
import { useTranslation } from 'react-i18next';
import oficina from '../assets/feli3.jpg';
import MarqueeCarousel from '../components/CarruselClientes'; // Asegúrate de que la ruta es correcta

const Nosotros = () => {
  const { t } = useTranslation();
  const colaboradores = t('about.collaborators.list', { returnObjects: true });

  return (
    <div id="nosotros" className="bg-[#F5F1EB] min-h-screen flex flex-col items-center justify-center w-screen px-6 md:px-16 lg:px-24 py-12">
      <div className="flex flex-col md:flex-row max-w-7xl w-full items-center">
        <img
          src={oficina}
          alt="Oficina"
          className="w-full md:w-[40%] lg:w-[28%] rounded-xl shadow-lg object-cover mb-6 md:mb-0"
        />
        <div className="w-full md:w-3/4 md:ml-10 flex flex-col justify-center text-[#222222] text-center px-6 md:px-12">
          <h2 className="text-[#222222] text-3xl md:text-4xl font-bold relative inline-block pb-2 mx-auto">
            {t('about.title')}
            <span className="block w-40 md:w-64 h-1 mt-1 bg-[#D1AE85] mb-4 mx-auto"></span>
          </h2>
          <p className="mb-2 text-justify">{t('about.description1')}</p>
          <p className="mb-2 text-justify">{t('about.description2')}</p>
          <p className="text-justify">{t('about.description3')}</p>

          <h2 className="text-[#222222] mt-8 text-3xl md:text-4xl font-bold mx-auto">{t('about.collaborators.title')}</h2>
          <span className="block w-40 md:w-60 h-1 mt-1 bg-[#D1AE85] mb-6 mx-auto"></span>
          <p className="text-justify mb-8">{t('about.collaborators.description')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left w-full">
            {colaboradores.map((colaborador, index) => (
              <div key={index} className="mb-4 flex flex-col">
                <span className="text-[#222222] text-lg font-bold flex items-center">
                  <span className="text-[#D1AE85] mr-2 text-2xl">•</span>
                  <a 
                    href={colaborador.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-[#D1AE85] transition-colors break-words whitespace-normal"
                  >
                    {colaborador.name}
                  </a>
                </span>
                <span className="text-sm text-[#555555] ml-5 whitespace-normal">{colaborador.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold">{t('trust.title')}</h2>
        <span className="block w-72 h-1 bg-[#D1AE85] mt-2 mx-auto mb-6"></span>
        <p className="text-lg text-gray-700 text-justify max-w-4xl mx-auto mb-12">
           {t('trust.description')}
        </p>
      </div>
      <MarqueeCarousel/>
    </div>
  );
};

export default Nosotros;
