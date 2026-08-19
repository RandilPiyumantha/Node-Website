export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const shipmentType = formData.get("shipment_type") || "";
    const movement = formData.get("movement") || "";
    const origin = formData.get("origin") || "";
    const destination = formData.get("destination") || "";
    const cargoDescription = formData.get("cargo_description") || "";
    const weightVolume = formData.get("weight_volume") || "";
    const containerType = formData.get("container_type") || "";
    const shippingDate = formData.get("shipping_date") || "";
    const name = formData.get("name") || "";
    const company = formData.get("company") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const additionalDetails = formData.get("additional_details") || "";

    if (!name || !email || !origin || !destination) {
      return Response.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 },
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">
        <h2 style="color:#0B2D63;">
          New Freight Quote Request
        </h2>

        <p>A new quote request has been submitted through the Node Global Logistics website.</p>

        <table style="width:100%; border-collapse:collapse;">

          <tr>
            <td style="padding:8px; font-weight:bold;">Name</td>
            <td style="padding:8px;">${escapeHtml(name)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Company</td>
            <td style="padding:8px;">${escapeHtml(company)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Email</td>
            <td style="padding:8px;">${escapeHtml(email)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Phone / WhatsApp</td>
            <td style="padding:8px;">${escapeHtml(phone)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Shipment Type</td>
            <td style="padding:8px;">${escapeHtml(shipmentType)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Movement</td>
            <td style="padding:8px;">${escapeHtml(movement)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Origin</td>
            <td style="padding:8px;">${escapeHtml(origin)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Destination</td>
            <td style="padding:8px;">${escapeHtml(destination)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Cargo Description</td>
            <td style="padding:8px;">${escapeHtml(cargoDescription)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Weight / Volume</td>
            <td style="padding:8px;">${escapeHtml(weightVolume)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Container Type / Dimensions</td>
            <td style="padding:8px;">${escapeHtml(containerType)}</td>
          </tr>

          <tr>
            <td style="padding:8px; font-weight:bold;">Expected Shipping Date</td>
            <td style="padding:8px;">${escapeHtml(shippingDate)}</td>
          </tr>

        </table>

        <h3 style="color:#0B2D63;">Additional Details</h3>

        <p>${escapeHtml(additionalDetails || "None provided")}</p>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",

      headers: {
        Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        from: "Node Global Website <website@send.nodegloballogistics.com>",

        to: ["sales@nodegloballogistics.com"],

        reply_to: email,

        subject: `New Quote Request: ${origin} → ${destination}`,

        html: emailHtml,
      }),
    });

    const result = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", result);

      return Response.json(
        {
          success: false,
          message: "Unable to send your quote request.",
        },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      message: "Your quote request has been sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
