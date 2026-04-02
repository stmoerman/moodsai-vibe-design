import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import MoodsTransactional from '@/emails/MoodsTransactional';

interface InviteBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, location } =
      (await request.json()) as InviteBody;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Voornaam, achternaam en e-mail zijn verplicht' },
        { status: 400 },
      );
    }

    const token = crypto.randomUUID();
    const params = new URLSearchParams({ token, email, name: firstName });
    if (location && location !== 'none') params.set('location', location);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const onboardingUrl = `${baseUrl}/onboarding?${params.toString()}`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Je bent uitgenodigd bij Moods.ai',
      react: MoodsTransactional({
        previewText: 'Welkom bij Moods.ai — maak je account aan',
        heading: `Welkom bij Moods.ai, ${firstName}`,
        body: `Je bent uitgenodigd om een account aan te maken bij Moods.ai. Ga naar de volgende link om te beginnen met je aanmelding:\n\n${onboardingUrl}`,
      }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailId: data?.id, token, onboardingUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Onbekende fout' },
      { status: 500 },
    );
  }
}
