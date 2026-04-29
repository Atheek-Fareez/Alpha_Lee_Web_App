import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: "Alpha Lee Fitness <noreply@alphaleefit.com>",
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Transmission Successful: ", info.messageId);

    } catch (error) {
        // Explicitly triggers per the execution block requirement
        console.error("Email Auth Error or SMTP Connection Refused: ", error.message);
    }
};

export default sendEmail;
