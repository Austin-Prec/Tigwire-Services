import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPayload {
  fullName: string;
  organisation?: string;
  email: string;
  phone?: string;
  enquiryType: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: ContactPayload = await req.json();

    if (!body.fullName || !body.email || !body.enquiryType || !body.message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("contact_messages").insert({
      full_name: body.fullName,
      organisation: body.organisation || "",
      email: body.email,
      phone: body.phone || "",
      enquiry_type: body.enquiryType,
      message: body.message,
    });

    if (dbError) {
      return new Response(JSON.stringify({ error: "Failed to save message" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #152A4A; font-family: Georgia, serif;">New Contact Enquiry</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; font-weight: 600; color: #152A4A; width: 140px;">Full Name</td><td style="padding: 8px 0;">${body.fullName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #152A4A;">Organisation</td><td style="padding: 8px 0;">${body.organisation || "Not provided"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #152A4A;">Email</td><td style="padding: 8px 0;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #152A4A;">Phone</td><td style="padding: 8px 0;">${body.phone || "Not provided"}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600; color: #152A4A;">Enquiry Type</td><td style="padding: 8px 0;">${body.enquiryType}</td></tr>
          </table>
          <h3 style="color: #152A4A; font-family: Georgia, serif; margin-top: 24px;">Message</h3>
          <p style="font-size: 14px; line-height: 1.7; color: #333; white-space: pre-wrap;">${body.message}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
          <p style="font-size: 12px; color: #888;">Submitted via Tigwire Services contact form</p>
        </div>
      `;

      // TODO: this pathway is not currently called by the frontend (the
      // live contact form in ContactForm.tsx posts to Formspree instead —
      // see its own TODO for that endpoint). If you decide to use this
      // Supabase-based pathway instead, set RESEND_API_KEY as a function
      // secret and update the "to" address below to Tigwire's real inbox.
      // rachealkamaseko7@gmail.com is used here only because it's the
      // contact email on file; confirm it's the right delivery inbox
      // before relying on this in production.
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Tigwire Services <onboarding@resend.dev>",
          to: ["rachealkamaseko7@gmail.com"],
          subject: `New Enquiry: ${body.enquiryType} — ${body.fullName}`,
          html: emailHtml,
          reply_to: body.email,
        }),
      });

      if (!resendResponse.ok) {
        const errText = await resendResponse.text();
        console.error("Resend error:", errText);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Contact function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
