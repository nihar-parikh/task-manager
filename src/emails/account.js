const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: "niharparikh91@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}`,
  });
};

const sendDeleteEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: "niharparikh91@gmail.com",
    subject: `GoodBye ${name}`,
    text: `Hey ${name}, Respond to us for deleting your account!!`,
  });
};

module.exports = { sendWelcomeEmail, sendDeleteEmail };
