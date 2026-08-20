export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const name = formData.get("name") || "";
    const company = formData.get("company") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const enquiryType = formData.get("enquiry_type") || "";
    const message = formData.get("message") || "";

    // Required fields
    if (!name || !email || !message) {
      return Response.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 },
      );
    }

    const emailHtml = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
      ">

        <h2 style="color:#0B2D63;">
          New Website Contact Enquiry
        </h2>

        <p>
          A new enquiry has been submitted through the
          Node Global Logistics website.
        </p>

        <table
          style="
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          "
        >

          <tr>
            <td style="padding:8px;font-weight:bold;">
              Name
            </td>

            <td style="padding:8px;">
              ${escapeHtml(name)}
            </td>
          </tr>

          <tr>
            <td style="padding:8px;font-weight:bold;">
              Company
            </td>

            <td style="padding:8px;">
              ${escapeHtml(company || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:8px;font-weight:bold;">
              Email
            </td>

            <td style="padding:8px;">
              ${escapeHtml(email)}
            </td>
          </tr>

          <tr>
            <td style="padding:8px;font-weight:bold;">
              Phone / WhatsApp
            </td>

            <td style="padding:8px;">
              ${escapeHtml(phone || "Not provided")}
            </td>
          </tr>

          <tr>
            <td style="padding:8px;font-weight:bold;">
              Enquiry Type
            </td>

            <td style="padding:8px;">
              ${escapeHtml(enquiryType || "General Enquiry")}
            </td>
          </tr>

        </table>

        <h3 style="
          color:#0B2D63;
          margin-top:25px;
        ">
          Message
        </h3>

        <div style="
          padding:15px;
          background:#f5f7fa;
          border-left:4px solid #C79A3B;
          line-height:1.6;
        ">
          ${escapeHtml(message).replace(/\n/g, "<br>")}
        </div>

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

        to: ["info@nodegloballogistics.com"],

        reply_to: email,

        subject: `Website Enquiry: ${enquiryType || "General Enquiry"} - ${name}`,

        html: emailHtml,
      }),
    });

    const result = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend error:", result);

      return Response.json(
        {
          success: false,
          message: "Unable to send your message.",
        },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      message: "Your message has been sent successfully.",
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
