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
    try {
      const desires = await prisma.desire.findMany({
        where: { userId: parseInt(userId) },
        include: {
          tools: {
            include: {
              atomPlacements: {
                include: {
                  forces: true,
                },
              },
              hypothesis: true,
            },
          },
        },
      });

      return desires.map((desire) => ({
        ...desire,
        tools: desire.tools.map((tool) => ({
          ...tool,
          probability: Number(tool.probability), // Ensure probability is a number
        })),
      }));
    } catch (error) {
      console.error('Error fetching desires:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch desires',
      });
    }
  }

  if (method === 'POST') {
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
        userId: parseInt(userId),
        tools: {
          create: (body.tools || []).map((tool) => ({
            name: tool.name || '',
            probability: Number(tool.probability) || 0,
            atomPlacements: {
              create: (tool.atomPlacements || []).map((ap) => ({
                beginning: ap.beginning || '',
                end: ap.end || '',
                forces: {
                  create: (ap.forces || []).map((force) => ({
                    description:
                      typeof force.description === 'object'
                        ? force.description.description || ''
                        : force.description || '',
                  })),
                },
              })),
            },
            hypothesis: tool.hypothesis
              ? {
                  create: {
                    description: tool.hypothesis.description || '',
                    isSuccessful: tool.hypothesis.isSuccessful || false,
                  },
                }
              : undefined,
          })),
        },
      };

      console.log('Processed desire data:', desireData);

      const desire = await prisma.desire.create({
        data: desireData,
        include: {
          tools: {
            include: {
              atomPlacements: {
                include: {
                  forces: true,
                },
              },
              hypothesis: true,
            },
          },
        },
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
