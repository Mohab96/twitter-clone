const transporter = require("./transporter");

async function send_ChangePassword(to, username) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: "Password Changed ✔",
    text: `Hello ${username}, your password has been changed successfully.\n please login again.`,
  });

  console.log("[!] Email sent: %s", info.messageId);
}

async function send_ChangeEmail(to, username) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: "Email Changed ✔",
    text: `Hello ${username}, your email has been changed successfully to this email address.`,
  });

  console.log("[!] Email sent: %s", info.messageId);
}

async function send_SignUp(to, username) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: "Welcome To X!",
    text: `Hello ${username}, thanks for registering for X, head to the home page to get started!`,
  });

  console.log("[!] Email sent: %s", info.messageId);
}

async function send_CustomEmail(to, subject, body) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: subject,
    text: body,
  });

  console.log("[!] Email sent: %s", info.messageId);
}

module.exports = {
  send_ChangePassword,
  send_ChangeEmail,
  send_SignUp,
  send_CustomEmail,
};
