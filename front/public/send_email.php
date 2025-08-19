<?php
// send_email.php - Versión corregida con sintaxis correcta

header('Access-Control-Allow-Origin: http://localhost:3000'); // Tu puerto de React
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Para requests de tipo preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Configuración de errores
error_reporting(E_ALL);
ini_set('display_errors', 0); // No mostrar errores en producción
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/email_errors.log');

// Función para loguear errores
function logError($message) {
    error_log(date('Y-m-d H:i:s') . " - " . $message . PHP_EOL, 3, __DIR__ . '/email_errors.log');
}

// Función para enviar respuesta JSON
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError("Método no permitido: " . $_SERVER['REQUEST_METHOD']);
    sendJsonResponse(['success' => false, 'error' => 'Método no permitido'], 405);
}

// Cargar PHPMailer ANTES del try-catch
require_once __DIR__ . '/PHPMailer-master/src/Exception.php';
require_once __DIR__ . '/PHPMailer-master/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer-master/src/SMTP.php';

// Declaraciones use DESPUÉS de los require
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
    // Log del inicio
    logError("Iniciando proceso de envío de email");
    
    // Verificar que PHPMailer existe
    $phpmailerPath = __DIR__ . '/PHPMailer-master/src/PHPMailer.php';
    if (!file_exists($phpmailerPath)) {
        logError("PHPMailer no encontrado en: " . $phpmailerPath);
        throw new Exception('PHPMailer no está instalado correctamente');
    }
    
    logError("PHPMailer encontrado correctamente");

    // Log de datos recibidos
    logError("POST data keys: " . implode(', ', array_keys($_POST)));
    logError("FILES data keys: " . implode(', ', array_keys($_FILES)));
    
    // Verificar que se recibieron los datos
    if (!isset($_POST['formData'])) {
        logError("No se recibió formData");
        throw new Exception('No se recibieron los datos del formulario');
    }
    
    if (!isset($_FILES['pdfFile'])) {
        logError("No se recibió pdfFile");
        throw new Exception('No se recibió el archivo PDF');
    }

    // Obtener datos del formulario
    $formData = json_decode($_POST['formData'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        logError("Error JSON: " . json_last_error_msg());
        throw new Exception('Error al decodificar los datos JSON del formulario: ' . json_last_error_msg());
    }

    logError("Form data decoded successfully");

    // Obtener nombre del cliente
    $clientName = isset($formData['tipoPersona']) && $formData['tipoPersona'] === 'fisica' 
        ? ($formData['nombre'] ?? 'Cliente') 
        : ($formData['razonSocial'] ?? 'Empresa');

    logError("Cliente: " . $clientName);

    // Verificar que se haya enviado el archivo PDF
    if ($_FILES['pdfFile']['error'] !== UPLOAD_ERR_OK) {
        $uploadError = $_FILES['pdfFile']['error'];
        logError("Error en upload de PDF: " . $uploadError);
        
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido por PHP',
            UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño máximo del formulario',
            UPLOAD_ERR_PARTIAL => 'El archivo se subió parcialmente',
            UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
            UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
            UPLOAD_ERR_CANT_WRITE => 'Error escribiendo el archivo al disco',
            UPLOAD_ERR_EXTENSION => 'Subida detenida por extensión'
        ];
        
        $errorMsg = $uploadErrors[$uploadError] ?? 'Error desconocido en la subida';
        throw new Exception('Error en la carga del archivo PDF: ' . $errorMsg);
    }

    $pdfFile = $_FILES['pdfFile'];
    logError("PDF file size: " . $pdfFile['size'] . " bytes");

    // Crear instancia de PHPMailer
    $mail = new PHPMailer(true);
    logError("PHPMailer instance created");

    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    
    // CREDENCIALES - CAMBIAR POR LAS TUYAS
    $emailFrom = 'felipelariva@gmail.com';
    $emailPassword = 'bgkkehuzwuyardtv'; // Password de aplicación
    $emailTo = 'felipelariva@gmail.com';
    
    $mail->Username   = $emailFrom;
    $mail->Password   = $emailPassword;
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    
    // Configuración adicional para debugging
    $mail->SMTPDebug = 0; // Cambiar a 2 para debug completo
    $mail->Debugoutput = function($str, $level) {
        logError("SMTP Debug: " . $str);
    };

    logError("SMTP configuration set");

    // Configuración del email
    $mail->setFrom($emailFrom, 'Escribanía La Riva - Sistema de Formularios');
    $mail->addAddress($emailTo, 'Dr. La Riva');

    // Asunto
    $tipoPersona = $formData['tipoPersona'] === 'fisica' ? 'Persona Física' : 'Persona Jurídica';
    $mail->Subject = "Nuevo Formulario UIF - {$tipoPersona} - {$clientName}";

    logError("Email configuration set");

    // Generar cuerpo HTML del email
    $fechaActual = date('d/m/Y H:i:s');
    $emailBody = generateEmailBody($formData, $clientName, $tipoPersona, $fechaActual);
    
    $mail->isHTML(true);
    $mail->Body = $emailBody;

    logError("Email body generated");

    // Adjuntar el archivo PDF
    $fileName = 'Formulario_UIF_' . preg_replace('/[^A-Za-z0-9_-]/', '_', $clientName) . '_' . date('Y-m-d') . '.pdf';
    $mail->addAttachment($pdfFile['tmp_name'], $fileName, 'base64', 'application/pdf');

    logError("PDF attachment added: " . $fileName);

    // Enviar el email
    logError("Attempting to send email...");
    
    if ($mail->send()) {
        logError("Email sent successfully");
        sendJsonResponse([
            'success' => true, 
            'message' => 'Formulario enviado exitosamente por email a ' . $emailTo,
            'debug' => [
                'client' => $clientName,
                'type' => $tipoPersona,
                'timestamp' => $fechaActual
            ]
        ]);
    } else {
        logError("Failed to send email: " . $mail->ErrorInfo);
        throw new Exception('Error al enviar el email: ' . $mail->ErrorInfo);
    }

} catch (Exception $e) {
    // Log del error completo
    logError("Exception caught: " . $e->getMessage());
    logError("Stack trace: " . $e->getTraceAsString());
    
    // Respuesta de error
    sendJsonResponse([
        'success' => false, 
        'error' => $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ], 500);
}

// Función para generar el cuerpo HTML del email
function generateEmailBody($formData, $clientName, $tipoPersona, $fechaActual) {
    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0;
                background-color: #f4f4f4;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background-color: white; 
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header { 
                background: linear-gradient(135deg, #D1AE85, #A67C52); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0 0 10px 0; 
                font-size: 24px; 
            }
            .content { 
                padding: 30px 20px; 
            }
            .info-box { 
                background-color: #f9f9f9; 
                padding: 20px; 
                margin: 20px 0; 
                border-left: 4px solid #D1AE85; 
                border-radius: 5px;
            }
            .info-box h2 { 
                color: #A67C52; 
                margin-top: 0; 
                font-size: 18px;
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 15px 0; 
            }
            th, td { 
                padding: 12px 15px; 
                text-align: left; 
                border-bottom: 1px solid #ddd; 
            }
            th { 
                background-color: #D1AE85; 
                color: white; 
                font-weight: bold;
            }
            tr:hover { 
                background-color: #f5f5f5; 
            }
            .footer { 
                background-color: #A67C52; 
                color: white; 
                padding: 20px; 
                text-align: center; 
                font-size: 12px; 
            }
            .badge { 
                display: inline-block; 
                padding: 5px 10px; 
                background-color: #D1AE85; 
                color: white; 
                border-radius: 15px; 
                font-size: 12px; 
                font-weight: bold;
            }
            .highlight { 
                color: #A67C52; 
                font-weight: bold; 
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>📋 Nuevo Formulario UIF Recibido</h1>
                <p>Escribanía La Riva - Sistema Automatizado</p>
                <span class='badge'>{$tipoPersona}</span>
            </div>
            
            <div class='content'>
                <div class='info-box'>
                    <h2>📊 Información General</h2>
                    <table>
                        <tr><th>Fecha de Recepción:</th><td class='highlight'>{$fechaActual}</td></tr>
                        <tr><th>Tipo de Persona:</th><td class='highlight'>{$tipoPersona}</td></tr>
                        <tr><th>Cliente:</th><td class='highlight'>{$clientName}</td></tr>
                    </table>
                </div>";

    // Información específica según el tipo de persona
    if ($formData['tipoPersona'] === 'fisica') {
        $emailBody .= generatePersonaFisicaInfo($formData);
    } else {
        $emailBody .= generatePersonaJuridicaInfo($formData);
    }

    // Información de contacto común
    $emailBody .= "
                <div class='info-box'>
                    <h2>📞 Datos de Contacto</h2>
                    <table>
                        <tr><th>Email:</th><td>" . htmlspecialchars($formData['email'] ?? 'N/A') . "</td></tr>
                        <tr><th>Teléfono:</th><td>" . htmlspecialchars($formData['telefono'] ?? 'N/A') . "</td></tr>
                        <tr><th>Dirección:</th><td>" . htmlspecialchars($formData['direccion'] ?? 'N/A') . "</td></tr>
                        <tr><th>Ciudad:</th><td>" . htmlspecialchars($formData['ciudad'] ?? 'N/A') . "</td></tr>
                        <tr><th>Provincia:</th><td>" . htmlspecialchars($formData['provincia'] ?? 'N/A') . "</td></tr>
                        <tr><th>Código Postal:</th><td>" . htmlspecialchars($formData['codigoPostal'] ?? 'N/A') . "</td></tr>
                        <tr><th>País:</th><td>" . htmlspecialchars($formData['pais'] ?? 'N/A') . "</td></tr>
                    </table>
                </div>

                <div class='info-box'>
                    <h2>📎 Archivos Adjuntos</h2>
                    <p><strong>📄 Formulario UIF Completo:</strong> Se adjunta el PDF generado automáticamente con todos los datos y documentos embebidos.</p>
                    <p><strong>✅ Estado:</strong> <span class='highlight'>Procesado y listo para revisión</span></p>
                </div>
            </div>
            
            <div class='footer'>
                <p><strong>📧 Email generado automáticamente</strong></p>
                <p>Sistema de Formularios UIF - Escribanía La Riva</p>
                <p>Para consultas, responda a este email</p>
            </div>
        </div>
    </body>
    </html>";

    return $emailBody;
}

// Función para generar información de persona física
function generatePersonaFisicaInfo($formData) {
    return "
                <div class='info-box'>
                    <h2>👤 Datos de la Persona Física</h2>
                    <table>
                        <tr><th>DNI:</th><td>" . htmlspecialchars($formData['dni'] ?? 'N/A') . "</td></tr>
                        <tr><th>CUIT/CUIL/CDI:</th><td>" . htmlspecialchars($formData['cuil'] ?? 'N/A') . "</td></tr>
                        <tr><th>Fecha de Nacimiento:</th><td>" . htmlspecialchars($formData['fechaNacimiento'] ?? 'N/A') . "</td></tr>
                        <tr><th>Nacionalidad:</th><td>" . htmlspecialchars($formData['nacionalidad'] ?? 'N/A') . "</td></tr>
                        <tr><th>Estado Civil:</th><td>" . htmlspecialchars($formData['estadoCivil'] ?? 'N/A') . "</td></tr>
                        <tr><th>Profesión:</th><td>" . htmlspecialchars($formData['profesion'] ?? 'N/A') . "</td></tr>
                        <tr><th>Es PEP:</th><td class='highlight'>" . htmlspecialchars($formData['esPEP'] ?? 'N/A') . "</td></tr>
                        <tr><th>Ingresos Mensuales:</th><td>" . htmlspecialchars($formData['ingresosSMVM'] ?? 'N/A') . "</td></tr>
                        <tr><th>Referido por:</th><td>" . htmlspecialchars($formData['referido'] ?? 'N/A') . "</td></tr>
                    </table>
                </div>";
}

// Función para generar información de persona jurídica
function generatePersonaJuridicaInfo($formData) {
    $representantesInfo = '';
    if (isset($formData['representantes']) && is_array($formData['representantes'])) {
        $representantesInfo = "<tr><th>Representantes:</th><td>";
        foreach ($formData['representantes'] as $rep) {
            $representantesInfo .= htmlspecialchars($rep['nombre'] ?? 'N/A') . " (" . htmlspecialchars($rep['cargo'] ?? 'N/A') . ")<br>";
        }
        $representantesInfo .= "</td></tr>";
    }

    return "
                <div class='info-box'>
                    <h2>🏢 Datos de la Persona Jurídica</h2>
                    <table>
                        <tr><th>CUIT:</th><td>" . htmlspecialchars($formData['cuitEmpresa'] ?? 'N/A') . "</td></tr>
                        <tr><th>Tipo de Sociedad:</th><td>" . htmlspecialchars($formData['tipoSociedad'] ?? 'N/A') . "</td></tr>
                        <tr><th>Fecha de Constitución:</th><td>" . htmlspecialchars($formData['fechaConstitucion'] ?? 'N/A') . "</td></tr>
                        <tr><th>Zona de Operación:</th><td>" . htmlspecialchars($formData['zonaOperacion'] ?? 'N/A') . "</td></tr>
                        <tr><th>Objeto Social:</th><td>" . htmlspecialchars($formData['objetoSocial'] ?? 'N/A') . "</td></tr>
                        <tr><th>Ingresos Mensuales:</th><td>" . htmlspecialchars($formData['ingresosJuridico'] ?? 'N/A') . "</td></tr>
                        <tr><th>Referido por:</th><td>" . htmlspecialchars($formData['referidoJuridico'] ?? 'N/A') . "</td></tr>
                        {$representantesInfo}
                    </table>
                </div>";
}
?>