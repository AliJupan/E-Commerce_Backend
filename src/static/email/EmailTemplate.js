class EmailTemplate {
  constructor(logger) {
    this.logger = logger;
  }

  forgot_password(token) {
    const resetLink = `${process.env.FRONTEND_RESETPASSWORD_URL}${token}`;
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: #333333;
                }
                p{
                    font-size : 18px
                }
                .header{
                    margin-bottom: 40px;
                }
                .container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                }
                .logo {
                    margin-bottom: 20px;
                }
                .logo img {
                    max-width: 224px;
                    max-height: 127px
                }
                .message {
                    font-size: 18px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .message h1{
                    font-size : 32px
                }
                .button {
                    background-color: #1a42a2;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    display: inline-block;
                    font-size: 16px;
                }
                .body {
                    margin-top: 20px;
                    font-size: 14px;
                }
                .footer{
                    color : #A1A1A1
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <img src="${process.env.LOGO_URL}" alt="Logo">
                </div>
                <div class="message">
                    <h1>Forgot your Password?</h1>
                    <p>Don't worry, we're here to help you recover your account.</p>
                </div>
                <a href="${resetLink}" style="background-color: #1a42a2; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 16px;">Recover Password</a>
                <p>If this isn’t you, please ignore this email</p>
                <div class="footer">
                    <p>Copyright all rights reserved</p>
                </div>
            </div>
        </body>
        </html>
        `;
  }

  randomPassword(name, randomPassword) {
    const loginLink = `${process.env.FRONTEND_LOGIN_URL}`;
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: #333333;
                }
                p{
                    font-size : 18px
                }
                .header{
                    margin-bottom: 40px;
                }
                .container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                }
                .logo {
                    margin-bottom: 20px;
                }
                .logo img {
                    max-width: 224px;
                    max-height: 127px
                }
                .message {
                    font-size: 18px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .message h1{
                    font-size : 32px
                }
                .button {
                    background-color: #1a42a2;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    display: inline-block;
                    font-size: 16px;
                }
                .body {
                    margin-top: 20px;
                    font-size: 14px;
                }
                .footer{
                    color : #A1A1A1
                }
                .randomPassword{
                    color:#04CB83
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <img src="${process.env.LOGO_URL}" alt="Logo">
                </div>
                <div class="message">
                    <h1>Hey ${name}</h1>
                    <p>Here is your generated password:</p>
                    <p class = "randomPassword">${randomPassword}</p>
                </div>
                <a href="${loginLink}" style="background-color: #1a42a2; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; font-size: 16px;">Login</a>
                <p>Welcome to Sky Real Estate</p>
                <div class="footer">
                    <p>Copyright all rights reserved</p>
                </div>
            </div>
        </body>
        </html>
        `;
  }

  orderConfirmationCustomer(name, orderId, invoiceUrl) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  color: #333333;
              }
              .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
                  max-width: 500px;
                  width: 100%;
              }
              .logo img {
                  max-width: 224px;
                  margin-bottom: 20px;
              }
              h1 {
                  font-size: 28px;
                  margin-bottom: 10px;
              }
              p {
                  font-size: 16px;
                  margin-bottom: 20px;
              }
              .button {
                  background-color: #1a42a2;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  display: inline-block;
                  font-size: 16px;
              }
              .footer {
                  color: #A1A1A1;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="logo">
                  <img src="${process.env.LOGO_URL}" alt="Logo">
              </div>
              <h1>Thank you for your order, ${name}!</h1>
              <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>
              <p>You can download your invoice below:</p>
              <a href="${process.env.BACKEND_URL}${invoiceUrl}" class="button">View Invoice</a>
              <div class="footer">
                  <p>We appreciate your business!</p>
                  <p>Copyright all rights reserved</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  orderNotificationAdmin(orderId, customerName, invoiceUrl) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  color: #333333;
              }
              .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
                  max-width: 500px;
                  width: 100%;
              }
              .logo img {
                  max-width: 224px;
                  margin-bottom: 20px;
              }
              h1 {
                  font-size: 28px;
                  margin-bottom: 10px;
              }
              p {
                  font-size: 16px;
                  margin-bottom: 20px;
              }
              .button {
                  background-color: #1a42a2;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  display: inline-block;
                  font-size: 16px;
              }
              .footer {
                  color: #A1A1A1;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="logo">
                  <img src="${process.env.LOGO_URL}" alt="Logo">
              </div>
              <h1>New Order Received</h1>
              <p>Customer: <strong>${customerName}</strong></p>
              <p>Order ID: <strong>#${orderId}</strong></p>
              <p>You can review the invoice below:</p>
              <a href="${process.env.BACKEND_URL}${invoiceUrl}" class="button">View Invoice</a>
              <div class="footer">
                  <p>Log into the admin dashboard for more details.</p>
                  <p>Copyright all rights reserved</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
}

export default EmailTemplate;
