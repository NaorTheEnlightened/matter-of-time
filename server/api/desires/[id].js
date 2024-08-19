import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const method = event.req.method;
  const id = parseInt(event.context.params.id);

  const userId = event.context.auth?.userId;

  if (!userId) {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: User not authenticated',
    });
  }

  if (method === 'GET') {
    try {
      const desire = await prisma.desire.findFirst({
        where: {
          id: id,
          userId: parseInt(userId),
        },
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

      if (!desire) {
        return createError({
          statusCode: 404,
          statusMessage: 'Desire not found',
        });
      }

      return desire;
    } catch (error) {
      console.error('Error fetching desire:', error);
      return createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }

  if (method === 'PUT') {
    const body = await readBody(event);

    try {
      // First, delete all related records
      await prisma.$transaction([
        prisma.force.deleteMany({
          where: { atomPlacement: { tool: { desireId: id } } },
        }),
        prisma.atomPlacement.deleteMany({
          where: { tool: { desireId: id } },
        }),
        prisma.hypothesis.deleteMany({
          where: { tool: { desireId: id } },
        }),
        prisma.tool.deleteMany({
          where: { desireId: id },
        }),
      ]);

      // Then, update the desire with new data
      const updatedDesire = await prisma.desire.update({
        where: { id },
        data: {
          title: body.title,
          image: body.image,
          timeDays: body.timeDays,
          timeHours: body.timeHours,
          timeMinutes: body.timeMinutes,
          tools: {
            create: body.tools.map((tool) => ({
              name: tool.name,
              probability: tool.probability,
              atomPlacements: {
                create: tool.atomPlacements.map((ap) => ({
                  beginning: ap.beginning,
                  end: ap.end,
                  forces: {
                    create: ap.forces.map((force) => ({
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
                      description: tool.hypothesis.description,
                      isSuccessful: tool.hypothesis.isSuccessful,
                    },
                  }
                : undefined,
            })),
          },
        },
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

      return updatedDesire;
    } catch (error) {
      console.error('Error updating desire:', error);
      return createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }

  if (method === 'DELETE') {
    try {
      // First, delete related records
      await prisma.force.deleteMany({
        where: {
          atomPlacement: {
            tool: {
              desireId: id,
            },
          },
        },
      });

      await prisma.atomPlacement.deleteMany({
        where: {
          tool: {
            desireId: id,
          },
        },
      });

      await prisma.hypothesis.deleteMany({
        where: {
          tool: {
            desireId: id,
          },
        },
      });

      await prisma.tool.deleteMany({
        where: {
          desireId: id,
        },
      });

      // Finally, delete the desire
      const deletedDesire = await prisma.desire.delete({
        where: {
          id: id,
          userId: userId, // Ensure the desire belongs to the authenticated user
        },
      });

      if (!deletedDesire) {
        return createError({
          statusCode: 404,
          statusMessage: 'Desire not found',
        });
      }

      return { success: true, message: 'Desire deleted successfully' };
    } catch (error) {
      console.error('Error deleting desire:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to delete desire',
      });
    }
  }
});
