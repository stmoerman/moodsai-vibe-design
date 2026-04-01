import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface MoodsTransactionalProps {
  previewText?: string;
  heading: string;
  body: string;
  footerText?: string;
}

export default function MoodsTransactional({
  previewText,
  heading,
  body,
  footerText = 'Moods.ai — Mentale gezondheid, slim geregeld.',
}: MoodsTransactionalProps) {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Logo / brand */}
          <Section style={styles.logoSection}>
            <Text style={styles.logoText}>Moods.ai</Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Content */}
          <Section style={styles.content}>
            <Heading style={styles.heading}>{heading}</Heading>
            <Text style={styles.bodyText}>{body}</Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>{footerText}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#eeeae3',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    margin: '0',
    padding: '40px 0',
  },
  container: {
    backgroundColor: '#faf8f5',
    border: '1px solid #d0cdc6',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '40px 32px',
  },
  logoSection: {
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  logoText: {
    fontFamily: "'Georgia', serif",
    fontSize: '20px',
    fontWeight: '300' as const,
    color: '#3a3a3a',
    letterSpacing: '-0.02em',
    margin: '0',
  },
  hr: {
    borderColor: '#d0cdc6',
    borderTop: '1px solid #d0cdc6',
    margin: '24px 0',
  },
  content: {
    padding: '0',
  },
  heading: {
    fontFamily: "'Georgia', serif",
    fontSize: '22px',
    fontWeight: '400' as const,
    color: '#3a3a3a',
    margin: '0 0 16px 0',
  },
  bodyText: {
    fontFamily: "'Georgia', serif",
    fontSize: '15px',
    color: '#3a3a3a',
    lineHeight: '1.6',
    margin: '0',
  },
  footer: {
    textAlign: 'center' as const,
  },
  footerText: {
    fontFamily: "'Courier New', monospace",
    fontSize: '11px',
    color: '#b0a99f',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    margin: '0',
  },
};
