import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import MoodsTransactional from '@/emails/MoodsTransactional';

interface SendEmailBody {
  to: string;
  subject: string;
  heading: string;
  body: string;
  previewText?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, heading, body, previewText } =
      (await request.json()) as SendEmailBody;

    if (!to || !subject || !heading || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, heading, body' },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react: MoodsTransactional({ heading, body, previewText }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
