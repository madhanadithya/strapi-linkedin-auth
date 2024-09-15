"use strict";

const axios = require("axios");
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

module.exports = {
  async getConfig(ctx) {
    ctx.send({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      redirectUri: process.env.REDIRECT_URI,
    });
  },

  async initiateLinkedInAuth(ctx) {
    const { clientId, redirectUri } = ctx.query;
    if (!clientId || !redirectUri) {
      ctx.throw(400, "Missing clientId or redirectUri");
      return;
    }
    const url = `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;
    ctx.redirect(url);
  },

  async getToken(ctx) {
    const { code } = ctx.request.body;
    if (!code) {
      ctx.throw(400, "Authorization code is required");
      return;
    }

    try {
      const response = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          httpsAgent,
        }
      );

      const accessToken = response.data.access_token;

      const userInfoResponse = await axios.get(
        "https://api.linkedin.com/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          httpsAgent,
        }
      );

      const userInfo = userInfoResponse.data;

      const username = userInfo.name;
      const email = userInfo.email;

      let user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });

      if (!user) {
        user = await strapi.db.query("plugin::users-permissions.user").create({
          data: {
            username,
            email,
            provider: "linkedin",
            password: username,
            confirmed: true,
            blocked: false,
            source: "LinkedIn",
          },
        });
      } else {
        await strapi.db.query("plugin::users-permissions.user").update({
          where: { id: user.id },
          data: {
            username,
            email,
            provider: "linkedin",
          },
        });
      }

      const jwtToken = await strapi.plugins[
        "users-permissions"
      ].services.jwt.issue({
        id: user.id,
      });

      ctx.body = {
        isValid: true,
        message: "LinkedIn validated successfully, user created or exists",
        jwt: jwtToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      console.error("Error in getToken:", error);
      ctx.status = 500;
      ctx.body = { message: "An error occurred while processing the request." };
    }
  },
};
