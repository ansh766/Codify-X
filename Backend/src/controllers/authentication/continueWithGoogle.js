const { google } = require('googleapis');
const oauth2Client = require("../../config/oauth2Client");
const User = require("../../models/users");
const jwt = require("jsonwebtoken");

// Redirect user to Google's consent screen
const redirectToGooglePage = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  });

  res.redirect(url);
}

// Handle callback and get tokens
const authWithGoogle = async (req, res) => {
  const code = req.query.code;

  if (!code) return res.send('No code received');

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("Google token received:", {
      access_token: !!tokens.access_token,
      refresh_token: !!tokens.refresh_token,
      token_type: tokens.token_type
    });

    oauth2Client.setCredentials(tokens);

    console.log("Credential check:", {
      hasAccessToken: !!oauth2Client.credentials.access_token,
      tokenType: oauth2Client.credentials.token_type
    });

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const { data: userInfo } = await oauth2.userinfo.get({
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    });

    let user = await User.findOne({
      emailId: userInfo.email
    });

    // If user doesn't exist with the given emailId, create a new one
    if (!user) {
      const newUser = {
        emailId: userInfo.email,
        username:
          userInfo.given_name +
          (userInfo.family_name || '') +
          Math.floor(Math.random() * 50) +
          1,
        fullName: userInfo.name || null,
        emailVerified: userInfo.verified_email || false,
      };

      user = await User.create(newUser);
    } else {
      if (!user.emailVerified && userInfo.verified_email)
        user.emailVerified = true;

      if (!user.fullName && userInfo.name)
        user.fullName = userInfo.name;

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        emailId: user.emailId,
        role: user.role
      },
      process.env.JWT_KEY,
      {
        expiresIn: 3600
      }
    );

    // Send cookie and redirect
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 3600000
    });

    res.redirect(process.env.FRONTEND_ORIGIN);

  } catch (error) {
    console.error('OAuth Error:', error);

    res.redirect(
      `${process.env.FRONTEND_ORIGIN}/sociallogin/error/google`
    );
  }
}

module.exports = {
  redirectToGooglePage,
  authWithGoogle
};
