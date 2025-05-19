const { createClient } = require('@supabase/supabase-js');

const supabaseAuth = createClient(
  'https://gomupndamrflcbqgpusz.supabase.co/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbXVwbmRhbXJmbGNicWdwdXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODM2ODgsImV4cCI6MjA2MDI1OTY4OH0.kw-95g2p6lSV1nr5lN0MCUBMEJmH0gz0bZ3vYIHxx0Q' 
);

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    console.log("Authorization Header:", authHeader);

    const token = authHeader.split(' ')[1];
    console.log("Received token:", token);

    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    req.userId = user.id;

    next();
  } catch (err) {
    console.error('Middleware error:', err);
    res.status(500).json({ error: 'Authentication server error' });
  }
};

module.exports = authenticateUser;


/* const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client for your USERS service
const supabaseAuth = createClient(
  'https://gomupndamrflcbqgpusz.supabase.co/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbXVwbmRhbXJmbGNicWdwdXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODM2ODgsImV4cCI6MjA2MDI1OTY4OH0.kw-95g2p6lSV1nr5lN0MCUBMEJmH0gz0bZ3vYIHxx0Q' 
);

const authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    console.log("Authorization Header:", req.headers.authorization);

    const token = authHeader.split(' ')[1];
    console.log("Received token:", token);

    // Verify the token format
    if (!token || token.split('.').length !== 3) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token with Supabase Users project
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Save user information to request object for next handlers
    req.user = user;
    req.userId = user.id;

    next(); // Allow request to proceed
  } catch (err) {
    console.error('Middleware error:', err);
    res.status(500).json({ error: 'Authentication server error' });
  }
};

module.exports = authenticateUser;
*/
