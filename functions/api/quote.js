export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const data = Object.fromEntries(formData.entries());

    return Response.json({
      success: true,
      message: "Quote request received.",
      data: data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unable to process quote request.",
      },
      {
        status: 400,
      },
    );
  }
}
