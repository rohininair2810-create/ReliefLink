import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  Users,
  Heart,
  CheckCircle,
  ArrowRight,
  Zap,
  Eye,
  Globe,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Bell,
  TrendingUp,
  Truck,
  ClipboardList,
  Search,
  UserCheck,
} from "lucide-react";

// ─── Fonts injected via style tag ───────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; }
    h1,h2,h3,h4,h5,h6,.font-manrope { font-family: 'Manrope', sans-serif; }
    html { scroll-behavior: smooth; }
    .portal-card:hover .portal-arrow { transform: translateX(4px); }
    .step-connector { background: linear-gradient(90deg, #197C78, #E5A04B); }
  `}</style>
);

// ─── Color constants ─────────────────────────────────────────────────────────
const C = {
  navyPrimary: "#172D40",
  navySecondary: "#24465C",
  teal: "#197C78",
  amber: "#E5A04B",
  red: "#D94B45",
  bg: "#F4F6F8",
  text: "#263238",
  textSecondary: "#718096",
  white: "#FFFFFF",
};

// ─── SVG Hero Illustration ───────────────────────────────────────────────────
const HeroIllustration = () => (
  <svg
    viewBox="0 0 480 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-lg mx-auto"
    aria-label="Disaster relief coordination illustration"
  >
    {/* Background shapes */}
    <circle cx="240" cy="160" r="130" fill="#24465C" fillOpacity="0.5" />
    <circle cx="240" cy="160" r="90" fill="#24465C" fillOpacity="0.4" />

    {/* Map pin – centre */}
    <circle cx="240" cy="155" r="28" fill="#197C78" />
    <path
      d="M240 135C228.954 135 220 143.954 220 155C220 169.5 240 187 240 187C240 187 260 169.5 260 155C260 143.954 251.046 135 240 135Z"
      fill="#197C78"
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="240" cy="155" r="6" fill="white" />

    {/* Connecting lines */}
    <line x1="135" y1="100" x2="218" y2="148" stroke="#E5A04B" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="345" y1="100" x2="262" y2="148" stroke="#E5A04B" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="135" y1="220" x2="218" y2="168" stroke="#197C78" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="345" y1="220" x2="262" y2="168" stroke="#197C78" strokeWidth="1.5" strokeDasharray="4 3" />

    {/* Person node – top left (Victim) */}
    <circle cx="118" cy="90" r="30" fill="#D94B45" fillOpacity="0.15" />
    <circle cx="118" cy="82" r="10" fill="#D94B45" />
    <path d="M100 110 Q118 100 136 110" stroke="#D94B45" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <text x="118" y="130" textAnchor="middle" fill="#D94B45" fontSize="10" fontFamily="Inter" fontWeight="600">VICTIM</text>

    {/* Person node – top right (Authority) */}
    <circle cx="362" cy="90" r="30" fill="#172D40" fillOpacity="0.3" />
    <circle cx="362" cy="82" r="10" fill="#24465C" />
    <path d="M344 110 Q362 100 380 110" stroke="#24465C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <text x="362" y="130" textAnchor="middle" fill="white" fontSize="9" fontFamily="Inter" fontWeight="600">AUTHORITY</text>

    {/* Person node – bottom left (Volunteer) */}
    <circle cx="118" cy="230" r="30" fill="#197C78" fillOpacity="0.15" />
    <circle cx="118" cy="222" r="10" fill="#197C78" />
    <path d="M100 250 Q118 240 136 250" stroke="#197C78" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <text x="118" y="270" textAnchor="middle" fill="#197C78" fontSize="9" fontFamily="Inter" fontWeight="600">VOLUNTEER</text>

    {/* Person node – bottom right (Donor) */}
    <circle cx="362" cy="230" r="30" fill="#E5A04B" fillOpacity="0.15" />
    <circle cx="362" cy="222" r="10" fill="#E5A04B" />
    <path d="M344 250 Q362 240 380 250" stroke="#E5A04B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <text x="362" y="270" textAnchor="middle" fill="#E5A04B" fontSize="10" fontFamily="Inter" fontWeight="600">DONOR</text>

    {/* Signal rings around centre */}
    <circle cx="240" cy="155" r="48" stroke="white" strokeOpacity="0.1" strokeWidth="1" fill="none" />
    <circle cx="240" cy="155" r="65" stroke="white" strokeOpacity="0.07" strokeWidth="1" fill="none" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Portal cards data ────────────────────────────────────────────────────
  const portals = [
    {
      title: "Victim Portal",
      description: "Report emergencies, request assistance and track your relief status in real time.",
      icon: <AlertTriangle size={28} />,
      accent: C.red,
      accentBg: "#FDF2F2",
      href: "/victim/login",
      cta: "Report Emergency",
    },
    {
      title: "Volunteer Portal",
      description: "Register your skills, receive field assignments and contribute directly to relief operations.",
      icon: <Users size={28} />,
      accent: C.teal,
      accentBg: "#F0FAF9",
      href: "/volunteer/login",
      cta: "Join as Volunteer",
    },
    {
      title: "Authority Portal",
      description: "Monitor incidents, coordinate resources and manage end-to-end disaster response.",
      icon: <Shield size={28} />,
      accent: C.navySecondary,
      accentBg: "#F0F4F8",
      href: "/authority/login",
      cta: "Authority Login",
    },
    {
      title: "Donor Portal",
      description: "Contribute funds or essential supplies and track exactly how your donation is utilised.",
      icon: <Heart size={28} />,
      accent: C.amber,
      accentBg: "#FFFBF2",
      href: "/donor/login",
      cta: "Donate Now",
    },
  ];

  // ── How-it-works steps ───────────────────────────────────────────────────
  const steps = [
    {
      num: "01",
      title: "Report",
      desc: "Affected individuals submit emergency requests with location and details through any device.",
      icon: <AlertTriangle size={22} color={C.red} />,
      color: C.red,
    },
    {
      num: "02",
      title: "Verify",
      desc: "Authorities review, validate and prioritise reported incidents on a live dashboard.",
      icon: <Search size={22} color={C.amber} />,
      color: C.amber,
    },
    {
      num: "03",
      title: "Coordinate",
      desc: "Resources, volunteers and logistics are assigned and dispatched through the platform.",
      icon: <UserCheck size={22} color={C.teal} />,
      color: C.teal,
    },
    {
      num: "04",
      title: "Deliver",
      desc: "Relief reaches those in need and every action is tracked transparently for all stakeholders.",
      icon: <Truck size={22} color={C.navySecondary} />,
      color: C.navySecondary,
    },
  ];

  // ── Why ReliefLink features ──────────────────────────────────────────────
  const features = [
    {
      icon: <Zap size={24} color={C.teal} />,
      title: "Real-time Coordination",
      desc: "Live incident maps, resource tracking and instant notifications keep every stakeholder aligned during critical moments.",
    },
    {
      icon: <Eye size={24} color={C.amber} />,
      title: "Transparent Tracking",
      desc: "Every donation, volunteer hour and relief package is logged on a verifiable audit trail visible to all parties.",
    },
    {
      icon: <Globe size={24} color={C.navySecondary} />,
      title: "Community-Driven",
      desc: "Built around the people who matter most — survivors, local volunteers, and civic organisations working together.",
    },
  ];

  // ── Impact stats ─────────────────────────────────────────────────────────
  const stats = [
    { value: "4,200+", label: "Families Assisted", icon: <Heart size={20} color={C.amber} /> },
    { value: "180+", label: "Active Volunteers", icon: <Users size={20} color={C.teal} /> },
    { value: "94%", label: "Delivery Rate", icon: <TrendingUp size={20} color="#6EE7B7" /> },
    { value: "12", label: "Active Disaster Zones", icon: <MapPin size={20} color="#FCA5A5" /> },
  ];

  return (
    <>
      <FontStyle />
      <div style={{ color: C.text, background: C.bg, minHeight: "100vh" }}>

        {/* ════════════════════════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════════════════════════ */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: C.white,
            borderBottom: scrolled ? "1px solid #E2E8F0" : "1px solid transparent",
            boxShadow: scrolled ? "0 1px 8px rgba(23,45,64,0.08)" : "none",
            transition: "box-shadow 0.2s, border-color 0.2s",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              height: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: C.navyPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Shield size={20} color={C.white} />
              </div>
              <span
                className="font-manrope"
                style={{ fontSize: 20, fontWeight: 800, color: C.navyPrimary, letterSpacing: "-0.3px" }}
              >
                ReliefLink
              </span>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
              <a href="#about" style={{ fontSize: 14, fontWeight: 500, color: C.navySecondary, textDecoration: "none" }}>
                About
              </a>
              <a href="#how-it-works" style={{ fontSize: 14, fontWeight: 500, color: C.navySecondary, textDecoration: "none" }}>
                How It Works
              </a>
              <a href="#contact" style={{ fontSize: 14, fontWeight: 500, color: C.navySecondary, textDecoration: "none" }}>
                Contact
              </a>
            </nav>

            {/* CTA buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link
                to="/victim/login"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navyPrimary,
                  border: `1.5px solid ${C.navyPrimary}`,
                  borderRadius: 8,
                  padding: "8px 18px",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                className="hidden-mobile"
              >
                Login
              </Link>
              <Link
                to="/victim/login"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.white,
                  background: C.red,
                  borderRadius: 8,
                  padding: "9px 18px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 8px rgba(217,75,69,0.3)",
                }}
              >
                <Bell size={14} />
                Report Emergency
              </Link>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: C.navyPrimary,
                }}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile nav drawer */}
          {mobileMenuOpen && (
            <div
              style={{
                borderTop: "1px solid #E2E8F0",
                padding: "16px 24px",
                background: C.white,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {["About", "How It Works", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  style={{ fontSize: 15, fontWeight: 500, color: C.navySecondary, textDecoration: "none" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                to="/victim/login"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.navyPrimary,
                  border: `1.5px solid ${C.navyPrimary}`,
                  borderRadius: 8,
                  padding: "10px 18px",
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Login
              </Link>
            </div>
          )}

          <style>{`
            @media (max-width: 768px) {
              .hidden-mobile { display: none !important; }
              .mobile-menu-btn { display: flex !important; }
            }
          `}</style>
        </header>

        {/* ════════════════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: `linear-gradient(135deg, ${C.navyPrimary} 0%, #0F1E2B 100%)`,
            padding: "80px 24px 72px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background texture dots */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
            className="hero-grid"
          >
            {/* Left – text */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(25,124,120,0.2)",
                  border: "1px solid rgba(25,124,120,0.4)",
                  borderRadius: 20,
                  padding: "5px 14px",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#4ADE80",
                    display: "inline-block",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6EE7B7", letterSpacing: "0.5px" }}>
                  PLATFORM ACTIVE — DEMONSTRATION MODE
                </span>
              </div>

              <h1
                className="font-manrope"
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 800,
                  color: C.white,
                  lineHeight: 1.18,
                  marginBottom: 20,
                  letterSpacing: "-0.5px",
                }}
              >
                Together, We Respond.
                <br />
                <span style={{ color: C.amber }}>Together, We Recover.</span>
              </h1>

              <p
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.75,
                  maxWidth: 480,
                  marginBottom: 36,
                }}
              >
                ReliefLink connects affected communities, volunteers, authorities and donors
                through one coordinated disaster-relief platform — so help always reaches
                the right people, at the right time.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link
                  to="/victim/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.red,
                    color: C.white,
                    fontWeight: 700,
                    fontSize: 15,
                    borderRadius: 10,
                    padding: "13px 26px",
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(217,75,69,0.4)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(217,75,69,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(217,75,69,0.4)";
                  }}
                >
                  <AlertTriangle size={16} />
                  Report an Emergency
                </Link>

                <a
                  href="#portals"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    border: "1.5px solid rgba(255,255,255,0.4)",
                    color: C.white,
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 10,
                    padding: "13px 26px",
                    textDecoration: "none",
                    transition: "background 0.15s",
                    background: "rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                >
                  Explore ReliefLink
                  <ChevronDown size={16} />
                </a>
              </div>
            </div>

            {/* Right – illustration */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <HeroIllustration />
            </div>
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
            @media (max-width: 768px) {
              .hero-grid { grid-template-columns: 1fr !important; }
              .hero-grid > div:last-child { display: none; }
            }
          `}</style>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            ANNOUNCEMENTS BANNER
        ════════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: `linear-gradient(90deg, ${C.amber}18, ${C.amber}10)`,
            borderBottom: `2px solid ${C.amber}40`,
            padding: "12px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: C.amber,
                color: C.white,
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 4,
                padding: "2px 8px",
                letterSpacing: "0.5px",
                flexShrink: 0,
              }}
            >
              ANNOUNCEMENT
            </span>
            <Bell size={15} color={C.amber} />
            <p style={{ fontSize: 13, color: C.navyPrimary, fontWeight: 500, margin: 0 }}>
              <strong>Demo Notice:</strong> ReliefLink is currently running in demonstration mode. All data shown is
              simulated. For real emergencies, contact your local emergency services immediately.
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            PORTAL SELECTION
        ════════════════════════════════════════════════════════════════════ */}
        <section id="portals" style={{ background: C.white, padding: "80px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  color: C.teal,
                  textTransform: "uppercase",
                }}
              >
                Choose Your Role
              </span>
              <h2
                className="font-manrope"
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  color: C.navyPrimary,
                  marginTop: 10,
                  marginBottom: 14,
                  letterSpacing: "-0.3px",
                }}
              >
                One Platform, Every Stakeholder
              </h2>
              <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 520, margin: "0 auto" }}>
                ReliefLink unifies all actors in disaster response under a single coordinated system.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(248px, 1fr))",
                gap: 24,
              }}
            >
              {portals.map((portal) => (
                <Link
                  key={portal.title}
                  to={portal.href}
                  className="portal-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: portal.accentBg,
                    border: `1.5px solid ${portal.accent}22`,
                    borderRadius: 16,
                    padding: 28,
                    textDecoration: "none",
                    color: C.text,
                    transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${portal.accent}22`;
                    e.currentTarget.style.borderColor = `${portal.accent}66`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = `${portal.accent}22`;
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      background: `${portal.accent}18`,
                      border: `1.5px solid ${portal.accent}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: portal.accent,
                      marginBottom: 20,
                    }}
                  >
                    {portal.icon}
                  </div>

                  <h3
                    className="font-manrope"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.navyPrimary,
                      marginBottom: 10,
                    }}
                  >
                    {portal.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 14,
                      color: C.textSecondary,
                      lineHeight: 1.65,
                      flexGrow: 1,
                      marginBottom: 24,
                    }}
                  >
                    {portal.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      color: portal.accent,
                    }}
                  >
                    {portal.cta}
                    <ArrowRight
                      size={15}
                      className="portal-arrow"
                      style={{ transition: "transform 0.18s" }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            HOW IT WORKS
        ════════════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" style={{ background: C.bg, padding: "80px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  color: C.teal,
                  textTransform: "uppercase",
                }}
              >
                The Process
              </span>
              <h2
                className="font-manrope"
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  color: C.navyPrimary,
                  marginTop: 10,
                  letterSpacing: "-0.3px",
                }}
              >
                How ReliefLink Works
              </h2>
            </div>

            {/* Steps */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 0,
                position: "relative",
              }}
              className="steps-grid"
            >
              {steps.map((step, idx) => (
                <div key={step.num} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {/* Connector line between steps */}
                  {idx < steps.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 28,
                        left: "calc(50% + 28px)",
                        right: "calc(-50% + 28px)",
                        height: 2,
                        background: `linear-gradient(90deg, ${step.color}60, ${steps[idx + 1].color}60)`,
                        zIndex: 0,
                      }}
                      className="step-line"
                    />
                  )}

                  {/* Circle icon */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: C.white,
                      border: `2px solid ${step.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 14px ${step.color}20`,
                      zIndex: 1,
                      position: "relative",
                      marginBottom: 20,
                    }}
                  >
                    {step.icon}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: step.color,
                      letterSpacing: "1px",
                      marginBottom: 8,
                    }}
                  >
                    STEP {step.num}
                  </div>

                  <h3
                    className="font-manrope"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.navyPrimary,
                      marginBottom: 10,
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 14,
                      color: C.textSecondary,
                      lineHeight: 1.65,
                      textAlign: "center",
                      maxWidth: 200,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <style>{`
              @media (max-width: 768px) {
                .step-line { display: none !important; }
                .steps-grid { gap: 40px !important; }
              }
            `}</style>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            WHY RELIEFLINK
        ════════════════════════════════════════════════════════════════════ */}
        <section id="about" style={{ background: C.white, padding: "80px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  color: C.teal,
                  textTransform: "uppercase",
                }}
              >
                Why ReliefLink
              </span>
              <h2
                className="font-manrope"
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 800,
                  color: C.navyPrimary,
                  marginTop: 10,
                  letterSpacing: "-0.3px",
                }}
              >
                Built for Trust. Designed for Action.
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 32,
              }}
            >
              {features.map((f) => (
                <div
                  key={f.title}
                  style={{
                    padding: "32px 28px",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 16,
                    background: C.white,
                    transition: "box-shadow 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(23,45,64,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: C.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3
                    className="font-manrope"
                    style={{ fontSize: 18, fontWeight: 700, color: C.navyPrimary, marginBottom: 12 }}
                  >
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            IMPACT STATS
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: `linear-gradient(135deg, ${C.navyPrimary} 0%, #0F1E2B 100%)`,
            padding: "72px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              pointerEvents: "none",
            }}
          />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            {/* Sample data badge */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(229,160,75,0.15)",
                  border: "1px solid rgba(229,160,75,0.35)",
                  borderRadius: 20,
                  padding: "5px 16px",
                  marginBottom: 18,
                }}
              >
                <ClipboardList size={13} color={C.amber} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, letterSpacing: "1px" }}>
                  SAMPLE DATA — FOR DEMONSTRATION ONLY
                </span>
              </div>
              <h2
                className="font-manrope"
                style={{
                  fontSize: "clamp(22px, 3vw, 34px)",
                  fontWeight: 800,
                  color: C.white,
                  letterSpacing: "-0.3px",
                }}
              >
                Platform Impact at a Glance
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 24,
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    padding: "32px 24px",
                    textAlign: "center",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className="font-manrope"
                    style={{
                      fontSize: "clamp(30px, 4vw, 42px)",
                      fontWeight: 800,
                      color: C.white,
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.amber,
                      fontWeight: 700,
                      letterSpacing: "0.8px",
                      marginTop: 8,
                    }}
                  >
                    SAMPLE
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            CTA BAND
        ════════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: C.teal,
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2
              className="font-manrope"
              style={{
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 800,
                color: C.white,
                marginBottom: 14,
                letterSpacing: "-0.3px",
              }}
            >
              Ready to Make a Difference?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 32, lineHeight: 1.7 }}>
              Whether you're affected, volunteering, coordinating or donating — ReliefLink
              has a space for you. Join the network that keeps communities resilient.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                to="/victim/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.white,
                  color: C.teal,
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 10,
                  padding: "12px 24px",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                }}
              >
                <AlertTriangle size={15} />
                Report Emergency
              </Link>
              <Link
                to="/volunteer/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.15)",
                  color: C.white,
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 10,
                  padding: "12px 24px",
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                }}
              >
                <Users size={15} />
                Volunteer Now
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════════════════════ */}
        <footer
          id="contact"
          style={{
            background: "#0C1E2B",
            padding: "56px 24px 32px",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 40,
                marginBottom: 48,
              }}
              className="footer-grid"
            >
              {/* Brand column */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: C.navySecondary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Shield size={18} color={C.white} />
                  </div>
                  <span className="font-manrope" style={{ fontSize: 18, fontWeight: 800, color: C.white }}>
                    ReliefLink
                  </span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 260 }}>
                  A civic-tech demonstration platform for disaster-relief coordination. Connecting communities,
                  volunteers, authorities and donors.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4
                  className="font-manrope"
                  style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}
                >
                  Portals
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Victim Portal", to: "/victim/login" },
                    { label: "Volunteer Portal", to: "/volunteer/login" },
                    { label: "Authority Portal", to: "/authority/login" },
                    { label: "Donor Portal", to: "/donor/login" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4
                  className="font-manrope"
                  style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 16 }}
                >
                  Legal & Info
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Privacy Policy", "Terms of Use", "Contact"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                      onClick={(e) => e.preventDefault()}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 24 }} />

            {/* Bottom row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <p style={{ fontSize: 12, margin: 0 }}>
                © {new Date().getFullYear()} ReliefLink. All rights reserved.
              </p>
              <p
                style={{
                  fontSize: 11,
                  margin: 0,
                  background: "rgba(217,75,69,0.15)",
                  border: "1px solid rgba(217,75,69,0.3)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  color: "#FCA5A5",
                  textAlign: "center",
                }}
              >
                ⚠ Platform for demonstration purposes only. Not connected to real emergency services.
              </p>
            </div>
          </div>

          <style>{`
            @media (max-width: 768px) {
              .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
            }
          `}</style>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
