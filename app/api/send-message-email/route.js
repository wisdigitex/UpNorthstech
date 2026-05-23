import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req) {

  try {

    const body = await req.json();

    console.log("EMAIL API HIT");

    console.log(body);

    const {
      to,
      subject,
      message,
    } = body;

    const data =
      await resend.emails.send({

        from:
          "UpNorth <onboarding@resend.dev>",

        to,

        subject,

        html: `
          <div>
            <h2>${subject}</h2>
            <p>${message}</p>
          </div>
        `,
      });

        return Response.json({
          success: true,
        });

    console.log(data);

    return Response.json({
      success: true,
      data,
    });

  } catch (error) {

    console.log(error);

    return Response.json(
      {
        success: false,
        error,
      },
      {
        status: 500,
      }
    );

  }

}