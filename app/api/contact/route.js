import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {

  try {

    const body = await req.json();

    const data = await resend.emails.send({

      from: process.env.FROM_EMAIL,

      to: process.env.NOTIFY_EMAIL,

      subject: `New Project Request From ${body.fullname}`,

      html: `
        <div style="font-family:sans-serif;padding:20px">

          <h2>New Project Request</h2>

          <p><strong>Full Name:</strong> ${body.fullname}</p>

          <p><strong>Email:</strong> ${body.email}</p>

          <p><strong>Service:</strong> ${body.service}</p>

          <p><strong>Budget:</strong> ${body.budget}</p>

          <p><strong>Amount:</strong> ${body.amount}</p>

          <p><strong>Timeframe:</strong> ${body.timeframe}</p>

          <p><strong>Contract:</strong> ${body.contract}</p>

          <p><strong>Project Details:</strong></p>

          <p>${body.details}</p>

        </div>
      `,
    });

    return Response.json({
      success: true,
      data,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
      error,
    });

  }

}