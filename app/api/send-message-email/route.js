
import { Resend } from "resend";

export async function POST(request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "RESEND_API_KEY is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      fullname,
      email,
      service,
      budget,
      timeframe,
      contract,
      details,
    } = body;

    if (
      !fullname ||
      !email ||
      !service ||
      !budget ||
      !timeframe ||
      !contract ||
      !details
    ) {
      return Response.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "UpNorth Tech <onboarding@resend.dev>",
      to: ["sulaimonganiyy3500@gmail.com"],
      replyTo: email,
      subject: `New Project Request: ${service}`,
      text: `
Client: ${fullname}
Email: ${email}
Service: ${service}
Budget: ${budget}
Timeframe: ${timeframe}
Contract: ${contract}

Project details:
${details}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Email provider rejected the message." },
        { status: 502 }
      );
    }

    return Response.json(
      { success: true, id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email route error:", error);
    return Response.json(
      { error: "Unable to send the email." },
      { status: 500 }
    );
  }
}
