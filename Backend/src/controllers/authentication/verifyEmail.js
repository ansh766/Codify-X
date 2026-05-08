const jwt = require("jsonwebtoken");
const { Resend } = require('resend');
const User = require("../../models/users"); 

const resend = new Resend('re_NcaU8e6R_8eAn4okpU5WVVc9fgMM28vZi');

const sendVerificationEmail = async (req, res) => {
    try{

        if (req.user.emailVerified) 
            return res.status(200).send('Email already verified.');

        const token = jwt.sign(
            { 
                _id: req.user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: 600 }
        );

        const verificationLink = `${process.env.FRONTEND_ORIGIN}/profile/account/verify-email?token=${token}`; 

        try {
            await resend.emails.send({
                from: 'HackForge <noreply@resend.dev>',
                to: req.user.emailId,
                subject: "Verify Your Email",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #f97316;">Verify Your Email</h2>
                        <p>Hello ${req.user.username},</p>
                        <p>Click the button below to verify your email:</p>
                        <a href="${verificationLink}" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 16px 0;">Verify Email</a>
                        <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
                        <p style="color: #666; font-size: 12px;">This link expires in 10 minutes.</p>
                    </div>
                `
            });
            res.status(200).send("Email sent successfully");
        } catch (emailError) {
            console.log(emailError.message);
            res.status(500).send("Email sending failed: " + emailError.message);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Email Verification failed")
    }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  const { user } = req;
  
  try {

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded._id);

    if(!user)
      return res.status(400).send("Account does not exist");

    if (user.emailVerified) {
      return res.send('Email already verified.');
    }

    user.emailVerified = true;
    await user.save();

    res.status(200).send('Email verified successfully!');
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Invalid or expired token.');
  }
};


module.exports = { sendVerificationEmail, verifyEmail };
