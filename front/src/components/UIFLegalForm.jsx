import React, { useState, useRef } from 'react';
import logoFile from '../assets/Logo_feli.jpg';

const UIFLegalForm = () => {
  // Estados principales
  const [currentPersonType, setCurrentPersonType] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState(null);
  const [representativeCounter, setRepresentativeCounter] = useState(0);
  const [representatives, setRepresentatives] = useState([]);
  const [status, setStatus] = useState({ message: '', type: '', show: false });
  const [progress, setProgress] = useState(0);
  const [showPepDetails, setShowPepDetails] = useState(false);
  const [estadoCivil, setEstadoCivil] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referencias para los inputs de archivo
  const fileInputRefs = useRef({});

  // Configuración del cliente
  const LAWYER_INFO = {
    name: "Dr. La Riva",
    phone: "5491122519275",
    address: " Sarmiento 1469, C1042ABA Cdad. Autónoma de Buenos Aires",
  };

  // Función para mostrar estado
  const showStatus = (message, type = 'info') => {
    setStatus({ message, type, show: true });
    setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 5000);
  };

  // Función para actualizar progreso
  const updateProgress = (percentage) => {
    setProgress(percentage);
  };

  // Función para alternar tipo de persona
  const togglePersonType = (type) => {
    setCurrentPersonType(type);
    setUploadedFiles({}); // Limpiar archivos al cambiar tipo
    showStatus(`Formulario configurado para ${type === 'fisica' ? 'Persona Física' : 'Persona Jurídica'}`, 'success');
  };

  // Función para agregar representante
  const addRepresentative = () => {
    const newId = representativeCounter + 1;
    setRepresentativeCounter(newId);
    setRepresentatives(prev => [...prev, { id: newId }]);
  };

  // Función para eliminar representante
  const removeRepresentative = (id) => {
    setRepresentatives(prev => prev.filter(rep => rep.id !== id));
  };

  // Función para obtener icono de archivo
  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('text')) return '📃';
    return '📁';
  };

  // Componente para preview de archivos
  const FilePreview = ({ files, inputId, isEmbedded = false }) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-white/50 rounded-lg border border-[#D1AE85]/30">
        {Array.from(files).map((file, index) => (
          <div key={index} className="mb-3">
            {file.type.startsWith('image/') ? (
              <div>
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={file.name}
                  className="max-w-48 max-h-36 rounded-lg shadow-md border border-[#D1AE85]/20"
                />
                <p className="text-sm text-gray-600 mt-2">
                  📷 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {getFileIcon(file.type)} {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {isEmbedded && (
              <div className="bg-[#D1AE85]/10 border border-[#D1AE85]/30 rounded-md p-2 mt-2 text-xs text-[#A67C52]">
                📎 Documento Adjuntado correctamente.
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Función para manejar carga de archivos
  const handleFileUpload = (event, inputId) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        setUploadedFiles(prev => {
            const existingFiles = prev[inputId] ? Array.from(prev[inputId]) : [];
            const newFiles = Array.from(event.target.files);
            return {
              ...prev,
              [inputId]: [...existingFiles, ...newFiles]
            };
          });
      showStatus(`${files.length} archivo(s) seleccionado(s) correctamente`, 'success');
    }
  };

  // Función para abrir selector de archivos
  const openFileSelector = (inputId) => {
    if (fileInputRefs.current[inputId]) {
      fileInputRefs.current[inputId].click();
    }
  };

  // Función para recopilar datos del formulario
  const collectFormData = (form) => {
    const data = new FormData(form);
    const formObject = {};
    
    for (let [key, value] of data.entries()) {
      formObject[key] = value;
    }
    
    formObject.tipoPersona = currentPersonType;
    formObject.fechaGeneracion = new Date().toLocaleString('es-AR');
    
    // Recopilar representantes
    if (currentPersonType === 'juridica') {
      formObject.representantes = representatives.map(rep => ({
        nombre: formObject[`rep${rep.id}_nombre`] || '',
        cargo: formObject[`rep${rep.id}_cargo`] || '',
        vto: formObject[`rep${rep.id}_vto`] || '',
        esPEP: formObject[`rep${rep.id}_pep`] === 'on'
      })).filter(rep => rep.nombre);
    }
    
    return formObject;
  };

  // Función para convertir archivo a array buffer
  const fileToArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Función para cargar PDF-lib de forma dinámica
  const loadPDFLib = async () => {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, usarlo
      if (window.PDFLib) {
        resolve(window.PDFLib);
        return;
      }

      // Crear y cargar el script
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
      script.onload = () => {
        if (window.PDFLib) {
          resolve(window.PDFLib);
        } else {
          reject(new Error('PDF-lib no se cargó correctamente'));
        }
      };
      script.onerror = () => reject(new Error('Error cargando PDF-lib'));
      document.head.appendChild(script);
    });
  };

  // Función mejorada para generar PDF usando plantilla
  const generatePDFWithEmbeddedFiles = async (data, files) => {
    try {
      updateProgress(10);
      showStatus('Cargando PDF-lib...', 'info');
  
      // Cargar PDF-lib
      const PDFLib = await loadPDFLib();
      const { PDFDocument, rgb, StandardFonts } = PDFLib;
  
      updateProgress(20);
      showStatus('Cargando plantilla PDF...', 'info');
  
      // Cargar la plantilla PDF
      const templateBytes = await fetch('/plantilla.pdf').then(res => res.arrayBuffer());
      const templateDoc = await PDFDocument.load(templateBytes);
      const pdfDoc = await PDFDocument.create();
      
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      updateProgress(30);
  
      // Función para limpiar texto
      const cleanText = (text) => {
        if (!text) return '';
        return text.toString().replace(/[^\x00-\x7F]/g, '').trim();
      };
  
      // Copiar la primera página de la plantilla
      const [templatePage] = await pdfDoc.copyPages(templateDoc, [0]);
      let currentPage = pdfDoc.addPage(templatePage);
      const { width, height } = currentPage.getSize();
      
      // Definir área de escritura (ajustar según tu plantilla)
      const marginTop = 200; 
      const marginBottom = 140; 
      const marginLeft = 90;
      const marginRight = 50;
      const writableHeight = height - marginTop - marginBottom;
      
      let yPosition = height - marginTop;
      const lineHeight = 15;
      const maxWidth = width - marginLeft - marginRight;
  
      // Función para agregar nueva página con plantilla
      const addNewPage = async () => {
        try {
          // Copiar una nueva página de la plantilla original
          const [newTemplatePage] = await pdfDoc.copyPages(templateDoc, [0]);
          currentPage = pdfDoc.addPage(newTemplatePage);
          yPosition = height - marginTop;
          return currentPage;
        } catch (error) {
          console.error('Error creando nueva página:', error);
          // Fallback: crear página en blanco
          currentPage = pdfDoc.addPage([width, height]);
          yPosition = height - marginTop;
          return currentPage;
        }
      };
  
      // Función mejorada para agregar texto con control de página
      const addText = async (text, x, y, options = {}) => {
        // Verificar si necesitamos una nueva página ANTES de escribir
        if (y < marginBottom + 20) {
          await addNewPage();
          y = height - marginTop;
        }
        
        const cleanedText = cleanText(text);
        const fontSize = options.size || 10;
        const textFont = options.font || font;
        const currentLineHeight = options.lineHeight || lineHeight;
        
        // Calcular ancho del texto
        const textWidth = textFont.widthOfTextAtSize(cleanedText, fontSize);
        
        // Si el texto es muy largo, dividirlo en líneas
        if (textWidth > maxWidth - (x - marginLeft)) {
          const words = cleanedText.split(' ');
          let currentLine = '';
          let lines = [];
          
          for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const testWidth = textFont.widthOfTextAtSize(testLine, fontSize);
            
            if (testWidth > maxWidth - (x - marginLeft) && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          
          if (currentLine) {
            lines.push(currentLine);
          }
          
          // Escribir cada línea
          let currentY = y;
          for (let i = 0; i < lines.length; i++) {
            // Verificar si necesitamos nueva página para esta línea
            if (currentY < marginBottom + 20) {
              await addNewPage();
              currentY = height - marginTop;
            }
            
            currentPage.drawText(lines[i], {
              x,
              y: currentY,
              size: fontSize,
              font: textFont,
              color: options.color || rgb(0, 0, 0)
            });
            
            currentY -= currentLineHeight;
          }
          
          return currentY;
        } else {
          // Texto normal que cabe en una línea
          currentPage.drawText(cleanedText, {
            x,
            y,
            size: fontSize,
            font: textFont,
            color: options.color || rgb(0, 0, 0)
          });
          
          return y - currentLineHeight;
        }
      };
  
      // Escribir información en la plantilla
      updateProgress(40);
      showStatus('Escribiendo datos en la plantilla...', 'info');
  
      // Información básica
      yPosition = await addText(`FECHA: ${data.fechaGeneracion}`, marginLeft, yPosition, {
        size: 11,
        font: boldFont,
        lineHeight: 20
      });
  
      yPosition = await addText(`TIPO: ${data.tipoPersona === 'fisica' ? 'PERSONA FISICA' : 'PERSONA JURIDICA'}`, marginLeft, yPosition, {
        size: 11,
        font: boldFont,
        lineHeight: 20
      });
  
      // Espacio
      yPosition -= 10;
  
      // Información según tipo de persona
      if (data.tipoPersona === 'fisica') {
        const sections = [
          {
            title: 'DATOS PERSONALES',
            fields: [
                ['Nombre Completo:', data.nombre || 'N/A'],
                ['DNI:', data.dni || 'N/A'],
                ['CUIT/CUIL/CDI:', data.cuil || 'N/A'],
                ['Fecha de Nacimiento:', data.fechaNacimiento || 'N/A'],
                ['Nacionalidad:', data.nacionalidad || 'N/A'],
                ['Estado Civil:', data.estadoCivil || 'N/A'],
                ['Profesion:', data.profesion || 'N/A'],
                ['Es PEP:', data.esPEP || 'N/A'],
                ...(data.esPEP === 'Si' && data.detallesPEP ? [['Detalles PEP:', data.detallesPEP]] : []),

                // Casado/a o Viudo/a
                ...(data.estadoCivil === 'Casado' || data.estadoCivil === 'Viudo'
                  ? [
                      ['Grado de Nupcias:', data.gradoNupcias || 'N/A'],
                      ['Nombre del cónyuge:', data.nombreConyuge || 'N/A']
                    ]
                  : []),
              
                // Concubinato
                ...(data.estadoCivil === 'Concubinato'
                  ? [
                      ['Nombre del conviviente:', data.nombreConyuge || 'N/A'],
                      ['¿Unión convivencial inscripta?:', data.unionInscripta || 'N/A']
                    ]
                  : []),
              
                // Soltero/a
                ...(data.estadoCivil === 'Soltero'
                  ? [
                      ['Nombre del padre:', data.nombrePadreSoltero || data.nombrePadre || 'N/A'],
                      ['Nombre de la madre:', data.nombreMadreSoltero || data.nombreMadre || 'N/A']
                    ]
                  : [])
              ]
          },
          {
            title: 'DATOS DE CONTACTO',
            fields: [
              ['Email:', data.email || 'N/A'],
              ['Telefono:', data.telefono || 'N/A'],
              ['Direccion:', data.direccion || 'N/A'],
              ['Piso y Depto / Lote / U.F:', data.pisoDepto || 'N/A'],
              ['Ciudad:', data.ciudad || 'N/A'],
              ['Provincia:', data.provincia || 'N/A'],
              ['Codigo Postal:', data.codigoPostal || 'N/A'],
              ['Pais:', data.pais || 'N/A']
            ]
          },
          {
            title: 'INFORMACION LABORAL',
            fields: [
              ['Empresa:', data.empresa || 'N/A'],
              ['Domicilio Laboral:', data.domicilioLaboral || 'N/A'],
              ['Piso:', data.piso || 'N/A'],
              ['Departamento:', data.depto || 'N/A'],
              ['CP Laboral:', data.cpLaboral || 'N/A'],
              ['Barrio/Localidad:', data.barrioLaboral || 'N/A']
            ]
          },
          {
            title: 'INFORMACION ADICIONAL',
            fields: [
              ['Ingresos SMV:', data.ingresosSMVM || 'N/A'],
              ['Referido por:', data.referido || 'N/A']
            ]
          }
        ];
  
        for (const section of sections) {
          // Verificar espacio para título de sección
          if (yPosition < marginBottom + 40) {
            await addNewPage();
            yPosition = height - marginTop;
          }
          
          // Título de sección
          yPosition = await addText(section.title, marginLeft, yPosition, {
            size: 12,
            font: boldFont,
            color: rgb(209 / 255, 174 / 255, 133 / 255),
            lineHeight: 20
          });
          
          // Campos de la sección
          for (const [label, value] of section.fields) {
            yPosition = await addText(`${label} ${value}`, marginLeft + 10, yPosition, {
              size: 10,
              lineHeight: 15
            });
          }
          
          // Espacio entre secciones
          yPosition -= 8;
        }
      } else {
        // Persona Jurídica
        const sections = [
          {
            title: 'DATOS SOCIETARIOS',
            fields: [
              ['Razon Social:', data.razonSocial || 'N/A'],
              ['Tipo de Sociedad:', data.tipoSociedad || 'N/A'],
              ['CUIT:', data.cuitEmpresa || 'N/A'],
              ['Fecha de Constitucion:', data.fechaConstitucion || 'N/A'],
              ['Zona de Operacion:', data.zonaOperacion || 'N/A'],
              ['Referido por:', data.referidoJuridico || 'N/A']
            ]
          },
          {
            title: 'DATOS DE CONTACTO',
            fields: [
              ['Email:', data.email || 'N/A'],
              ['Telefono:', data.telefono || 'N/A'],
              ['Direccion:', data.direccion || 'N/A'],
              ['Ciudad:', data.ciudad || 'N/A'],
              ['Provincia:', data.provincia || 'N/A'],
              ['Codigo Postal:', data.codigoPostal || 'N/A'],
              ['Pais:', data.pais || 'N/A']
            ]
          },
          {
            title: 'OBJETO SOCIAL',
            fields: [
              ['Descripcion:', data.objetoSocial || 'N/A'],
              ['Ingresos Mensuales:', data.ingresosJuridico || 'N/A'],
            ]
          },
          {
            title: 'DOCUMENTACION APORTADA',
            fields: [
              ['Detalle:', data.detalleDocumentacion || 'N/A']
            ]
          }
        ];
  
        for (const section of sections) {
          // Verificar espacio para título de sección
          if (yPosition < marginBottom + 40) {
            await addNewPage();
            yPosition = height - marginTop;
          }
          
          // Título de sección
          yPosition = await addText(section.title, marginLeft, yPosition, {
            size: 12,
            font: boldFont,
            color: rgb(209 / 255, 174 / 255, 133 / 255),
            lineHeight: 20
          });
          
          // Campos de la sección
          for (const [label, value] of section.fields) {
            yPosition = await addText(`${label} ${value}`, marginLeft + 10, yPosition, {
              size: 10,
              lineHeight: 15
            });
          }
          
          // Espacio entre secciones
          yPosition -= 8;
        }
  
        // Representantes legales
        if (data.representantes && data.representantes.length > 0) {
          // Verificar espacio para sección de representantes
          if (yPosition < marginBottom + 60) {
            await addNewPage();
            yPosition = height - marginTop;
          }
          
          yPosition = await addText('REPRESENTANTES LEGALES', marginLeft, yPosition, {
            size: 12,
            font: boldFont,
            color: rgb(209 / 255, 174 / 255, 133 / 255),
            lineHeight: 20
          });
  
          for (let index = 0; index < data.representantes.length; index++) {
            const rep = data.representantes[index];
            
            yPosition = await addText(`${index + 1}. ${rep.nombre} - ${rep.cargo}`, marginLeft + 10, yPosition, {
              size: 10,
              lineHeight: 15
            });
            
            if (rep.vto) {
              yPosition = await addText(`   Vencimiento: ${rep.vto}`, marginLeft + 15, yPosition, {
                size: 9,
                lineHeight: 14
              });
            }
            
            yPosition = await addText(`   Es PEP: ${rep.esPEP ? 'Sí' : 'No'}`, marginLeft + 15, yPosition, {
              size: 9,
              lineHeight: 15
            });
          }
        }
      }
  
      updateProgress(60);
      showStatus('Embebiendo archivos adjuntos...', 'info');
  
      // Embebir archivos si existen
      let attachmentCount = 0;
      
      for (const [key, fileList] of Object.entries(files)) {
        if (fileList && fileList.length > 0) {
          for (const file of Array.from(fileList)) {
            try {
              const arrayBuffer = await fileToArrayBuffer(file);
              await pdfDoc.attach(arrayBuffer, file.name, {
                mimeType: file.type,
                description: `Archivo adjunto: ${file.name}`,
                creationDate: new Date(),
                modificationDate: new Date()
              });
              attachmentCount++;
              updateProgress(60 + (attachmentCount * 10));
            } catch (error) {
              console.warn(`Error embebiendo archivo ${file.name}:`, error);
            }
          }
        }
      }
  
      updateProgress(90);
      showStatus('Finalizando PDF...', 'info');
  
      // Información sobre archivos embebidos
      if (attachmentCount > 0) {
        // Verificar espacio para sección de archivos
        if (yPosition < marginBottom + 60) {
          await addNewPage();
          yPosition = height - marginTop;
        }
        
        yPosition -= 15;
        yPosition = await addText('ARCHIVOS ADJUNTOS', marginLeft, yPosition, {
          size: 12,
          font: boldFont,
          color: rgb(209 / 255, 174 / 255, 133 / 255),
          lineHeight: 20
        });
  
        yPosition = await addText(`Total de archivos embebidos: ${attachmentCount}`, marginLeft + 10, yPosition, {
          size: 10,
          lineHeight: 15
        });
      }
  
      // Declaración final
      // Verificar espacio para declaración
      if (yPosition < marginBottom + 60) {
        await addNewPage();
        yPosition = height - marginTop;
      }
      
      yPosition -= 20;
      yPosition = await addText('DECLARACION UIF', marginLeft, yPosition, {
        size: 12,
        font: boldFont,
        color: rgb(209 / 255, 174 / 255, 133 / 255),
        lineHeight: 20
      });
  
      yPosition = await addText('Declaro bajo juramento que toda la información proporcionada es veraz y completa.', marginLeft + 10, yPosition, {
        size: 10,
        lineHeight: 15
      });
  
      updateProgress(95);
  
      // Generar PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
      updateProgress(100);
      showStatus(`PDF generado exitosamente con ${attachmentCount} archivos embebidos`, 'success');
  
      setGeneratedPdfBlob(blob);
      return blob;
  
    } catch (error) {
      console.error('Error generando PDF:', error);
      showStatus('Error al generar el PDF: ' + error.message, 'error');
      updateProgress(0);
      throw error;
    }
  };

  // Función para enviar email con PHP
// Función mejorada para enviar email con PHP - con mejor manejo de errores
const sendEmail = async (formData, pdfBlob) => {
  try {
    setIsSubmitting(true);
    showStatus('Enviando formulario por email...', 'info');

    // Crear FormData para enviar al PHP
    const formDataToSend = new FormData();
    
    // Agregar los datos del formulario como JSON
    formDataToSend.append('formData', JSON.stringify(formData));
    
    // Agregar el PDF como archivo
    const clientName = formData.tipoPersona === 'fisica' ? formData.nombre : formData.razonSocial;
    const fileName = `Formulario_UIF_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    formDataToSend.append('pdfFile', pdfBlob, fileName);

    console.log('Enviando datos a:', '/send_email.php');
    console.log('Tamaño del PDF:', pdfBlob.size, 'bytes');

    // Realizar la petición al script PHP con mejor manejo de errores
    let response;
    try {
      response = await fetch('http://localhost:5000/send_email.php', {
        method: 'POST',
        body: formDataToSend,
        mode: 'cors', // Importante para CORS
      });
    } catch (networkError) {
      console.error('Error de red:', networkError);
      throw new Error(`Error de conexión: ${networkError.message}`);
    }

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      
      // Intentar leer la respuesta como texto para ver el error
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      throw new Error(`Error del servidor (${response.status}): ${response.statusText}`);
    }

    // Intentar leer la respuesta
    let result;
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Error parseando JSON:', jsonError);
        const textResponse = await response.text();
        console.error('Respuesta como texto:', textResponse);
        throw new Error(`Respuesta inválida del servidor. Expected JSON but got: ${textResponse.substring(0, 100)}...`);
      }
    } else {
      // Si no es JSON, leer como texto para diagnosticar
      const textResponse = await response.text();
      console.error('Respuesta no es JSON:', textResponse);
      throw new Error(`El servidor no devolvió JSON. Respuesta: ${textResponse.substring(0, 200)}...`);
    }

    console.log('Resultado del PHP:', result);

    if (result.success) {
      showStatus('✅ Formulario enviado exitosamente por email', 'success');
    } else {
      throw new Error(result.error || 'Error desconocido al enviar email');
    }

  } catch (error) {
    console.error('Error completo enviando email:', error);
    
    // Mensajes de error más específicos
    let errorMessage = 'Error enviando email: ';
    
    if (error.message.includes('Failed to fetch')) {
      errorMessage += 'No se pudo conectar con el servidor. Verifique que send_email.php esté en la carpeta correcta.';
    } else if (error.message.includes('Proxy erro')) {
      errorMessage += 'Error de proxy del servidor. El archivo send_email.php podría no existir o estar mal configurado.';
    } else if (error.message.includes('404')) {
      errorMessage += 'Archivo send_email.php no encontrado. Asegúrese de que esté en la raíz del proyecto.';
    } else if (error.message.includes('500')) {
      errorMessage += 'Error interno del servidor PHP. Revise los logs del servidor.';
    } else {
      errorMessage += error.message;
    }
    
    showStatus(`❌ ${errorMessage}`, 'error');
  } finally {
    setIsSubmitting(false);
  }
};

  // Función para enviar por WhatsApp
  const sendWhatsApp = () => {
    if (!generatedPdfBlob) {
      showStatus('No hay PDF generado para enviar', 'error');
      return;
    }

    const clientName = formData.tipoPersona === 'fisica' ? formData.nombre : formData.razonSocial;
    const message = `Hola ${LAWYER_INFO.name}, le envio el formulario legal completo y todos los documentos adjuntos.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${LAWYER_INFO.phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Función para descargar PDF
  const downloadPDF = () => {
    if (!generatedPdfBlob) {
      showStatus('No hay PDF generado para descargar', 'error');
      return;
    }

    const url = URL.createObjectURL(generatedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = formData.tipoPersona === 'fisica' 
      ? (formData.nombre || 'FormularioUIF').replace(/\s+/g, '_')
      : (formData.razonSocial || 'FormularioUIF').replace(/\s+/g, '_');
    a.download = `Escribania_La_Riva_Form_${fileName}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Función para manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPersonType) {
      showStatus('Por favor, seleccione el tipo de persona antes de continuar', 'error');
      return;
    }

    const data = collectFormData(e.target);
    setFormData(data);

    try {
      // Generar PDF
      const pdfBlob = await generatePDFWithEmbeddedFiles(data, uploadedFiles);
      
      // Enviar por email automáticamente
      await sendEmail(data, pdfBlob);
      
      // También descargar automáticamente
      setTimeout(() => {
        downloadPDF();
        updateProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Error en el proceso:', error);
      showStatus('Error en el proceso de generación y envío', 'error');
      updateProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex flex-col items-center">
      {/* Video de fondo */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noplaybackrate"
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/inicio.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Ingreso de clientes</h1>
            <p className="text-xl">Formulario para Personas Físicas y Jurídicas</p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative w-full max-w-6xl bg-[#F5F1EB] p-6 md:p-12 mt-[-80px] shadow-lg rounded-lg z-10">
        
        {/* Selector de tipo de persona */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Seleccione el tipo de persona</h2>
          <span className="block w-72 h-1 bg-[#D1AE85] mt-2 mx-auto mb-6"></span>
          <p className="text-lg text-gray-700 mb-8">Elija el tipo de formulario según la naturaleza del cliente</p>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => togglePersonType('fisica')}
              className={`px-8 py-4 border-2 rounded-lg font-bold transition-all duration-300 ${
                currentPersonType === 'fisica'
                  ? 'bg-[#D1AE85] text-white border-[#D1AE85] shadow-lg'
                  : 'bg-white text-[#D1AE85] border-[#D1AE85] hover:bg-[#D1AE85] hover:text-white'
              }`}
            >
              👤 Persona Física
            </button>
            <button
              type="button"
              onClick={() => togglePersonType('juridica')}
              className={`px-8 py-4 border-2 rounded-lg font-bold transition-all duration-300 ${
                currentPersonType === 'juridica'
                  ? 'bg-[#D1AE85] text-white border-[#D1AE85] shadow-lg'
                  : 'bg-white text-[#D1AE85] border-[#D1AE85] hover:bg-[#D1AE85] hover:text-white'
              }`}
            >
              🏢 Persona Jurídica
            </button>
          </div>
        </div>

        {/* Información sobre archivos embebidos */}
        <div className="bg-white/80 border-l-4 border-[#D1AE85] rounded-lg p-6 mb-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📧 ¡Completa el formulario y se enviará automáticamente por email!
          </h3>
          <div className="text-gray-700 space-y-2">
            <p><strong>• Elegí el tipo de persona y completa los campos.</strong></p>
            <p><strong>• Al enviar, se generará el PDF y se enviará automáticamente por email al abogado.</strong></p>
            <p><strong>• También podrás descargarlo y enviarlo por WhatsApp si lo necesitas.</strong></p>
          </div>
        </div>

        {/* Formulario principal */}
        {currentPersonType && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Datos Persona Física */}
            {currentPersonType === 'fisica' && (
              <div className="bg-white/80 p-6 rounded-lg border-l-4 border-[#D1AE85] shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl">👤</span>
                  Datos de la Persona Física
                </h3>
                <span className="block w-64 h-1 bg-[#D1AE85] mb-6"></span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre y Apellido completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dni"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    CUIT/CUIL/CDI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cuil"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nacionalidad <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="nacionalidad"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    >
                      <option value="">Seleccione nacionalidad</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Brasil">Brasil</option>
                      <option value="Chile">Chile</option>
                      <option value="Uruguay">Uruguay</option>
                      <option value="Paraguay">Paraguay</option>
                      <option value="Bolivia">Bolivia</option>
                      <option value="Peru">Perú</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Espana">España</option>
                      <option value="Italia">Italia</option>
                      <option value="Francia">Francia</option>
                      <option value="Alemania">Alemania</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado Civil <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="estadoCivil"
                      required
                      value={estadoCivil}
                      onChange={(e) => setEstadoCivil(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    >
                      <option value="">Seleccione estado civil</option>
                      <option value="Soltero">Soltero/a</option>
                      <option value="Casado">Casado/a</option>
                      <option value="Divorciado">Divorciado/a</option>
                      <option value="Viudo">Viudo/a</option>
                      <option value="Concubinato">Concubinato</option>
                    </select>
                    {(estadoCivil === 'Casado' || estadoCivil === 'Viudo' || estadoCivil === 'Concubinato') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del cónyuge/conviviente
                          </label>
                          <input
                            type="text"
                            name="nombreConyuge"
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>

                        {(estadoCivil === 'Casado' || estadoCivil === 'Viudo') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Grado de Nupcias
                            </label>
                            <input
                              type="text"
                              name="gradoNupcias"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                          </div>
                        )}

                        {estadoCivil === 'Concubinato' && (
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ¿Unión convivencial inscripta?
                            </label>
                            <select
                              name="unionInscripta"
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                              <option value="">Seleccione</option>
                              <option value="Sí">Sí</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    {estadoCivil === 'Soltero' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del padre
                          </label>
                          <input
                            type="text"
                            name="nombrePadreSoltero"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la madre
                          </label>
                          <input
                            type="text"
                            name="nombreMadreSoltero"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesión/Ocupación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="profesion"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                  />
                </div>

                {/* Datos de Contacto */}
                <div className="bg-white/50 p-6 mt-8 rounded-lg border-l-4 border-[#A67C52] shadow-md">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    Datos de Contacto
                  </h4>
                  <span className="block w-48 h-1 bg-[#A67C52] mb-6"></span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h5 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                    Domicilio real
                    </h5>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle y número / Barrio Privado <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div className='mt-6'>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Piso y Depto / Lote / U.F
                  </label>
                  <input
                    type="text"
                    name="pisoDepto"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                  />
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provincia <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="provincia"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      >
                        <option value="">Seleccione una provincia</option>
                        <option value="Buenos Aires">Buenos Aires</option>
                        <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                        <option value="Catamarca">Catamarca</option>
                        <option value="Chaco">Chaco</option>
                        <option value="Chubut">Chubut</option>
                        <option value="Córdoba">Córdoba</option>
                        <option value="Corrientes">Corrientes</option>
                        <option value="Entre Ríos">Entre Ríos</option>
                        <option value="Formosa">Formosa</option>
                        <option value="Jujuy">Jujuy</option>
                        <option value="La Pampa">La Pampa</option>
                        <option value="La Rioja">La Rioja</option>
                        <option value="Mendoza">Mendoza</option>
                        <option value="Misiones">Misiones</option>
                        <option value="Neuquén">Neuquén</option>
                        <option value="Río Negro">Río Negro</option>
                        <option value="Salta">Salta</option>
                        <option value="San Juan">San Juan</option>
                        <option value="San Luis">San Luis</option>
                        <option value="Santa Cruz">Santa Cruz</option>
                        <option value="Santa Fe">Santa Fe</option>
                        <option value="Santiago del Estero">Santiago del Estero</option>
                        <option value="Tierra del Fuego">Tierra del Fuego</option>
                        <option value="Tucumán">Tucumán</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="codigoPostal"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="pais"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      >
                        <option value="Argentina">Argentina</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sección opcional de archivos para persona física */}
                <div className="mt-8 bg-white/50 p-6 rounded-lg border-l-4 border-[#A67C52] shadow-md">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">📄 Documentación</h4>
                  <span className="block w-48 h-1 bg-[#A67C52] mb-4"></span>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI Frente <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={(el) => (fileInputRefs.current.dniFrente = el)}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'dniFrente')}
                        required
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => openFileSelector('dniFrente')}
                        className="w-full bg-[#D1AE85] hover:bg-[#A67C52] text-white px-4 py-3 rounded-lg font-bold transition-colors"
                      >
                        📷 Subir DNI Frente
                      </button>
                      <FilePreview files={uploadedFiles.dniFrente} inputId="dniFrente" isEmbedded={true} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI Dorso <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={(el) => (fileInputRefs.current.dniDorso = el)}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'dniDorso')}
                        required
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => openFileSelector('dniDorso')}
                        className="w-full bg-[#D1AE85] hover:bg-[#A67C52] text-white px-4 py-3 rounded-lg font-bold transition-colors"
                      >
                        📷 Subir DNI Dorso
                      </button>
                      <FilePreview files={uploadedFiles.dniDorso} inputId="dniDorso" isEmbedded={true} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documentación Adicional (Opcional)
                      </label>
                      <input
                        ref={(el) => (fileInputRefs.current.documentacionFisica = el)}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                        onChange={(e) => handleFileUpload(e, 'documentacionFisica')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => openFileSelector('documentacionFisica')}
                        className="w-full bg-[#A89E97] hover:bg-[#8B7E75] text-white px-4 py-3 rounded-lg font-bold transition-colors"
                      >
                        📁 Subir Documentación Adicional
                      </button>
                      <FilePreview files={uploadedFiles.documentacionFisica} inputId="documentacionFisica" isEmbedded={true} />
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-8 bg-white/80 p-6 rounded-lg border-l-4 border-[#D1AE85] shadow-md">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">🏢 Información Laboral y Personal</h4>
                  <span className="block w-48 h-1 bg-[#D1AE85] mb-6"></span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lugar o Empresa
                      </label>
                      <input
                        type="text"
                        name="empresa"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Domicilio Laboral
                      </label>
                      <input
                        type="text"
                        name="domicilioLaboral"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Piso
                      </label>
                      <input
                        type="text"
                        name="piso"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Depto.
                      </label>
                      <input
                        type="text"
                        name="depto"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="cpLaboral"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barrio / Localidad
                      </label>
                      <input
                        type="text"
                        name="barrioLaboral"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provincia
                      </label>
                      <input
                        type="text"
                        name="provinciaLaboral"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingresos Mensuales (Último Ejercicio) <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="ingresosSMVM"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="U$S 1.500">U$S 1.500</option>
                      <option value="U$S 1.500 -  6.000">U$S 1.500 -  6.000</option>
                      <option value="U$S 6.000 - 15.000">U$S 6.000 - 15.000</option>
                      <option value="MAS DE U$S 15.000">MAS DE U$S 15.000</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Cómo llega usted a la escribanía? (Referido de) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="referido"
                      placeholder="Nombre o medio por el cual conoció la escribanía"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Declaración UIF */}
                <div className="bg-white/80 p-6 mt-8 rounded-lg border-l-4 border-red-500 shadow-md">
                  <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    Declaraciones juradas - U.I.F
                  </h3>
                  <span className="block w-48 h-1 bg-red-500 mb-6"></span>
                  
                  <div className="mt-6">
                    <p className="text-sm mb-4">
                      ¿Se encuentra incluido/a bajo la condición de <strong>Sujeto Obligado</strong> enumerados en el art. 20 de la Ley 25.246 y sus modificatorias sobre "Encubrimiento y Lavado de Activos" que he leído? 
                    </p>

                    <select name="sujetoUIF" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors">
                      <option value="">Seleccione una opción</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm mb-4">
                      ¿Se encuentra incluido y/o comprendido bajo la condición de PERSONA EXPUESTA POLÍTICAMENTE (PEP) ante la UIF enumerados en el art.35 de la Ley 25.246 y sus modificatorias RESOLUCIÓN UIF N° RESOL-2023-35?
                    </p>

                    <select name="esPEP" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors">
                      <option value="">Seleccione una opción</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="bg-red-50 border-2 mt-6 border-red-200 rounded-lg p-6 mb-6">
                    <p className="text-sm text-red-800 font-medium">
                      <strong>De acuerdo a la normativa vigente de prevención de lavado de activos, declaro bajo juramento haber completado la presente ficha sin omitir ni falsear dato alguno. TODOS LOS DATOS CONSIGNADOS EN LA PRESENTE SON CORRECTOS, COMPLETOS Y FIEL EXPRESIÓN DE LA VERDAD.</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="aceptoTerminos"
                        id="aceptoTerminos"
                        required
                        className="w-4 h-4 accent-red-500"
                      />
                      <label htmlFor="aceptoTerminos" className="text-sm font-bold text-gray-700">
                        Acepto los términos y condiciones del tratamiento de datos <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="text-xs text-gray-600 mt-4 mb-4">
                      Que se encuentran informados y aceptan la incorporación de sus datos personales y los aquí vertidos, en los archivos papel y/o informáticos de la escribanía, así como los que se ubiquen en servidores contratados a tal fin, los que se conservarán bajo carácter confidencial, sin perjuicio de las excepciones de obligado cumplimiento legal.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Datos Persona Jurídica */}
            {currentPersonType === 'juridica' && (
              <div className="bg-white/80 p-6 rounded-lg border-l-4 border-[#D1AE85] shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="text-3xl">🏢</span>
                  Datos de la Persona Jurídica
                </h3>
                <span className="block w-64 h-1 bg-[#D1AE85] mb-6"></span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón Social / Denominación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="razonSocial"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CUIT <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cuitEmpresa"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Sociedad <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipoSociedad"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    >
                      <option value="">Seleccione tipo de sociedad</option>
                      <option value="S.R.L.">Sociedad de Responsabilidad Limitada (S.R.L.)</option>
                      <option value="S.A.">Sociedad Anónima (S.A.)</option>
                      <option value="S.C.S.">Sociedad en Comandita Simple (S.C.S.)</option>
                      <option value="S.C.A.">Sociedad en Comandita por Acciones (S.C.A.)</option>
                      <option value="S.C.">Sociedad Colectiva (S.C.)</option>
                      <option value="S.A.S.">Sociedad por Acciones Simplificada (S.A.S.)</option>
                      <option value="Cooperativa">Cooperativa</option>
                      <option value="Fundacion">Fundación</option>
                      <option value="Asociacion Civil">Asociación Civil</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Constitución <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fechaConstitucion"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona Geográfica Donde Habitualmente Opera <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="zonaOperacion"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    >
                      <option value="">Seleccione zona de operación</option>
                      <option value="CABA / AMBA">CABA / AMBA</option>
                      <option value="OTRAS PROVINCIAS">OTRAS PROVINCIAS</option>
                      <option value="OTROS PAISES">OTROS PAISES</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actividad principal de ingresos <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="objetoSocial"
                    rows={4}
                    required
                    placeholder="Describa el objeto social de la empresa..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingresos Mensuales<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ingresosJuridico"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="U$S 10.000">U$S 10.000</option>
                    <option value="U$S 10.000 -  50.000">U$S 10.000 -  50.000</option>
                    <option value="U$S 50.000 -  150.000">U$S 50.000 -  150.000</option>
                    <option value="MAS DE U$S 150.000">MAS DE U$S 150.000</option>
                  </select>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cómo llega usted a la escribanía? (Referido de) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="referidoJuridico"
                    placeholder="Nombre o medio por el cual conoció la escribanía"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                  />
                </div>

                {/* Datos de Contacto */}
                <div className="bg-white/50 p-6 mt-8 rounded-lg border-l-4 border-[#A67C52] shadow-md">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    Datos de contacto
                  </h4>
                  <span className="block w-48 h-1 bg-[#A67C52] mb-6"></span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h5 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                      Domicilio real
                    </h5>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección Completa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provincia <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="provincia"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      >
                        <option value="">Seleccione una provincia</option>
                        <option value="Buenos Aires">Buenos Aires</option>
                        <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                        <option value="Catamarca">Catamarca</option>
                        <option value="Chaco">Chaco</option>
                        <option value="Chubut">Chubut</option>
                        <option value="Córdoba">Córdoba</option>
                        <option value="Corrientes">Corrientes</option>
                        <option value="Entre Ríos">Entre Ríos</option>
                        <option value="Formosa">Formosa</option>
                        <option value="Jujuy">Jujuy</option>
                        <option value="La Pampa">La Pampa</option>
                        <option value="La Rioja">La Rioja</option>
                        <option value="Mendoza">Mendoza</option>
                        <option value="Misiones">Misiones</option>
                        <option value="Neuquén">Neuquén</option>
                        <option value="Río Negro">Río Negro</option>
                        <option value="Salta">Salta</option>
                        <option value="San Juan">San Juan</option>
                        <option value="San Luis">San Luis</option>
                        <option value="Santa Cruz">Santa Cruz</option>
                        <option value="Santa Fe">Santa Fe</option>
                        <option value="Santiago del Estero">Santiago del Estero</option>
                        <option value="Tierra del Fuego">Tierra del Fuego</option>
                        <option value="Tucumán">Tucumán</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="codigoPostal"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="pais"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                      >
                        <option value="Argentina">Argentina</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Representantes Legales */}
                <div className="mt-8 bg-white/50 p-6 rounded-lg border-l-4 border-[#D1AE85] shadow-md">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">👥 Representantes Legales/Apoderados</h4>
                  <span className="block w-60 h-1 bg-[#D1AE85] mb-4"></span>
                  <button
                    type="button"
                    onClick={addRepresentative}
                    className="bg-[#D1AE85] hover:bg-[#A67C52] text-white px-6 py-3 rounded-lg font-bold mb-6 transition-colors"
                  >
                    ➕ Agregar Representante
                  </button>
                  
                  {representatives.map((rep) => (
                    <div key={rep.id} className="bg-white p-6 rounded-lg mb-6 border-2 border-gray-100 shadow-sm ">
                      <div className="flex justify-between items-center mb-4 ">
                        <h5 className="font-bold text-gray-800">👤 Representante Legal/Apoderado #{rep.id}</h5>
                        <button
                          type="button"
                          onClick={() => removeRepresentative(rep.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          ❌ Eliminar
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre Completo <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name={`rep${rep.id}_nombre`}
                            required
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cargo <span className="text-red-500">*</span>
                          </label>
                          <select
                            name={`rep${rep.id}_cargo`}
                            required
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] transition-colors"
                          >
                            <option value="">Seleccione cargo</option>
                            <option value="Presidente">Presidente</option>
                            <option value="Vicepresidente">Vicepresidente</option>
                            <option value="Gerente General">Gerente General</option>
                            <option value="Director">Director</option>
                            <option value="Sindico">Síndico</option>
                            <option value="Apoderado">Apoderado</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            VTO. (Vencimiento de Mandato)
                          </label>
                          <input
                            type="date"
                            name={`rep${rep.id}_vto`}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name={`rep${rep.id}_pep`}
                            id={`rep${rep.id}_pep`}
                            className="w-4 h-4 accent-[#D1AE85]"
                          />
                          <label htmlFor={`rep${rep.id}_pep`} className="text-sm font-medium text-gray-700">
                            ¿Es Persona Expuesta Políticamente (PEP)?
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detalle de Documentación Aportada */}
                <div className="mt-8 bg-white/50 p-6 rounded-lg border-l-4 border-[#A67C52] shadow-md">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">📄 Detalle de Documentación Aportada</h4>
                  <span className="block w-64 h-1 bg-[#A67C52] mb-4"></span>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción de la Documentación <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="detalleDocumentacion"
                      rows={3}
                      required
                      placeholder="Ejemplo: Constancia de CUIT, Poderes, Último balance, Estatuto Social, Acta de Directorio, etc..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D1AE85] focus:ring-2 focus:ring-[#D1AE85]/20 transition-colors"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Archivos de Documentación
                    </label>
                    <input
                      ref={(el) => (fileInputRefs.current.documentacionJuridica = el)}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                      onChange={(e) => handleFileUpload(e, 'documentacionJuridica')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => openFileSelector('documentacionJuridica')}
                      className="w-full bg-[#A89E97] hover:bg-[#8B7E75] text-white px-4 py-3 rounded-lg font-bold transition-colors"
                    >
                      📁 Subir Documentación
                    </button>
                    <FilePreview files={uploadedFiles.documentacionJuridica} inputId="documentacionJuridica" isEmbedded={true} />
                  </div>
                </div>

                {/* Declaración UIF */}
                <div className="bg-white/80 p-6 mt-8 rounded-lg border-l-4 border-red-500 shadow-md">
                  <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    Declaraciones juradas - U.I.F
                  </h3>
                  <span className="block w-48 h-1 bg-red-500 mb-6"></span>
                  
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                    <p className="text-sm text-red-800 font-medium">
                      <strong>Que se encuentran informados y aceptan la incorporación de sus datos personales y los aquí vertidos, en los archivos papel y/o informáticos de la escribanía, así como los que se ubiquen en servidores contratados a tal fin, los que se conservarán bajo carácter confidencial, sin perjuicio de las excepciones de obligado cumplimiento legal.</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="aceptoTerminos"
                        id="aceptoTerminos"
                        required
                        className="w-4 h-4 accent-red-500"
                      />
                      <label htmlFor="aceptoTerminos" className="text-sm font-bold text-gray-700">
                        Acepto los términos y condiciones del tratamiento de datos <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg ${
                  isSubmitting 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-[#D1AE85] hover:bg-[#A67C52] text-white'
                }`}
              >
                {isSubmitting ? '⏳ Procesando...' : '📧 Generar PDF y Enviar por Email'}
              </button>
              
              {generatedPdfBlob && !isSubmitting && (
                <>
                  <button
                    type="button"
                    onClick={downloadPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
                  >
                    📄 Descargar PDF
                  </button>
                  
                  <button
                    type="button"
                    onClick={sendWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
                  >
                    📱 Enviar por WhatsApp
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        {/* Status y Progress */}
        {status.show && (
          <div className={`mt-6 p-4 rounded-lg text-center font-medium border-2 ${
            status.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
            status.type === 'error' ? 'bg-red-100 text-red-800 border-red-200' :
            'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            {status.message}
          </div>
        )}

        {progress > 0 && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#D1AE85] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIFLegalForm;