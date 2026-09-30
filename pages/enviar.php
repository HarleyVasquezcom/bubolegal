<?php
// enviar.php - Procesa el formulario de contacto y envÃ­a la informaciÃ³n recopilada a harleyvasquez@icloud.com

// Verificar que la solicitud sea por el mÃ©todo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    $is_ajax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ||
               (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
    if ($is_ajax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['status' => 'error', 'message' => 'MÃ©todo no permitido. Debe ser POST.']);
    } else {
        echo 'MÃ©todo no permitido. Debe ser POST.';
    }
    die();
}

// ConfiguraciÃ³n del correo de destino
$to = 'harleyvasquez@icloud.com';
$subject = 'Nueva solicitud de consulta - BUBO Legal';

// SanitizaciÃ³n y captura de los datos del formulario
$nombre   = isset($_POST['nombre']) ? trim(filter_var($_POST['nombre'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
$email    = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$telefono = isset($_POST['telefono']) ? trim(filter_var($_POST['telefono'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
$servicio = isset($_POST['servicio']) ? trim(filter_var($_POST['servicio'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
$mensaje  = isset($_POST['mensaje']) ? trim(filter_var($_POST['mensaje'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';

// Mapeo legible de opciones de servicio
$servicios_map = [
    'despido'         => 'Despido Laboral',
    'contratos'       => 'Contratos Laborales',
    'accidentes'      => 'Accidentes de Trabajo',
    'pensiones'       => 'Pensiones',
    'liquidacion'     => 'LiquidaciÃ³n de Prestaciones',
    'acoso'           => 'Acoso Laboral',
    'indemnizaciones' => 'Indemnizaciones',
    'derechos'        => 'Derechos Laborales',
    'otro'            => 'Otro'
];

$servicio_nombre = isset($servicios_map[$servicio]) ? $servicios_map[$servicio] : ($servicio !== '' ? $servicio : 'No especificado');

// ValidaciÃ³n de campos requeridos
if (empty($nombre) || empty($email) || empty($telefono) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    $error_msg = 'Por favor complete los campos obligatorios requeridos (nombre, correo vÃ¡lido y telÃ©fono).';
    $is_ajax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ||
               (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
    if ($is_ajax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['status' => 'error', 'message' => $error_msg]);
    } else {
        echo $error_msg;
    }
    die();
}

// Prevenir InyecciÃ³n de Encabezados (Header Injection)
$nombre_clean = str_replace(["", "
"], '', $nombre);
$email_clean  = str_replace(["", "
"], '', $email);

// ConstrucciÃ³n del mensaje de correo en HTML
$body = "
<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <title>Nueva solicitud de consulta - BUBO Legal</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;'>
  <div style='max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border-top: 4px solid #c9a84c; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
    <h2 style='color: #0a0a0a; margin-top: 0;'>Nueva solicitud de consulta</h2>
    <p style='font-size: 14px; color: #666;'>Ha recibido una nueva solicitud desde el formulario de contacto de <strong>BUBO Legal</strong>.</p>
    <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
    <table style='width: 100%; border-collapse: collapse;'>
      <tr>
        <td style='padding: 8px 0; font-weight: bold; width: 140px;'>Nombre:</td>
        <td style='padding: 8px 0;'>{$nombre_clean}</td>
      </tr>
      <tr>
        <td style='padding: 8px 0; font-weight: bold;'>Correo electrÃ³nico:</td>
        <td style='padding: 8px 0;'><a href='mailto:{$email_clean}' style='color: #c9a84c;'>{$email_clean}</a></td>
      </tr>
      <tr>
        <td style='padding: 8px 0; font-weight: bold;'>TelÃ©fono:</td>
        <td style='padding: 8px 0;'>{$telefono}</td>
      </tr>
      <tr>
        <td style='padding: 8px 0; font-weight: bold;'>Servicio de interÃ©s:</td>
        <td style='padding: 8px 0;'>{$servicio_nombre}</td>
      </tr>
      <tr>
        <td style='padding: 8px 0; font-weight: bold; vertical-align: top;'>DescripciÃ³n del caso:</td>
        <td style='padding: 8px 0; white-space: pre-wrap;'>{$mensaje}</td>
      </tr>
    </table>
    <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
    <p style='font-size: 12px; color: #999; text-align: center; margin-bottom: 0;'>BUBO Legal - Firma JurÃ­dica</p>
  </div>
</body>
</html>
";

// Encabezados del correo
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: BUBO Legal Formulario <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'estudiobubolegal.co') . '>',
    'Reply-To: ' . $nombre_clean . ' <' . $email_clean . '>',
    'X-Mailer: PHP/' . phpversion()
];

// EnvÃ­o del correo electrÃ³nico
$success = @mail($to, $subject, $body, implode("
", $headers));

// DeterminaciÃ³n de tipo de respuesta (AJAX / Formulario directo)
$is_ajax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') ||
           (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

if ($success) {
    if ($is_ajax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['status' => 'success', 'message' => 'SU SOLICITUD SE HA ENVIADO CORRECTAMENTE, PRONTO LE CONTACTAREMOS.']);
    } else {
        echo "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Solicitud Enviada | BUBO Legal</title><style>body{font-family:sans-serif;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px;}.card{background:#171717;border:1px solid #c9a84c;padding:40px;border-radius:8px;max-width:500px;}h2{color:#c9a84c;}a{color:#c9a84c;text-decoration:none;font-weight:bold;margin-top:20px;display:inline-block;}</style></head><body><div class='card'><h2>Â¡Gracias!</h2><p>SU SOLICITUD SE HA ENVIADO CORRECTAMENTE, PRONTO LE CONTACTAREMOS.</p><a href='pages/contacto.html'>Volver a Contacto</a></div></body></html>";
    }
} else {
    http_response_code(500);
    if ($is_ajax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['status' => 'error', 'message' => 'Hubo un error al procesar el envÃ­o del correo.']);
    } else {
        echo 'Hubo un error al procesar el envÃ­o del correo.';
    }
}
