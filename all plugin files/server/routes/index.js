module.exports = [
  {
    method: "POST",
    path: "/token",
    handler: "linkedinAuthController.getToken",
    config: {
      policies: [],
      middlewares: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/linkedin-config",
    handler: "linkedinAuthController.getConfig",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/linkedin-auth",
    handler: "linkedinAuthController.initiateLinkedInAuth",
    config: {
      auth: false,
    },
  },
];
