// server/api/desires/index.js

import { writeFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const method = event.req.method;
  // const userId = event.req.headers['user-id'];

  // if (!userId) {
  //   return createError({
  //     statusCode: 400,
  //     statusMessage: 'User ID is required',
  //   });
  // }

  // Get userId from the event context set by the middleware
  const userId = event.context.auth?.userId;

  if (!userId) {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: User not authenticated',
    });
  }

  if (method === 'GET') {
    // If no userId is provided, return an empty array or public desires
    if (!userId) {
      console.log(
        'No authenticated user, returning public desires or empty array',
      );
      return []; // or return public desires if you have any
    }
    const desires = await prisma.desire.findMany({
      where: { userId: parseInt(userId) },
    });
    return desires;
  }

  if (method === 'POST') {
    if (!userId) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: User not authenticated',
      });
    }

    try {
      const body = await readBody(event);
      console.log('Received body:', body);

      let imageUrl = body.image;

      // Check if the image is a base64 string
      if (body.image && body.image.startsWith('data:image')) {
        const base64Data = body.image.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${Date.now()}.png`;
        const path = join(process.cwd(), 'public', 'uploads', filename);
        await writeFile(path, buffer);
        imageUrl = `/uploads/${filename}`;
      }

      const desireData = {
        title: body.title || 'Untitled Desire',
        image: imageUrl,
        timeDays: Number(body.timeDays) || 0,
        timeHours: Number(body.timeHours) || 0,
        timeMinutes: Number(body.timeMinutes) || 0,
        tools: body.tools || [], // Ensure tools is always an array
        userId: parseInt(userId),
      };

      console.log('Processed desire data:', desireData);

      const desire = await prisma.desire.create({
        data: desireData,
      });
      return desire;
    } catch (error) {
      console.error('Error creating desire:', error);
      return createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }
});
