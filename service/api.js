require("dotenv").config();
const express = require("express");
const jwt = require("express-jwt");
const { displayStateMap, jwtAuthz } = require("express-jwt-aserto");
const jwksRsa = require("jwks-rsa");
const cors = require("cors");
const app = express();

const authzOptions = {
  authorizerServiceUrl: process.env.AUTHORIZER_SERVICE_URL,
  policyId: process.env.POLICY_ID,
  policyRoot: process.env.POLICY_ROOT,
  authorizerApiKey: process.env.AUTHORIZER_API_KEY,
  tenantId: process.env.TENANT_ID,
};

//Aserto authorizer middleware function
const checkAuthz = jwtAuthz(authzOptions);

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI,
  }),

  // Validate the audience and the issuer
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ["RS256"],
});


// Enable CORS
app.use(cors());

app.use(displayStateMap(authzOptions));

// Protected API endpoint
app.get("/api/protected", checkJwt, checkAuthz, function (req, res) {
  //send the response
  res.json({ secretMessage: "Here you go, very sensitive information for" });
});

// Launch the API Server at localhost:8080
app.listen(8080);