export async function onRequestQuote(context) {
  try {
    const formdata = await context.request.formData();
    const data = Object.fromEntries(formdata.entries());
    return Response.json({
      success: true,
      message: "Quote fetched successfully",
      data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch quote",
      },
      {
        status: 400,
      },
    );
  }
}
