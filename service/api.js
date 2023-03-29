require("dotenv").config();
const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const { displayStateMap, jwtAuthz } = require('@aserto/aserto-node')
const jwksRsa = require("jwks-rsa");
const cors = require("cors");
const app = express();

const authzOptions = {
  authorizerServiceUrl: process.env.ASERTO_AUTHORIZER_SERVICE_URL,
  instanceName: process.env.ASERTO_POLICY_INSTANCE_NAME,
  instanceLabel: process.env.ASERTO_POLICY_INSTANCE_LABEL,
  policyRoot: 'asertodemo',
  authorizerApiKey: process.env.ASERTO_AUTHORIZER_API_KEY,
  tenantId: process.env.ASERTO_TENANT_ID,
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
  res.json({ secretMessage: "Here you go, very sensitive information for ya!" });
});

// Launch the API Server at localhost:8080
app.listen(8080);