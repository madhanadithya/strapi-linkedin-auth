import React, { memo, useState, useEffect } from "react";
import {
  Layout,
  BaseHeaderLayout,
  ContentLayout,
} from "@strapi/design-system/Layout";
import { Button } from "@strapi/design-system/Button";
import { TextInput } from "@strapi/design-system/TextInput";
import { Stack } from "@strapi/design-system/Stack";
import { Box } from "@strapi/design-system/Box";
import { FaLinkedin } from "react-icons/fa";
import axios from "axios";

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLinkedInSignIn = () => {
    axios
      .get("http://localhost:1337/linkedin-auth/linkedin-config")
      .then((response) => {
        const { clientId, redirectUri } = response.data;
        if (clientId && redirectUri) {
          window.location.href = `http://localhost:1337/linkedin-auth/linkedin-auth?clientId=${clientId}&redirectUri=${redirectUri}`;
        } else {
          console.error("Invalid LinkedIn config response:", response.data);
          setLoginMessage("Failed to get LinkedIn config.");
          setMessageColor("red");
        }
      })
      .catch((error) => {
        console.error("Error fetching LinkedIn config:", error);
        setLoginMessage("Error fetching LinkedIn configuration.");
        setMessageColor("red");
      });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    if (code) {
      console.log("Authorization Code:", code);

      axios
        .post("http://localhost:1337/linkedin-auth/token", { code })
        .then((response) => {
          console.log("User Info:", response.data);
          localStorage.setItem("jwtToken", response.data.jwt);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          setLoginMessage("Failed to authenticate with LinkedIn.");
          setMessageColor("red");
        });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1337/api/auth/local",
        {
          identifier: email,
          password,
        }
      );

      if (response.data && response.data.jwt) {
        localStorage.setItem("jwtToken", response.data.jwt);
        setIsLoggedIn(true);
        setLoginMessage("Login successful");
        setMessageColor("green");
      } else {
        setLoginMessage("No user found");
        setMessageColor("red");
      }
    } catch (error) {
      console.error("Error logging in:", error.response);
      setLoginMessage("No user found");
      setMessageColor("red");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    setLoginMessage("Logged out successfully");
    setMessageColor("green");
  };

  return (
    <Layout>
      <BaseHeaderLayout
        title="Welcome to LinkedIn Plugin"
        subtitle="Sign in with LinkedIn to get started"
        as="h2"
        style={{
          textAlign: "center",
        }}
      />
      <ContentLayout>
        <Box
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            padding: "30px",
            border: "1px solid #e3e3e3",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Stack spacing={4}>
            {isLoggedIn ? (
              <>
                <p>You are logged in.</p>
                <Button onClick={handleLogout} fullWidth variant="danger">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextInput
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin} fullWidth variant="default">
                  Login
                </Button>

                <Button
                  onClick={handleLinkedInSignIn}
                  variant="secondary"
                  startIcon={<FaLinkedin />}
                  fullWidth
                >
                  Sign in with LinkedIn
                </Button>
              </>
            )}

            {loginMessage && (
              <p
                style={{
                  color: messageColor,
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                {loginMessage}
              </p>
            )}
          </Stack>
        </Box>

        <Box
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <BaseHeaderLayout
            subtitle={
              <>
                Developed By:
                <br />
                <br />
                <span style={{ fontWeight: "normal" }}>
                  MADHAN ADITHYA and REVANTH BOLLEPALLI
                </span>
              </>
            }
            as="h2"
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          />
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default memo(HomePage);
