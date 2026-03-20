import nodemailer from "nodemailer";
import {
  MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM, FRONTEND_URL,
} from "../config/config.js";

const createTransporter = () =>
  nodemailer.createTransport({
    host:   MAIL_HOST,
    port:   Number(MAIL_PORT),
    secure: Number(MAIL_PORT) === 465,
    auth:   { user: MAIL_USER, pass: MAIL_PASS },
    tls:    { rejectUnauthorized: false },
  });

export const verifyMailConnection = async () => {
  try {
    const t = createTransporter();
    await t.verify();
    console.log("[emailService] ✓ Conexión SMTP verificada");
  } catch (err) {
    console.error("[emailService] ✗ Error SMTP:", err.message);
  }
};

const emailHead = () => `
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#F4F6F8;font-family:'Segoe UI',Arial,sans-serif;color:#2F3D4D;}
    .wrapper{max-width:560px;margin:40px auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(47,61,77,.10);}
    .header{background:#2F3D4D;padding:36px 40px 28px;}
    .logo{font-size:22px;font-weight:800;color:#fff;letter-spacing:.06em;}
    .logo span{color:#95B359;}
    .logo-sub{font-size:11px;color:rgba(255,255,255,.35);margin-top:4px;letter-spacing:.1em;text-transform:uppercase;}
    .body{padding:36px 40px;}
    .greeting{font-size:20px;font-weight:700;color:#2F3D4D;margin-bottom:10px;}
    .text{font-size:14px;color:#8A99AA;line-height:1.7;margin-bottom:20px;}
    .creds{background:#F4F6F8;border:1px solid #E2E8EE;border-radius:10px;padding:18px 22px;margin-bottom:24px;}
    .cred-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #E2E8EE;}
    .cred-row:last-child{border-bottom:none;}
    .cred-label{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:#8A99AA;}
    .cred-value{font-size:13px;font-weight:600;color:#2F3D4D;word-break:break-all;}
    .btn-wrap{text-align:center;margin-bottom:28px;}
    .btn{display:inline-block;background:#95B359;color:#fff !important;font-size:14px;font-weight:700;padding:14px 36px;border-radius:9px;text-decoration:none;letter-spacing:.03em;}
    .notice{font-size:12px;color:#8A99AA;line-height:1.7;text-align:center;}
    .footer{background:#F4F6F8;border-top:1px solid #E2E8EE;padding:18px 40px;text-align:center;}
    .footer p{font-size:11px;color:#8A99AA;}
  </style>
`;

const emailHeader = () => `
  <div class="header">
    <div class="logo">GAIA</div>
    <div class="logo-sub">CRM · Propuestas</div>
  </div>
`;

const emailFooter = () => `
  <div class="footer">
    <p>© ${new Date().getFullYear()} GAIA CRM · Todos los derechos reservados</p>
  </div>
`;

const credRow = (label, value) => `
  <div class="cred-row">
    <span class="cred-label">${label}</span>
    <span class="cred-value">${value}</span>
  </div>
`;

const verificationTemplate = (nombre, email, password, verifyUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>${emailHead()}</head>
<body>
  <div class="wrapper">
    ${emailHeader()}
    <div class="body">
      <p class="greeting">Hola, ${nombre} 👋</p>
      <p class="text">
        Tu cuenta en <strong>GAIA CRM</strong> ha sido creada. A continuación encontrarás
        tus credenciales de acceso temporales. Te recomendamos cambiar tu contraseña tras
        el primer inicio de sesión.
      </p>
      <div class="creds">
        ${credRow("Correo", email)}
        ${credRow("Contraseña temporal", password)}
      </div>
      <div class="btn-wrap">
        <a href="${verifyUrl}" class="btn">✓ Verificar mi cuenta</a>
      </div>
      <p class="notice">
        Este enlace expira en <strong>24 horas</strong>.<br/>
        Si no esperabas este correo, puedes ignorarlo con seguridad.
      </p>
    </div>
    ${emailFooter()}
  </div>
</body>
</html>
`;

export const sendVerificationEmail = async (email, nombre, token, password) => {
  const verifyUrl   = `${FRONTEND_URL}/verificar?token=${token}`;
  const transporter = createTransporter();

  await transporter.sendMail({
    from:    MAIL_FROM,
    to:      email,
    subject: "Bienvenido a GAIA — Verifica tu cuenta",
    html:    verificationTemplate(nombre, email, password, verifyUrl),
  });

  console.log(`[emailService] ✓ Verificación enviada a ${email}`);
};