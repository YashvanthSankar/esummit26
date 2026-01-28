import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface ESummitMailProps {
  recipientName?: string;
}

export const ESummitMail = ({ recipientName = "Fellow Innovator" }: ESummitMailProps) => {
  const baseUrl = "https://esummit26-iiitdm.vercel.app";
  const unstopUrl = "https://unstop.com/college-fests/e-summit-2026-indian-institute-of-information-technology-design-and-manufacturing-iiitdm-kancheepuram-431947";

  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          /* Force light mode colors */
          * { color-scheme: light !important; }
          body { background-color: #F9F7F2 !important; }
          
          /* Logo switching for dark mode */
          .logo-light { display: inline-block !important; }
          .logo-dark { display: none !important; }
          
          @media (prefers-color-scheme: dark) {
            * { color-scheme: light !important; }
            body { background-color: #F9F7F2 !important; }
            .logo-light { display: none !important; }
            .logo-dark { display: inline-block !important; }
          }
          @media only screen and (max-width: 600px) {
            .mobile-full-width { width: 100% !important; }
            .mobile-padding { padding: 32px 20px !important; }
            .mobile-text-small { font-size: 14px !important; }
            .mobile-heading { font-size: 32px !important; }
            .mobile-hide { display: none !important; }
            .mobile-center { text-align: center !important; }
          }
        `}</style>
      </Head>
      <Preview>E-Summit &apos;26 — An Invitation to Shape the Future | ₹2,00,000+ Prize Pool | January 30 - February 1</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Elegant Header */}
          <Section style={header}>
            <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ margin: 0, padding: 0 }}>
              <tbody>
                <tr>
                  <td align="left" valign="top" style={{ width: "50%", verticalAlign: "top" }}>
                    {/* Black logo for light mode */}
                    <Img
                      className="logo-light"
                      src={`${baseUrl}/esummit-black.png`}
                      alt="E-Summit '26"
                      height="42"
                      style={{ display: "inline-block", verticalAlign: "top" }}
                    />
                    {/* White logo for dark mode */}
                    <Img
                      className="logo-dark"
                      src={`${baseUrl}/esummit26-logo.png`}
                      alt="E-Summit '26"
                      height="42"
                      style={{ display: "none", verticalAlign: "top" }}
                    />
                  </td>
                  <td align="right" valign="top" style={{ width: "50%", verticalAlign: "top" }}>
                    {/* Black logo for light mode */}
                    <Img
                      className="logo-light"
                      src={`${baseUrl}/ecell-black.png`}
                      alt="E-Cell"
                      height="57"
                      width="57"
                      style={{ display: "inline-block", verticalAlign: "top" }}
                    />
                    {/* White logo for dark mode */}
                    <Img
                      className="logo-dark"
                      src={`${baseUrl}/ecell.png`}
                      alt="E-Cell"
                      height="57"
                      width="57"
                      style={{ display: "none", verticalAlign: "top" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Hero Section - Editorial Style */}
          <Section style={heroSection}>
            <Section style={heroCard}>
              {/* Elegant Badge */}
              <Section style={heroBadgeSection}>
                <Text style={heroBadge}>JANUARY 30 - FEBRUARY 1, 2026</Text>
              </Section>

              {/* Hero Title - Serif Typography */}
              <Text style={heroTitle}>
                An Invitation to<br />
                Shape the Future
              </Text>

              <Text style={heroSubtitle}>
                South India&apos;s Most Distinguished Entrepreneurship Summit
              </Text>

              {/* Elegant Divider */}
              <Section style={divider} />

              {/* Refined Stats */}
              <Row>
                <Column style={statColumn}>
                  <Text style={statNumber}>500+</Text>
                  <Text style={statLabel}>Innovators</Text>
                </Column>
                <Column style={statDivider} />
                <Column style={statColumn}>
                  <Text style={statNumber}>₹2L+</Text>
                  <Text style={statLabel}>Prize Pool</Text>
                </Column>
                <Column style={statDivider} />
                <Column style={statColumn}>
                  <Text style={statNumber}>10+</Text>
                  <Text style={statLabel}>Competitions</Text>
                </Column>
              </Row>

              <Section style={divider} />

              {/* Primary CTA - Pill Button */}
              <Section style={{ textAlign: "center" as const, marginTop: "40px" }}>
                <Link href={unstopUrl} style={primaryButton}>
                  Reserve Your Place
                </Link>
              </Section>

              {/* Trust Line */}
              <Text style={trustLine}>
                Complimentary Entry • Certification Provided • Limited Availability
              </Text>
            </Section>
          </Section>

          {/* Personal Greeting */}
          <Section style={greetingSection}>
            <Text style={greeting}>Dear {recipientName},</Text>
            
            <Text style={bodyParagraph}>
              What separates a fleeting idea from a transformative venture? Often, it&apos;s a single moment—a conversation, a challenge, a connection that shifts everything.
            </Text>

            <Text style={bodyParagraph}>
              <span style={emphasis}>E-Summit &apos;26</span> is designed to create those moments. Over three days, you&apos;ll engage with ISRO&apos;s visionaries, pitch to venture capitalists actively seeking the next breakthrough, and compete for ₹2,00,000+ in funding that could launch your vision into reality.
            </Text>

            <Text style={bodyParagraph}>
              This isn&apos;t merely an event. It&apos;s an inflection point.
            </Text>
          </Section>

          {/* Value Proposition - Elegant Grid */}
          <Section style={valueSection}>
            <Text style={sectionLabel}>WHY THIS MATTERS</Text>
            <Text style={sectionHeading}>What Awaits You</Text>

            <Row style={{ marginTop: "48px" }}>
              <Column style={valueCard}>
                <Text style={valueIcon}>💰</Text>
                <Text style={valueTitle}>Substantial Capital</Text>
                <Text style={valueText}>
                  ₹2,00,000+ in prize funding distributed across competitions. Real capital to fuel real ambitions.
                </Text>
              </Column>
              <Column style={{ width: "24px" }} />
              <Column style={valueCard}>
                <Text style={valueIcon}>🎯</Text>
                <Text style={valueTitle}>Investor Access</Text>
                <Text style={valueText}>
                  Direct pathways to venture capitalists and angel investors seeking early-stage opportunities.
                </Text>
              </Column>
            </Row>

            <Row style={{ marginTop: "24px" }}>
              <Column style={valueCard}>
                <Text style={valueIcon}>🚀</Text>
                <Text style={valueTitle}>Masterful Guidance</Text>
                <Text style={valueText}>
                  Learn from ISRO&apos;s &#34;Moon Man&#34; and founders who&apos;ve built ventures from concept to scale.
                </Text>
              </Column>
              <Column style={{ width: "24px" }} />
              <Column style={valueCard}>
                <Text style={valueIcon}>🤝</Text>
                <Text style={valueTitle}>Meaningful Networks</Text>
                <Text style={valueText}>
                  Curated connections with 500+ founders, technologists, and future collaborators.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Prize Showcase - Sophisticated */}
          <Section style={prizeSection}>
            <Section style={prizeCard}>
              <Text style={prizeLabel}>TOTAL PRIZE POOL</Text>
              <Text style={prizeAmount}>₹2,00,000+</Text>
              <Text style={prizeDescription}>
                Distributed across flagship competitions with immediate disbursement
              </Text>

              <Row style={{ marginTop: "40px" }}>
                <Column style={prizeBreakdown}>
                  <Text style={prizeBreakdownAmount}>₹30,000</Text>
                  <Text style={prizeBreakdownLabel}>Pitch Perfect</Text>
                </Column>
                <Column style={prizeBreakdown}>
                  <Text style={prizeBreakdownAmount}>₹30,000</Text>
                  <Text style={prizeBreakdownLabel}>MUN G20 Summit</Text>
                </Column>
                <Column style={prizeBreakdown}>
                  <Text style={prizeBreakdownAmount}>₹24,000</Text>
                  <Text style={prizeBreakdownLabel}>Ideathon</Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* Competitions - Editorial Cards */}
          <Section style={competitionsSection}>
            <Text style={sectionLabel}>FEATURED COMPETITIONS</Text>
            <Text style={sectionHeading}>Select Your Challenge</Text>

            {/* Competition Card 1 */}
            <Section style={competitionCard}>
              <Row>
                <Column style={competitionContent}>
                  <Text style={competitionName}>Pitch Perfect</Text>
                  <Text style={competitionDescription}>
                    Present your venture to seasoned investors and industry leaders. Receive capital, guidance, and validation for your vision.
                  </Text>
                </Column>
                <Column style={competitionPrize}>
                  <Text style={competitionPrizeAmount}>₹30,000</Text>
                  <Text style={competitionPrizeBreakdown}>₹15K • ₹10K • ₹5K</Text>
                </Column>
              </Row>
              <Section style={competitionCta}>
                <Link href={unstopUrl} style={secondaryButton}>
                  Register for This Event
                </Link>
              </Section>
            </Section>

            {/* Competition Card 2 */}
            <Section style={competitionCard}>
              <Row>
                <Column style={competitionContent}>
                  <Text style={competitionName}>MUN — G20 Summit</Text>
                  <Text style={competitionDescription}>
                    Engage in high-level diplomatic discourse. Debate global challenges and shape policy narratives on the world stage.
                  </Text>
                </Column>
                <Column style={competitionPrize}>
                  <Text style={competitionPrizeAmount}>₹30,000</Text>
                  <Text style={competitionPrizeBreakdown}>Best Delegates</Text>
                </Column>
              </Row>
              <Section style={competitionCta}>
                <Link href={unstopUrl} style={secondaryButton}>
                  Register for This Event
                </Link>
              </Section>
            </Section>

            {/* Competition Card 3 */}
            <Section style={competitionCard}>
              <Row>
                <Column style={competitionContent}>
                  <Text style={competitionName}>Ideathon</Text>
                  <Text style={competitionDescription}>
                    48-hour innovation sprint. Transform concepts into working prototypes. Solve pressing challenges with creative solutions.
                  </Text>
                </Column>
                <Column style={competitionPrize}>
                  <Text style={competitionPrizeAmount}>₹24,000</Text>
                  <Text style={competitionPrizeBreakdown}>Three Winners</Text>
                </Column>
              </Row>
              <Section style={competitionCta}>
                <Link href={unstopUrl} style={secondaryButton}>
                  Register for This Event
                </Link>
              </Section>
            </Section>

            {/* Competition Card 4 */}
            <Section style={competitionCard}>
              <Row>
                <Column style={competitionContent}>
                  <Text style={competitionName}>IPL Auction</Text>
                  <Text style={competitionDescription}>
                    Strategic resource allocation meets competitive analytics. Build your ideal team through calculated bidding and foresight.
                  </Text>
                </Column>
                <Column style={competitionPrize}>
                  <Text style={competitionPrizeAmount}>₹12,000</Text>
                  <Text style={competitionPrizeBreakdown}>₹4K × 3</Text>
                </Column>
              </Row>
              <Section style={competitionCta}>
                <Link href={unstopUrl} style={secondaryButton}>
                  Register for This Event
                </Link>
              </Section>
            </Section>
          </Section>

          {/* Speakers - Distinguished */}
          <Section style={speakersSection}>
            <Text style={sectionLabel}>KEYNOTE SPEAKERS</Text>
            <Text style={sectionHeading}>Learn from Architects of Innovation</Text>

            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: "100%", marginTop: "48px" }}>
              <tbody>
                <tr>
                  <td style={{ width: "33.33%", padding: "16px", textAlign: "center" as const, verticalAlign: "top" }}>
                    <Img
                      src={`${baseUrl}/speakers/mylswamy.webp`}
                      alt="Dr. Mylswamy Annadurai"
                      width="96"
                      height="96"
                      style={speakerImage}
                    />
                    <Text style={speakerName}>Dr. Mylswamy Annadurai</Text>
                    <Text style={speakerTitle}>The Moon Man of India</Text>
                    <Text style={speakerOrg}>Former Director, ISRO</Text>
                  </td>
                  <td style={{ width: "33.33%", padding: "16px", textAlign: "center" as const, verticalAlign: "top" }}>
                    <Img
                      src={`${baseUrl}/speakers/suresh.webp`}
                      alt="Suresh Narasimha"
                      width="96"
                      height="96"
                      style={speakerImage}
                    />
                    <Text style={speakerName}>Suresh Narasimha</Text>
                    <Text style={speakerTitle}>Founder & Investor</Text>
                    <Text style={speakerOrg}>CoCreate Ventures</Text>
                  </td>
                  <td style={{ width: "33.33%", padding: "16px", textAlign: "center" as const, verticalAlign: "top" }}>
                    <Img
                      src={`${baseUrl}/speakers/nagaraja.webp`}
                      alt="Nagaraja Prakasam"
                      width="96"
                      height="96"
                      style={speakerImage}
                    />
                    <Text style={speakerName}>Nagaraja Prakasam</Text>
                    <Text style={speakerTitle}>Angel Investor</Text>
                    <Text style={speakerOrg}>Strategic Advisor</Text>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "33.33%", padding: "16px", textAlign: "center" as const, verticalAlign: "top" }}>
                    <Img
                      src={`${baseUrl}/speakers/arunabh.webp`}
                      alt="Arunabh Parihar"
                      width="96"
                      height="96"
                      style={speakerImage}
                    />
                    <Text style={speakerName}>Arunabh Parihar</Text>
                    <Text style={speakerTitle}>Co-Founder</Text>
                    <Text style={speakerOrg}>Zoop Money</Text>
                  </td>
                  <td style={{ width: "33.33%", padding: "16px", textAlign: "center" as const, verticalAlign: "top" }}>
                    <Img
                      src={`${baseUrl}/speakers/harsha.webp`}
                      alt="Harsha Vardhan"
                      width="96"
                      height="96"
                      style={speakerImage}
                    />
                    <Text style={speakerName}>Harsha Vardhan</Text>
                    <Text style={speakerTitle}>Founder & CEO</Text>
                    <Text style={speakerOrg}>Codedale</Text>
                  </td>
                  <td style={{ width: "33.33%", padding: "16px" }}></td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Urgency - Refined */}
          <Section style={urgencySection}>
            <Section style={urgencyCard}>
              <Text style={urgencyLabel}>TIME-SENSITIVE</Text>
              <Text style={urgencyTitle}>Register Now</Text>
              <Text style={urgencyText}>
                Capacity is intentionally limited to ensure meaningful interactions. Reserve your place today before registration closes permanently.
              </Text>
              
              <Section style={{ textAlign: "center" as const, marginTop: "32px" }}>
                <Link href={unstopUrl} style={secondaryButton}>
                  Secure Your Spot
                </Link>
              </Section>
            </Section>
          </Section>

          {/* Sponsors - Subtle */}
          <Section style={sponsorsSection}>
            <Text style={sponsorsLabel}>SUPPORTED BY INDUSTRY PARTNERS</Text>
            
            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ width: "100%", marginTop: "32px" }}>
              <tbody>
                <tr>
                  <td style={{ width: "33.33%", padding: "12px" }}>
                    <Section style={sponsorBox}>
                      <Img src={`${baseUrl}/sponsors/unstop.png`} alt="Unstop" height="36" style={sponsorLogo} />
                    </Section>
                  </td>
                  <td style={{ width: "33.33%", padding: "12px" }}>
                    <Section style={sponsorBox}>
                      <Img src={`${baseUrl}/sponsors/stockgro.png`} alt="StockGro" height="36" style={sponsorLogo} />
                    </Section>
                  </td>
                  <td style={{ width: "33.33%", padding: "12px" }}>
                    <Section style={sponsorBox}>
                      <Img src={`${baseUrl}/sponsors/gfg.png`} alt="GeeksforGeeks" height="36" style={sponsorLogo} />
                    </Section>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "33.33%", padding: "12px" }}>
                    <Section style={sponsorBox}>
                      <Img src={`${baseUrl}/sponsors/startupnewsfyi.png`} alt="StartupNews.fyi" height="36" style={sponsorLogo} />
                    </Section>
                  </td>
                  <td style={{ width: "33.33%", padding: "12px" }}>
                    <Section style={sponsorBox}>
                      <Img src={`${baseUrl}/sponsors/2iim.png`} alt="2IIM" height="36" style={sponsorLogo} />
                    </Section>
                  </td>
                  <td style={{ width: "33.33%", padding: "12px" }}>
                    <Section style={sponsorBox}>
                      <Img src={`${baseUrl}/sponsors/rikun.png`} alt="RiKun" height="36" style={sponsorLogo} />
                    </Section>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Final CTA - Elegant */}
          <Section style={finalSection}>
            <Section style={finalCard}>
              <Text style={finalTitle}>Your Journey Begins Here</Text>
              <Text style={finalText}>
                This is your invitation to join South India&apos;s most distinguished gathering of entrepreneurs, innovators, and visionaries. Reserve your place among the 500 who will shape what comes next.
              </Text>
              <Section style={{ textAlign: "center" as const, marginTop: "40px" }}>
                <Link href={unstopUrl} style={primaryButton}>
                  Confirm Your Attendance
                </Link>
              </Section>
              <Text style={finalFootnote}>
                Complimentary Entry • January 30 - February 1, 2026
              </Text>
            </Section>
          </Section>

          {/* Footer - Minimal & Elegant */}
          <Section style={footer}>
            <table cellPadding="0" cellSpacing="0" role="presentation" style={{ margin: "0 auto 32px auto" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "0 12px" }}>
                    <Img src={`${baseUrl}/ecell-black.png`} alt="E-Cell IIITDM" height="52" style={{ opacity: 0.7, display: "block" }} />
                  </td>
                  <td style={{ padding: "0 12px" }}>
                    <Img src={`${baseUrl}/iiitdm.png`} alt="IIITDM" height="52" style={{ opacity: 0.7, display: "block" }} />
                  </td>
                </tr>
              </tbody>
            </table>

            <Text style={footerBrand}>E-Cell IIITDM</Text>
            <Text style={footerInstitution}>Indian Institute of Information Technology Design & Manufacturing</Text>
            <Text style={footerLocation}>Kancheepuram, Chennai</Text>

            <Section style={footerDivider} />

            <Section style={{ textAlign: "center" as const, marginBottom: "32px" }}>
              <Link href="https://instagram.com/ecell_iiitdm" style={{ margin: "0 12px" }}>
                <Img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="28" height="28" style={{ display: "inline-block" }} />
              </Link>
              <Link href="https://linkedin.com/company/ecelliiitdm" style={{ margin: "0 12px" }}>
                <Img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="28" height="28" style={{ display: "inline-block" }} />
              </Link>
              <Link href="https://twitter.com/ecell_iiitdm" style={{ margin: "0 12px" }}>
                <Img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="28" height="28" style={{ display: "inline-block" }} />
              </Link>
              <Link href={baseUrl} style={{ margin: "0 12px" }}>
                <Img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="Website" width="28" height="28" style={{ display: "inline-block" }} />
              </Link>
            </Section>

            <Text style={footerContact}>
              ecell@iiitdm.ac.in • esummit26-iiitdm.vercel.app
            </Text>

            <Text style={footerAddress}>
              IIITDM Kancheepuram, Chennai - 600127, Tamil Nadu, India
            </Text>

            <Section style={footerDivider} />

            <Text style={footerLinks}>
              <Link href={`${baseUrl}/privacy`} style={footerLink}>Privacy Policy</Link>
              {" • "}
              <Link href={`${baseUrl}/terms`} style={footerLink}>Terms of Service</Link>
            </Text>

            <Text style={footerCopyright}>
              © 2026 E-Summit IIITDM Kancheepuram. All Rights Reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ESummitMail;

// ════════════════════════════════════════════════════════════════════════════
// CREAM & LUXE DESIGN SYSTEM - WARM MINIMALISM
// ════════════════════════════════════════════════════════════════════════════

const COLORS = {
  // Backgrounds
  cream: "#F9F7F2",           // Alabaster Cream
  white: "#FFFFFF",           // Pure White
  
  // Typography
  espresso: "#2C2420",        // Dark Espresso
  taupe: "#6B605B",           // Warm Taupe
  
  // Accents
  terracotta: "#C76D50",      // Burnt Sienna
  sage: "#A6A292",            // Sage Grey
  gold: "#D4AF37",            // Muted Gold
  
  // Borders & Dividers
  border: "#EBE5DE",          // Warm Border
  borderLight: "#F3EFE9",     // Very Light Border
};

// ════════════════════════════════════════════════════════════════════════════
// STYLES - EDITORIAL LUXURY
// ════════════════════════════════════════════════════════════════════════════

const main: React.CSSProperties = {
  backgroundColor: COLORS.cream,
  backgroundImage: `
    radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(199, 109, 80, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 40% 70%, rgba(166, 162, 146, 0.05) 0%, transparent 40%)
  `,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  padding: "40px 16px",
};

const container: React.CSSProperties = {
  maxWidth: "680px",
  width: "100%",
  margin: "0 auto",
  backgroundColor: COLORS.white,
  backgroundImage: `
    linear-gradient(135deg, rgba(249, 247, 242, 0.3) 0%, transparent 100%),
    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(235, 229, 222, 0.1) 35px, rgba(235, 229, 222, 0.1) 70px)
  `,
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: `
    0 10px 40px -10px rgba(45, 36, 36, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 0 0 1px rgba(212, 175, 55, 0.15),
    0 0 60px -15px rgba(199, 109, 80, 0.1)
  `,
  border: "2px solid rgba(255, 255, 255, 0.6)",
};

// Header
const header: React.CSSProperties = {
  padding: "48px 56px 32px",
  borderBottom: `1px solid ${COLORS.borderLight}`,
};

// Hero Section
const heroSection: React.CSSProperties = {
  padding: "64px 56px",
  textAlign: "center" as const,
};

const heroCard: React.CSSProperties = {
  maxWidth: "520px",
  margin: "0 auto",
};

const heroBadgeSection: React.CSSProperties = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const heroBadge: React.CSSProperties = {
  display: "inline-block",
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "2px",
  color: COLORS.taupe,
  textTransform: "uppercase" as const,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "999px",
  padding: "10px 24px",
};

const heroTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "42px",
  fontWeight: 700,
  color: COLORS.espresso,
  lineHeight: 1.2,
  marginBottom: "20px",
  letterSpacing: "-0.5px",
};

const heroSubtitle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "17px",
  fontWeight: 400,
  color: COLORS.taupe,
  lineHeight: 1.6,
  marginBottom: "40px",
};

const divider: React.CSSProperties = {
  width: "80px",
  height: "1px",
  backgroundColor: COLORS.border,
  margin: "40px auto",
};

const statColumn: React.CSSProperties = {
  textAlign: "center" as const,
};

const statNumber: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "36px",
  fontWeight: 700,
  color: COLORS.espresso,
  marginBottom: "8px",
  margin: "0 0 8px 0",
};

const statLabel: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  color: COLORS.taupe,
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
  margin: 0,
};

const statDivider: React.CSSProperties = {
  width: "1px",
  backgroundColor: COLORS.borderLight,
};

const primaryButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: COLORS.terracotta,
  color: COLORS.white,
  fontFamily: "'Inter', sans-serif",
  fontSize: "15px",
  fontWeight: 600,
  textDecoration: "none",
  padding: "16px 40px",
  borderRadius: "999px",
  letterSpacing: "0.3px",
  boxShadow: "0 4px 16px rgba(199, 109, 80, 0.2)",
  minWidth: "200px",
  textAlign: "center" as const,
};

const secondaryButton: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "transparent",
  color: COLORS.terracotta,
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  padding: "12px 32px",
  borderRadius: "999px",
  border: `1.5px solid ${COLORS.terracotta}`,
  letterSpacing: "0.3px",
};

const trustLine: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  color: COLORS.taupe,
  textAlign: "center" as const,
  marginTop: "24px",
  letterSpacing: "0.3px",
};

// Greeting Section
const greetingSection: React.CSSProperties = {
  padding: "64px 80px",
  backgroundColor: COLORS.cream,
};

const greeting: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "32px",
  fontWeight: 600,
  color: COLORS.espresso,
  marginBottom: "32px",
};

const bodyParagraph: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "16px",
  fontWeight: 400,
  color: COLORS.taupe,
  lineHeight: 1.8,
  marginBottom: "24px",
};

const emphasis: React.CSSProperties = {
  color: COLORS.espresso,
  fontWeight: 600,
};

// Value Section
const valueSection: React.CSSProperties = {
  padding: "56px 32px",
  textAlign: "center" as const,
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "2px",
  color: COLORS.sage,
  textTransform: "uppercase" as const,
  marginBottom: "16px",
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "36px",
  fontWeight: 700,
  color: COLORS.espresso,
  marginBottom: "24px",
  lineHeight: 1.3,
};

const valueCard: React.CSSProperties = {
  backgroundColor: COLORS.cream,
  borderRadius: "16px",
  padding: "40px 32px",
  textAlign: "center" as const,
};

const valueIcon: React.CSSProperties = {
  fontSize: "40px",
  marginBottom: "20px",
  margin: "0 0 20px 0",
};

const valueTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "20px",
  fontWeight: 600,
  color: COLORS.espresso,
  marginBottom: "12px",
  margin: "0 0 12px 0",
};

const valueText: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  fontWeight: 400,
  color: COLORS.taupe,
  lineHeight: 1.7,
  margin: 0,
};

// Prize Section
const prizeSection: React.CSSProperties = {
  padding: "56px 32px",
  backgroundColor: COLORS.cream,
};

const prizeCard: React.CSSProperties = {
  backgroundColor: COLORS.espresso,
  borderRadius: "20px",
  padding: "64px 48px",
  textAlign: "center" as const,
};

const prizeLabel: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "2px",
  color: COLORS.sage,
  textTransform: "uppercase" as const,
  marginBottom: "16px",
};

const prizeAmount: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "72px",
  fontWeight: 700,
  color: COLORS.white,
  marginBottom: "24px",
  letterSpacing: "-2px",
  lineHeight: 1.2,
};

const prizeDescription: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "15px",
  fontWeight: 400,
  color: "rgba(255, 255, 255, 0.8)",
  lineHeight: 1.6,
};

const prizeBreakdown: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  borderRadius: "12px",
  padding: "24px 16px",
  textAlign: "center" as const,
};

const prizeBreakdownAmount: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "24px",
  fontWeight: 700,
  color: COLORS.white,
  marginBottom: "8px",
  margin: "0 0 8px 0",
};

const prizeBreakdownLabel: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  color: "rgba(255, 255, 255, 0.7)",
  letterSpacing: "0.5px",
  margin: 0,
};

// Competitions Section
const competitionsSection: React.CSSProperties = {
  padding: "56px 32px",
  textAlign: "center" as const,
};

const competitionCard: React.CSSProperties = {
  backgroundColor: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "16px",
  marginTop: "24px",
  overflow: "hidden",
};

const competitionContent: React.CSSProperties = {
  padding: "32px",
};

const competitionName: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "24px",
  fontWeight: 600,
  color: COLORS.espresso,
  marginBottom: "12px",
  margin: "0 0 12px 0",
};

const competitionDescription: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  fontWeight: 400,
  color: COLORS.taupe,
  lineHeight: 1.7,
  margin: 0,
};

const competitionPrize: React.CSSProperties = {
  padding: "32px",
  textAlign: "right" as const,
};

const competitionPrizeAmount: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "32px",
  fontWeight: 700,
  color: COLORS.terracotta,
  marginBottom: "6px",
  margin: "0 0 6px 0",
};

const competitionPrizeBreakdown: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  color: COLORS.taupe,
  margin: 0,
};

const competitionCta: React.CSSProperties = {
  padding: "20px 32px",
  backgroundColor: COLORS.cream,
  borderTop: `1px solid ${COLORS.borderLight}`,
  textAlign: "center" as const,
};

// Speakers Section
const speakersSection: React.CSSProperties = {
  padding: "56px 32px",
  backgroundColor: COLORS.cream,
  textAlign: "center" as const,
};

const speakerCard: React.CSSProperties = {
  textAlign: "center" as const,
};

const speakerImage: React.CSSProperties = {
  borderRadius: "50%",
  border: `3px solid ${COLORS.white}`,
  marginBottom: "20px",
  boxShadow: "0 4px 16px rgba(45, 36, 36, 0.08)",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};

const speakerName: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "16px",
  fontWeight: 600,
  color: COLORS.espresso,
  marginBottom: "6px",
  margin: "0 0 6px 0",
};

const speakerTitle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  color: COLORS.taupe,
  marginBottom: "4px",
  margin: "0 0 4px 0",
};

const speakerOrg: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  color: COLORS.sage,
  margin: 0,
};

// Urgency Section
const urgencySection: React.CSSProperties = {
  padding: "56px 32px",
};

const urgencyCard: React.CSSProperties = {
  backgroundColor: COLORS.cream,
  border: `2px solid ${COLORS.border}`,
  borderRadius: "20px",
  padding: "56px 48px",
  textAlign: "center" as const,
};

const urgencyLabel: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "2px",
  color: COLORS.terracotta,
  textTransform: "uppercase" as const,
  marginBottom: "16px",
};

const urgencyTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "32px",
  fontWeight: 700,
  color: COLORS.espresso,
  marginBottom: "16px",
};

const urgencyText: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "15px",
  fontWeight: 400,
  color: COLORS.taupe,
  lineHeight: 1.7,
};

// Sponsors Section
const sponsorsSection: React.CSSProperties = {
  padding: "56px 32px",
  backgroundColor: COLORS.cream,
  textAlign: "center" as const,
};

const sponsorsLabel: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "2px",
  color: COLORS.sage,
  textTransform: "uppercase" as const,
};

const sponsorBox: React.CSSProperties = {
  backgroundColor: COLORS.white,
  border: `1px solid ${COLORS.borderLight}`,
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center" as const,
  minHeight: "80px",
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const sponsorLogo: React.CSSProperties = {
  opacity: 0.75,
};

// Final Section
const finalSection: React.CSSProperties = {
  padding: "56px 32px",
};

const finalCard: React.CSSProperties = {
  backgroundColor: COLORS.espresso,
  borderRadius: "20px",
  padding: "72px 64px",
  textAlign: "center" as const,
};

const finalTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "44px",
  fontWeight: 700,
  color: COLORS.white,
  marginBottom: "24px",
  lineHeight: 1.3,
};

const finalText: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "17px",
  fontWeight: 400,
  color: "rgba(255, 255, 255, 0.85)",
  lineHeight: 1.8,
  maxWidth: "480px",
  margin: "0 auto 32px auto",
};

const finalFootnote: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  color: "rgba(255, 255, 255, 0.7)",
  margin: "32px 0 0 0",
  letterSpacing: "0.3px",
};

// Footer
const footer: React.CSSProperties = {
  padding: "64px 56px",
  backgroundColor: COLORS.cream,
  textAlign: "center" as const,
  borderTop: `1px solid ${COLORS.borderLight}`,
};

const footerBrand: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "18px",
  fontWeight: 600,
  color: COLORS.espresso,
  marginBottom: "8px",
};

const footerInstitution: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  color: COLORS.taupe,
  marginBottom: "4px",
};

const footerLocation: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  color: COLORS.taupe,
  marginBottom: "32px",
};

const footerDivider: React.CSSProperties = {
  width: "120px",
  height: "1px",
  backgroundColor: COLORS.border,
  margin: "32px auto",
};

const footerContact: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  color: COLORS.taupe,
  marginBottom: "8px",
};

const footerAddress: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "12px",
  fontWeight: 400,
  color: COLORS.sage,
  marginBottom: "32px",
};

const footerLinks: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  color: COLORS.taupe,
  marginBottom: "16px",
};

const footerLink: React.CSSProperties = {
  color: COLORS.terracotta,
  textDecoration: "none",
};

const footerCopyright: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 400,
  color: COLORS.sage,
  letterSpacing: "0.3px",
};