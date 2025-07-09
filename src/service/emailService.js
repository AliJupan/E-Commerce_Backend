import nodeMailer from "nodemailer";

class EmailService {
  constructor(logger,emailTemplate) {
    this.logger = logger;
    this.emailTemplate = emailTemplate;


    this.transporter = nodeMailer.createTransport({
      host: process.env.BREVO_HOST ,
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });
  }

  async sendForgotPasswordMail(user_email, token) {
    try {
      const options = {
        from: process.env.BREVO_EMAIL,
        to: user_email,
        subject: "Forgot Password",
        html: this.emailTemplate.forgot_password(token)
      };
      await this.transporter.sendMail(options);
      this.logger.info(`Email sent to ${user_email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${user_email}: ${error.message}`);
    }
  }

  async sendRandomPassword(user_email, name  ,randomPassword) {
    try {
      const options = {
        from: process.env.BREVO_EMAIL,
        to: user_email,
        subject: "Random Password",
        html: this.emailTemplate.randomPassword(name,randomPassword),
      };
      await this.transporter.sendMail(options);
      this.logger.info(`Email sent to ${user_email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${user_email}: ${error.message}`);
    }
  }

//   async supportReply(adminEmail,user_email,userName,message) {
//     try {
//       const options = {
//         from: process.env.BREVO_EMAIL,
//         to: user_email,
//         subject: "Support Reply",
//         html: this.emailTemplate.supportReply(userName,adminEmail,message),
//       };
//       await this.transporter.sendMail(options);
//     } catch (error) {
//       console.log(error, error.message);
//     }
//   }

  // async sendVerifyEmailMail(user_email) {
  //   try {
  //     const options = {
  //       from: "alizhupani2002@gmail.com",
  //       to: user_email,
  //       subject: "Verify Email",
  //       html: "<p>This is a verification email click on the link to verify!!</p>",
  //     };
  //     await this.transporter.sendMail(options);
  //   } catch (error) {
  //     console.log(error, error.message);
  //   }
  // }
}

export default EmailService;
