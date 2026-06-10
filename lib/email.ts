type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

type SendEmailResult = {
  sent: boolean;
  error?: string;
};

const resendApiUrl = "https://api.resend.com/emails";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createEmailLayout(title: string, body: string, ctaLabel: string, ctaUrl: string) {
  return `
    <div style="margin:0;padding:32px;background:#09090b;color:#ffffff;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;border:1px solid #c8ff00;background:#141416;padding:32px;">
        <p style="margin:0 0 24px;font-size:28px;letter-spacing:4px;font-weight:700;color:#ffffff;">N'FEST</p>
        <h1 style="margin:0 0 16px;font-size:36px;line-height:1;color:#c8ff00;text-transform:uppercase;">${title}</h1>
        <div style="font-size:16px;line-height:1.6;color:#d7d7c8;">${body}</div>
        <a href="${ctaUrl}" style="display:inline-block;margin-top:28px;background:#c8ff00;color:#09090b;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:16px 22px;">
          ${ctaLabel}
        </a>
        <p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#8f8f84;">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
          <a href="${ctaUrl}" style="color:#c8ff00;">${ctaUrl}</a>
        </p>
      </div>
    </div>
  `;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "N'FEST <onboarding@resend.dev>";

  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY manquant" };
  }

  try {
    const response = await fetch(resendApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      return { sent: false, error: "Envoi Resend refuse" };
    }

    return { sent: true };
  } catch {
    return { sent: false, error: "Envoi Resend impossible" };
  }
}

export function createVerificationEmail(name: string | null, verificationUrl: string) {
  const displayName = escapeHtml(name || "festivalier");

  return createEmailLayout(
    "Verifiez votre email",
    `<p>Bonjour ${displayName},</p><p>Confirmez votre adresse email pour activer votre compte N'FEST. Ce lien est valable pendant 1 heure.</p>`,
    "Verifier mon email",
    verificationUrl,
  );
}

export function createPasswordResetEmail(resetUrl: string) {
  return createEmailLayout(
    "Reinitialisation",
    "<p>Vous avez demande un nouveau mot de passe pour votre compte N'FEST.</p><p>Ce lien est valable pendant 30 minutes.</p>",
    "Changer mon mot de passe",
    resetUrl,
  );
}
