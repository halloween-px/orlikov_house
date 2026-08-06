export type LeadSubmitInput = {
  name: string;
  phone: string;
  comment?: string;
  source: string;
  website?: string;
  challenge: string;
};

export type LeadSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function fetchLeadChallenge() {
  const response = await fetch("/api/lead/challenge", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Не удалось подготовить форму");
  }

  const data = (await response.json()) as { challenge?: string };
  if (!data.challenge) {
    throw new Error("Не удалось подготовить форму");
  }

  return data.challenge;
}

export async function submitLead(
  input: LeadSubmitInput,
): Promise<LeadSubmitResult> {
  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        phone: input.phone,
        comment: input.comment || "",
        source: input.source,
        website: input.website || "",
        challenge: input.challenge,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || "Не удалось отправить заявку",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Не удалось отправить заявку. Проверьте соединение.",
    };
  }
}
