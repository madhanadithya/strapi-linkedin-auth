'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('linkedin-auth')
      .service('myService')
      .getWelcomeMessage();
  },
});
