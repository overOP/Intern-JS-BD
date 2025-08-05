// const nodemailer = require("nodemailer");

// const sendEmail = async (option) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const emailOptions = {
//       from: "dev.pradeepchaudhary@gmail.com", // or use EMAIL_USER
//       to: option.to,
//       subject: option.subject,
//       html: option.html,
//     };

//     await transporter.sendMail(emailOptions);
//     console.log("✅ Reset email sent to", option.to);
//   } catch (error) {
//     console.error("❌ Failed to send email:", error);
//     throw new Error("Error sending email");
//   }
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  // Use ethereal for dev/testing
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Test App" <no-reply@test.com>',
    to,
    subject,
    html,
  });

  console.log("✅ Message sent: %s", info.messageId);
  console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
