# Node-JWT-Vue

On Signup and Login the server generate a token (JWT) with an expire life of 1 hour and a refresh token with 5 hours life.

When the client request user data it must provide the token.

When the token expires, a new token will be provided by the server (on client request with the support of the refresh token).