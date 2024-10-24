# Social Login using LinkedIn Plugin for Strapi

## Introduction

This plugin enables LinkedIn social login using OpenID Connect in Strapi. It handles the OAuth 2.0 authorization flow, retrieves user information from LinkedIn, and creates or updates the user in Strapi's database.

## Installation

1. **Install our plugin into your Strapi project:**

npm install strapi-linkedin-auth

2. **Install required dependencies:**

npm install

npm install axios react-icons

3. **Set up environment variables:**

Add the following to your `.env` file:

```env
LINKEDIN_CLIENT_ID=<your-client-id>
LINKEDIN_CLIENT_SECRET=<your-client-secret>
REDIRECT_URI=<your-redirect-uri>
```

## Your ".env" file should look like this:

```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_key_1,your_app_key_2,your_app_key_3,your_app_key_4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

JWT_SECRET=your_jwt_secret

LINKEDIN_CLIENT_ID= your_client_id
LINKEDIN_CLIENT_SECRET= your_client_secret
REDIRECT_URI = your_redirect_url

```

### Your "root folder config/plugins.js" should look like this:

```bash
module.exports = {
  "linkedin-auth": {
    enabled: true,
    resolve: "./src/plugins/linkedin-auth",
  },
};

```

## Plugin Structure

- **`linkedin-auth/admin/src/pages/homepage/index.js`:** frontend component for LinkedIn login in the Strapi admin panel.
- **`linkedin-auth/server/controllers/linkedin-auth.js`:** Handles LinkedIn OAuth flow and user creation/updating.
- **`linkedin-auth/server/routes/index.js`:** Defines API routes for LinkedIn authentication.

## Endpoints

- **GET `/linkedin-auth/linkedin-config`:** Fetch LinkedIn client ID and redirect URI.
- **POST `/linkedin-auth/token`:** Exchange authorization code for access token and retrieve user info.

## LinkedIn's Endpoints that we have used:

- **POST "authorization_endpoint":** "https://www.linkedin.com/oauth/v2/authorization".
- **POST "token_endpoint":** "https://www.linkedin.com/oauth/v2/accessToken".
- **GET "userinfo_endpoint":** "https://api.linkedin.com/v2/userinfo".

## Handling LinkedIn Sign-In:

```javascript
const handleLinkedInSignIn = () => {
  const url = `https://www.linkedin.com/oauth/v2/authorization?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email`;
  window.location.href = url;
};
```

## Exchanging Authorization Code for Token:

```javascript
const response = await axios.post(
  "https://www.linkedin.com/oauth/v2/accessToken",
  new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
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
```

## Required Permissions

- **openid:** Authenticate the user.
- **profile:** Retrieve the user's LinkedIn profile.
- **email:** Retrieve the user's email address.

## Response Data

After successful LinkedIn login, the following data is returned:

```json
{
  "isValid": true,
  "message": "LinkedIn validated successfully, user created or exists",
  "jwt": "<jwt-token>",
  "user": {
    "id": "<user-id>",
    "username": "<user-name>",
    "email": "<user-email>"
  }
}
```

## Usage

1. **Start Strapi:**

npm run develop

2. **Navigate to the LinkedIn login page in the Strapi admin panel.**

3. **Click on "Sign in with LinkedIn" to initiate the login process.**

4. **After successful authentication, the user will be created or updated in the Strapi database, and a JWT token will be issued.**

## Additional Information

- **LinkedIn API Documentation:** [Sign In with LinkedIn using OpenID Connect]

(https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2?context=linkedin%2Fconsumer%2Fcontext)
and
(https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication?context=linkedin/context)

## Flow Diagram

Here is the LinkedIn Flow Diagram:

![LinkedIn Flow Diagram](https://github.com/madhanadithya/strapi-plugin-for-login-using-linkedin/blob/main/linkedIn_FlowDiagram_new.png)

## Video Demonstrations

### React Frontend

[![React Frontend](https://img.youtube.com/vi/APzxc7gaYZQ/0.jpg)](https://youtu.be/APzxc7gaYZQ)

- **Filename:** `sample_react_frontend.mp4`
- **Description:** Demonstrates the React frontend setup.

### Strapi Homepage Frontend

[![Strapi Homepage Frontend](https://img.youtube.com/vi/sqhUxJA_qJI/0.jpg)](https://youtu.be/sqhUxJA_qJI)

- **Filename:** `sample_strapi_homepage_frontend.mp4`
- **Description:** Shows the frontend for the Strapi homepage.

### Normal Login Strapi Homepage

[![Normal Login Strapi Homepage](https://img.youtube.com/vi/UZhyAL3wEK4/0.jpg)](https://youtu.be/UZhyAL3wEK4)

- **Filename:** `normal_login_strapi_homepage.mp4`
- **Description:** Demonstrates the normal login functionality on the Strapi homepage.

### GitHub Repository

You can find the source code and contribute to the project on GitHub: [strapi-linkedin-auth](https://github.com/madhanadithya/strapi-linkedin-auth)

### Contributing

We welcome contributions to this plugin. If you have any improvements or bug fixes, please open an issue or submit a pull request on the GitHub repository.
