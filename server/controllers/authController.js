const axios = require('axios');
const jwt = require('jsonwebtoken'); // We'll still use JWT for generating access tokens

// Use MongoDB Realm's API endpoints
const appId = process.env.MONGODB_APP_ID;  // MongoDB App ID
const registrationUrl = `https://realm.mongodb.com/api/client/v2.0/app/${appId}/auth/providers/local-userpass/register`;
const loginUrl = `https://realm.mongodb.com/api/client/v2.0/app/${appId}/auth/providers/local-userpass/login`;

// Register a new user (MongoDB handles email/password storage)
async function register(req, res) {
  console.log('Inside register controller');
  const { username, email, first_name, last_name, password, password_confirm } = req.body;

  // Check if all required fields are present
  if (!username || !email || !password || !password_confirm || !first_name || !last_name) {
    return res.status(422).json({ message: 'Invalid fields' });
  }

  // Check if passwords match
  if (password !== password_confirm) {
    return res.status(422).json({ message: 'Passwords do not match' });
  }

  // Register the user via MongoDB Data API
  try {
    const response = await axios.post(registrationUrl, {
      email: email,
      password: password
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    return res.status(400).json({ message: 'Could not register user', error: error.response ? error.response.data : error.message });
  }
}

// User login
async function login(req, res) {
  console.log('Inside login controller');
  const { email, password } = req.body;

  // Check if all required fields are present
  if (!email || !password) {
    return res.status(422).json({ message: 'Invalid fields' });
  }

  // Authenticate the user via MongoDB Data API
  try {
    const response = await axios.post(loginUrl, {
      username: email,
      password: password
    });

    const { access_token } = response.data; // MongoDB Realm provides this token

    // Optionally, you can generate an additional JWT if needed for other services
    const customAccessToken = jwt.sign(
      { id: email }, // MongoDB already manages sessions, but you can add custom logic here
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1800s' }
    );

    res.json({ message: 'User logged in successfully', token: access_token, customAccessToken });
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    return res.status(401).json({ message: 'Invalid credentials', error: error.response ? error.response.data : error.message });
  }
}

// User logout (MongoDB manages session tokens, so we don't need to manage refresh tokens manually)
async function logout(req, res) {
  console.log('Inside logout controller');
  // Clear cookies or invalidate tokens in frontend if necessary
  res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204); // No content response
}

// Refresh controller (MongoDB Realm handles token refresh internally)
async function refresh(req, res) {
  console.log('Inside refresh controller');
  const { refresh_token } = req.cookies;

  if (!refresh_token) return res.sendStatus(401);

  // Verify refresh token via MongoDB Realm if necessary (for session handling)
  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1800s' }
    );

    res.json({ access_token: newAccessToken });
  });
}

// Get user data (used for frontend to fetch the current user)
async function user(req, res) {
  console.log('Inside user controller');
  const user = req.user; // This would be handled by MongoDB's authentication system
  res.status(200).json({ user });
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  user
};
