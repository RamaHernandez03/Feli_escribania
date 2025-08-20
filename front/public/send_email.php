<?php
// send_email.php - Gmail SMTP con envío en background
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/email_errors.log');

function logError($message) {
    error_log(date('Y-m-d H:i:s') . " - " . $message . PHP_EOL, 3, __DIR__ . '/email_errors.log');
}

function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);

    // Si existe fastcgi_finish_request, libera la respuesta al cliente
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        flush();
        ob_flush();
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError("Método no permitido: " . $_SERVER['REQUEST_METHOD']);
    sendJsonResponse(['success' => false, 'error' => 'Método no permitido'], 405);
    exit;
}

// Cargar PHPMailer
require_once __DIR__ . '/PHPMailer-master/src/Exception.php';
require_once __DIR__ . '/PHPMailer-master/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    logError("Iniciando proceso de envío de email");
    
    $maxFileSize = 25 * 1024 * 1024; // 25MB máximo
    
    if (!isset($_POST['formData']) || !isset($_FILES['pdfFile'])) {
        throw new Exception('Datos del formulario o archivo PDF faltantes');
    }

    if ($_FILES['pdfFile']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Error en la carga del archivo PDF');
    }

    if ($_FILES['pdfFile']['size'] > $maxFileSize) {
        throw new Exception('El archivo PDF es demasiado grande. Máximo 25MB permitido.');
    }

    $formData = json_decode($_POST['formData'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar los datos del formulario');
    }

    $clientName = isset($formData['tipoPersona']) && $formData['tipoPersona'] === 'fisica' 
        ? ($formData['nombre'] ?? 'Cliente') 
        : ($formData['razonSocial'] ?? 'Empresa');

    $pdfFile = $_FILES['pdfFile'];
    logError("PDF file size: " . $pdfFile['size'] . " bytes");

    $tipoPersona = $formData['tipoPersona'] === 'fisica' ? 'Persona Física' : 'Persona Jurídica';
    $fechaActual = date('d/m/Y H:i:s');

    // 🔹 RESPONDEMOS AL USUARIO DE INMEDIATO
    sendJsonResponse([
        'success' => true,
        'message' => 'Formulario recibido, procesando envío...',
        'debug' => [
            'client' => $clientName,
            'type' => $tipoPersona,
            'timestamp' => $fechaActual
        ]
    ]);

    // 🔹 EL ENVÍO SIGUE EN BACKGROUND
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    $emailFrom = 'felipelariva@gmail.com';
    $emailPassword = 'bgkkehuzwuyardtv';
    $emailTo = 'felipelariva@gmail.com';
    
    $mail->Username = $emailFrom;
    $mail->Password = $emailPassword;
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->SMTPDebug = 0;

    $mail->setFrom($emailFrom, 'Escribanía La Riva - Sistema de Formularios');
    $mail->addAddress($emailTo, 'Dr. La Riva');

    $mail->Subject = "Nuevo Formulario UIF - {$tipoPersona} - {$clientName}";
    $emailBody = generateEmailBody($formData, $clientName, $tipoPersona, $fechaActual);

    $mail->isHTML(true);
    $mail->Body = $emailBody;

    $fileName = 'Formulario_UIF_' . preg_replace('/[^A-Za-z0-9_-]/', '_', $clientName) . '_' . date('Y-m-d') . '.pdf';
    $mail->addAttachment($pdfFile['tmp_name'], $fileName, 'base64', 'application/pdf');

    if ($mail->send()) {
        logError("Email enviado correctamente a {$emailTo}");
    } else {
        logError("Error al enviar email: " . $mail->ErrorInfo);
    }

} catch (Exception $e) {
    logError("Exception: " . $e->getMessage());
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