export default defineEventHandler(async (event) => {
  const method = event.req.method;
  const id = parseInt(event.context.params.id);
  const userId = event.req.headers['user-id']; // Assuming you're passing user ID in headers

  if (method === 'PUT') {
    try {
      const body = await readBody(event);

      let desireData = {
        title: body.title,
        image: body.image,
        timeDays: Number(body.timeDays),
        timeHours: Number(body.timeHours),
        timeMinutes: Number(body.timeMinutes),
        tools: body.tools,
      };

      const totalTime =
        desireData.timeDays * 24 * 60 +
        desireData.timeHours * 60 +
        desireData.timeMinutes;
      const totalProbability = desireData.tools.reduce(
        (sum, tool) => sum + Number(tool.probability),
        0,
      );

      if (totalTime === 0 || totalProbability >= 100) {
        desireData.timeDays = 0;
        desireData.timeHours = 0;
        desireData.timeMinutes = 0;
        desireData.tools = desireData.tools.map((tool) => ({
          ...tool,
          probability: 0,
        }));
      }

      const desire = await prisma.desire.update({
        where: { id },
        data: desireData,
      });
      return desire;
    } catch (error) {
      console.error('Error updating desire:', error);
      return createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
  }

  if (method === 'DELETE') {
    await prisma.desire.delete({
      where: { id },
    });
    return { success: true };
  }
});
