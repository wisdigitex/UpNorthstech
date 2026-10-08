
async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  try {
    if (!supabase) {
      throw new Error("Supabase client is not initialized.");
    }

    // 1. Save the request to Supabase
    const { error: dbError } = await supabase
      .from("project_requests")
      .insert({
        user_id: user?.id ?? null,
        fullname: form.fullname,
        email: form.email,
        service: form.service,
        budget: form.budget,
        timeframe: form.timeframe,
        contract: form.contract,
        details: form.details,
        status: "Pending",
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(
        dbError.message || "Could not save project request."
      );
    }

    // 2. Send the email through your server API
    const response = await fetch("/api/send-message-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "sulaimonganiyu315@gmail.com",
        subject: "New Project Request",
        message: `
New project request received.

Client: ${form.fullname}
Email: ${form.email}
Service: ${form.service}
Budget: ${form.budget}
Timeframe: ${form.timeframe}
Contract: ${form.contract}
Details: ${form.details}
        `,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Email API error:", result);
      throw new Error(
        result.error || "Request saved, but email sending failed."
      );
    }

    alert("Project request sent successfully!");

    setForm({
      fullname: "",
      email: "",
      service: "",
      budget: "",
      timeframe: "",
      contract: "",
      details: "",
    });
  } catch (error) {
    console.error("Project submission error:", error);
    alert(error.message || "Server Error. Please try again.");
  } finally {
    setLoading(false);
  }
}