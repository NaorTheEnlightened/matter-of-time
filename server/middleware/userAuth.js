// server/middleware/userAuth.js
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
  const authHeader = getRequestHeader(event, 'authorization');

  // If no authorization header is present, continue without setting auth context
  if (!authHeader) {
    console.log(
      'No authorization header provided, continuing without authentication',
    );
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await verifyToken(token);
    // Set the userId in the event context
    event.context.auth = { userId: decodedToken.userId };
  } catch (error) {
    console.error('Token verification failed:', error.message);
    // Instead of throwing an error, we'll just log it and continue without setting auth context
  }
});
