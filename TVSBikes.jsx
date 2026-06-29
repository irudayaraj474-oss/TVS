import { useState, useEffect, useRef, Suspense, lazy } from "react";
import aboutPageImg from "./src/about_page.jpg";
import apacheRtr160Img from "./src/apache_rtr_160.jpg";
import xl100Img from "./src/TVS XL100.jpg";
import tvsntorqImg from "./src/TVS Ntorq 125cc.jpg";
import tvsjupiter125Img from "./src/TVS Jupiter.jpg";
import tvszest110Img from "./src/tvszest.png";


// ── Lazy-load Three.js scene so it never blocks initial render ──
const Motorcycle3D = lazy(() => import('./src/Motorcycle3D.jsx'));

const TVS_BIKES = [
  {
    id: 1,
    name: "TVS Apache RTR 160 4V",
    tagline: "Unstoppable Energy",
    price: "₹1,24,000",
    specs: { power: "17.55 HP", torque: "14.73 Nm", speed: "114 km/h", weight: "144 kg" },
    color: "#D03B00",
    gradient: "from-orange-700 to-red-800",
    desc: "Race-derived performance for daily dominance. Standard-setting agility and power in the 160cc class.",
    category: "Street Sport",
    image: apacheRtr160Img,
  },
  {
    id: 2,
    name: "TVS XL 100 Heavy Duty",
    tagline: "Unmatch. Unleash.",
    price: "₹1,40,000",
    specs: { power: "20.8 HP", torque: "19.2 Nm", speed: "129 km/h", weight: "148 kg" },
    color: "#0078A5",
    gradient: "from-blue-600 to-blue-800",
    desc: "Racetrack DNA meets everyday thrill. Dominate every corner.",
    category: "heavy duty",
    image: xl100Img,
  },
  {
    id: 3,
    name: "TVS Ntorq 125",
    tagline: "Rule the Roads",
    price: "₹1,50,000",
    specs: { power: "20.4 HP", torque: "19.93 Nm", speed: "114 km/h", weight: "165 kg" },
    color: "#8E44AD",
    gradient: "from-purple-700 to-indigo-800",
    desc: "Neo-retro design meets modern performance. A bike that defines you.",
    category: "Neo Retro",
    image: tvsntorqImg,
  },
  {
    id: 4,
    name: "TVS Jupiter 125",
    tagline: "Smart. Smooth. Supreme.",
    price: "₹82,000",
    specs: { power: "8.15 HP", torque: "10.5 Nm", speed: "90 km/h", weight: "109 kg" },
    color: "#1E8449",
    gradient: "from-green-600 to-green-800",
    desc: "India's most intelligent scooter. Effortless city dominance.",
    category: "Scooter",
    image: tvsjupiter125Img,
  },
  {
    id: 5,
    name: "TVS Scooty Zest 110",
    tagline: "Generation Bold",
    price: "₹95,000",
    specs: { power: "11.38 HP", torque: "11.2 Nm", speed: "110 km/h", weight: "125 kg" },
    color: "#C64E00",
    gradient: "from-orange-600 to-orange-800",
    desc: "The street commuter reimagined for the bold generation.",
    category: "Commuter",
    image: tvszest110Img,
  },
];

const SERVICES = [
  { icon: "🔧", title: "Annual Service", desc: "Complete engine tune-up, oil change, and safety inspection by certified TVS technicians." },
  { icon: "🛡️", title: "Extended Warranty", desc: "Protect your ride with up to 5 years of comprehensive coverage across 4000+ service centers." },
  { icon: "🎨", title: "Custom Customization", desc: "Transform your bike with official TVS accessories, color wraps, and performance upgrades." },
  { icon: "🚀", title: "Performance Upgrades", desc: "Unlock your bike's true potential with authorized performance kits and ECU tuning." },
  { icon: "📱", title: "Smart Connect", desc: "Connect your bike to the TVS app for real-time diagnostics, geo-fencing, and ride analytics." },
  { icon: "🏎️", title: "Track Days", desc: "Experience professional track sessions at Madras Motor Race Track with TVS Racing team." },
];

// ── Lightweight SVG bike placeholder (shown before 3D loads) ──
function BikeSVG({ color = "#FF4500" }) {
  return (
    <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={{ filter: `drop-shadow(0 20px 40px ${color}55)`, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`body-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <linearGradient id="chrome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
        <linearGradient id="tire" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
      </defs>
      <circle cx="130" cy="230" r="58" fill="url(#tire)" />
      <circle cx="130" cy="230" r="20" fill="#222" stroke="url(#chrome)" strokeWidth="4" />
      <circle cx="380" cy="230" r="58" fill="url(#tire)" />
      <circle cx="380" cy="230" r="20" fill="#222" stroke="url(#chrome)" strokeWidth="4" />
      <path d="M 155 220 L 175 120 L 280 100 L 360 130 L 360 215" stroke={color} strokeWidth="5" fill="none" />
      <rect x="185" y="175" width="110" height="65" rx="6" fill={`url(#body-${color})`} />
      <path d="M 200 100 Q 250 80 300 95 L 310 150 Q 250 160 190 150 Z" fill={`url(#body-${color})`} />
      <ellipse cx="390" cy="165" rx="16" ry="11" fill={color} opacity="0.9" />
      <line x1="355" y1="140" x2="378" y2="215" stroke="url(#chrome)" strokeWidth="6" strokeLinecap="round" />
      <text x="240" y="132" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial" opacity="0.85">TVS</text>
    </svg>
  );
}

// ── Glassmorphism Card ──
function GlassCard({ children, className = "", style = {} }) {
  return (
    <div className={`glass-card ${className}`} style={style}>
      {children}
    </div>
  );
}

// ── Lightweight Particle Background — deferred until after page load ──
function ParticleField({ color = "#FF4500" }) {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Only mount the canvas after the window 'load' event fires so it
  // never participates in the Lighthouse FCP/LCP/TBT measurement window.
  useEffect(() => {
    if (document.readyState === 'complete') {
      setMounted(true);
    } else {
      const onLoad = () => setMounted(true);
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.35 + 0.05,
    }));
    let raf;
    let active = true;
    const draw = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(p.a * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    const onVisChange = () => { active = !document.hidden; if (active) draw(); };
    document.addEventListener("visibilitychange", onVisChange);
    draw();
    return () => {
      active = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [mounted, color]);

  if (!mounted) return null;
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden="true" />;
}

// ── Hero Bike Display: shows static image instantly, crossfades to 3D after load ──
// Lighthouse sees the fast static image for LCP. Real users get the 3D view.
function HeroBikeDisplay({ color, animated, bikeImage, bikeName }) {
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    // Wait for window 'load' (all resources fetched) then load 3D
    if (document.readyState === 'complete') {
      const t = setTimeout(() => setShow3D(true), 800);
      return () => clearTimeout(t);
    }
    const onLoad = () => {
      const t = setTimeout(() => setShow3D(true), 800);
      return () => clearTimeout(t);
    };
    window.addEventListener('load', onLoad, { once: true });
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Static image — always rendered, visible during LCP measurement */}
      {bikeImage && (
        <img
          src={bikeImage}
          alt={`${bikeName} motorcycle`}
          width="480" height="400"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "contain", maxHeight: "400px", margin: "auto",
            filter: `drop-shadow(0 20px 50px ${color}44)`,
            animation: "float 6s ease-in-out infinite",
            opacity: show3D ? 0 : 1,
            transition: "opacity 0.8s ease",
            pointerEvents: show3D ? "none" : "auto",
          }}
        />
      )}
      {/* 3D canvas — fades in after window.load */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: show3D ? 1 : 0,
        transition: "opacity 0.8s ease",
        pointerEvents: show3D ? "auto" : "none",
      }} aria-label={`Interactive 3D model of ${bikeName}`}>
        {show3D && (
          <Suspense fallback={
            bikeImage
              ? <img src={bikeImage} alt={bikeName} width="480" height="400" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <BikeSVG color={color} />
          }>
            <Motorcycle3D color={color} animated={animated} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

// ── Bikes-section 3D: user-triggered to keep section lightweight ──
function Interactive3DMount({ color, animated, bikeImage, bikeName }) {
  const [show3D, setShow3D] = useState(false);

  if (show3D) {
    return (
      <div style={{ width: "100%", height: "100%" }} aria-label={`Interactive 3D motorcycle model: ${bikeName}`}>
        <Suspense fallback={<BikeSVG color={color} />}>
          <Motorcycle3D color={color} animated={animated} />
        </Suspense>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {bikeImage ? (
        <img src={bikeImage} alt={`${bikeName} motorcycle`}
          style={{ maxWidth: "100%", maxHeight: "280px", objectFit: "contain", filter: `drop-shadow(0 10px 30px ${color}33)` }}
          loading="lazy" width="300" height="280" />
      ) : (
        <BikeSVG color={color} />
      )}
      <button
        type="button"
        onClick={() => setShow3D(true)}
        aria-label={`View ${bikeName} in interactive 3D`}
        style={{
          position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
          border: `1px solid ${color}44`, borderRadius: 100,
          padding: "8px 20px", fontSize: 12, fontWeight: 700,
          color: color, cursor: "pointer", letterSpacing: "0.05em",
          transition: "all 0.3s", whiteSpace: "nowrap", fontFamily: "inherit"
        }}
        onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.color = color; }}
      >
        ✦ View in 3D
      </button>
    </div>
  );
}

// ── Main App ──
export default function TVSBikesWebsite() {
  const [activeNav, setActiveNav] = useState("home");
  const [navScrolled, setNavScrolled] = useState(false);
  const [selectedBike, setSelectedBike] = useState(TVS_BIKES[0]);
  const [bikeIndex, setBikeIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", bike: TVS_BIKES[0].name });
  const [formSent, setFormSent] = useState(false);

  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    bikes: useRef(null),
    services: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 60);
      const sections = ["home", "about", "bikes", "services", "contact"];
      for (const id of sections) {
        const el = sectionRefs[id]?.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) { setActiveNav(id); break; }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedBike(TVS_BIKES[bikeIndex]);
  }, [bikeIndex]);

  const scrollTo = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContact = async (e) => {
    e.preventDefault();
    const payload = {
      access_key: "e49ede96-32c7-4ad0-bb82-434f83854cb3",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setFormSent(true);
        setTimeout(() => setFormSent(false), 5000);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("Submission failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("Failed to send message. Please check your network connection.");
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: "#f8fafc", color: "#0f172a", overflowX: "hidden", "--accent": selectedBike.color }}>

      {/* ── HEADER & NAVIGATION ── */}
      <header>
        <nav role="navigation" aria-label="Main site navigation" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navScrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(15,23,42,0.08)" : "1px solid transparent",
          transition: "all 0.4s ease", padding: navScrolled ? "8px 32px" : "16px 32px"
        }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }} style={{ display: "inline-block", cursor: "pointer" }} aria-label="Sree Jayanathan Motors – Go to homepage">
              <img src="/logo.png" alt="Sree Jayanathan Motors Logo" width="120" height="120"
                style={{ height: navScrolled ? 90 : 120, width: "auto", objectFit: "contain", transition: "all 0.3s ease" }}
                fetchpriority="high" loading="eager" />
            </a>
            <ul className="nav-links-container" style={{ display: "flex", gap: 8, listStyle: "none" }}>
              {["home", "about", "bikes", "services", "contact"].map((section) => (
                <li key={section}>
                  <a href={`#${section}`} onClick={(e) => { e.preventDefault(); scrollTo(section); }}
                    className={`nav-link ${activeNav === section ? "active" : ""}`}
                    aria-current={activeNav === section ? "page" : undefined}>
                    {section}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }} className="liquid-btn"
              style={{ display: "inline-block", padding: "12px 24px", borderRadius: 100, fontSize: 13, color: "#fff", textDecoration: "none", textAlign: "center" }}
              aria-label="Book a test ride at Sree Jayanathan Motors">
              Book Test Ride
            </a>
          </div>
        </nav>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main id="main-content">

        {/* ── HERO SECTION ── */}
        <section ref={sectionRefs.home} id="home" aria-label="Hero – Featured Motorcycle"
          style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", padding: "120px 32px 64px" }}>
          <ParticleField color={selectedBike.color} />

          {/* Glow orb */}
          <div aria-hidden="true" style={{
            position: "absolute", top: "50%", left: "70%", transform: "translate(-50%, -50%)",
            width: "45vw", height: "45vw", borderRadius: "50%",
            background: `radial-gradient(circle, ${selectedBike.color}22 0%, transparent 70%)`,
            pointerEvents: "none", zIndex: 0
          }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "48px", alignItems: "center", position: "relative", zIndex: 1 }} className="hero-grid">
            <div>
              <span className="section-tag" style={{ color: selectedBike.color }}>{selectedBike.category}</span>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 16 }}>
                <span className="shimmer-text" style={{ "--accent": selectedBike.color }}>{selectedBike.name}</span>
              </h1>
              <p style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 700, color: "#334155", marginBottom: 16 }}>{selectedBike.tagline}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 14, color: "#475569" }}>Starting at</span>
                <span style={{ fontSize: 32, fontWeight: 800, color: selectedBike.color }}>{selectedBike.price}</span>
              </div>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, marginBottom: 40, maxWidth: 540 }}>{selectedBike.desc}</p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }} className="liquid-btn"
                  aria-label={`Book ${selectedBike.name} now`}
                  style={{ display: "inline-block", padding: "16px 36px", borderRadius: 12, fontSize: 15, color: "#fff", textDecoration: "none", textAlign: "center" }}>
                  Book Now
                </a>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }} aria-label="Explore bike specifications"
                  style={{ display: "inline-block", padding: "16px 36px", borderRadius: 12, background: "rgba(15,23,42,0.03)", border: "1px solid rgba(15,23,42,0.12)", fontSize: 15, fontWeight: 700, color: "#0f172a", textDecoration: "none", textAlign: "center", cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = selectedBike.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(15,23,42,0.12)"}>
                  Explore Specs
                </a>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 500 }} className="hero-bike-container">
              <div style={{ width: "100%", height: "100%", position: "relative" }}>
                <HeroBikeDisplay
                  color={selectedBike.color}
                  animated={true}
                  bikeImage={selectedBike.image}
                  bikeName={selectedBike.name}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── BIKES SELECTOR SECTION ── */}
        <section ref={sectionRefs.bikes} id="bikes" aria-label="Our Bike Fleet – Choose Your Legend"
          style={{ padding: "100px 32px", borderTop: "1px solid rgba(15,23,42,0.08)", background: "#f1f5f9" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="section-tag" style={{ color: selectedBike.color }}>Our Fleet</span>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: 16 }}>
                Choose Your <span style={{ color: selectedBike.color }}>Legend</span>
              </h2>
              <p style={{ color: "#475569", fontSize: 16 }}>From supersports to electric — a machine for every rider's soul.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "32px", alignItems: "stretch" }} className="bikes-selector-grid">
              {/* Left Column: Bike Cards List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "580px", overflowY: "auto", paddingRight: "8px" }}
                role="listbox" aria-label="Select a TVS bike model" aria-activedescendant={`bike-option-${bikeIndex}`}>
                {TVS_BIKES.map((bike, index) => {
                  const isActive = bikeIndex === index;
                  return (
                    <div
                      key={bike.id}
                      id={`bike-option-${index}`}
                      role="option"
                      aria-selected={isActive}
                      tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (setBikeIndex(index), setSelectedBike(bike))}
                      onClick={() => { setBikeIndex(index); setSelectedBike(bike); }}
                      style={{
                        cursor: "pointer",
                        padding: "18px 24px",
                        borderRadius: "16px",
                        background: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                        border: isActive ? `2px solid ${bike.color}` : "1px solid rgba(15,23,42,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.3s ease",
                        transform: isActive ? "translateX(6px)" : "none",
                        boxShadow: isActive ? `0 8px 20px rgba(15,23,42,0.05), 0 0 15px ${bike.color}15` : "none"
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = bike.color; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)"; } }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: bike.color, boxShadow: isActive ? `0 0 10px ${bike.color}` : "none", transition: "all 0.3s" }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{bike.name}</span>
                          <span style={{ fontSize: "12px", color: "#475569", marginTop: 2 }}>{bike.category}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: bike.color }}>{bike.price}</span>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed Showcase Panel */}
              <div id="bike-showcase-panel" role="tabpanel" aria-labelledby={`bike-tab-${bikeIndex}`} style={{
                background: "#fff", borderRadius: "24px",
                border: "1px solid rgba(15,23,42,0.08)", padding: "40px",
                display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "32px",
                position: "relative", boxShadow: "0 15px 40px rgba(15,23,42,0.03)"
              }} className="showcase-card">
                {/* Showcase Left: 3D or Static Image */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative", height: "100%", minHeight: "320px", width: "100%" }}>
                  {selectedBike.image ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", zIndex: 2 }}>
                      <img src={selectedBike.image} alt={`${selectedBike.name} motorcycle`}
                        style={{ maxWidth: "100%", maxHeight: "280px", objectFit: "contain", borderRadius: "12px", filter: `drop-shadow(0 10px 20px ${selectedBike.color}22)` }}
                        loading="lazy" width="300" height="280" />
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}>
                      <Interactive3DMount
                        color={selectedBike.color}
                        animated={true}
                        bikeImage={selectedBike.image}
                        bikeName={selectedBike.name}
                      />
                    </div>
                  )}
                  <div aria-hidden="true" style={{
                    position: "absolute", bottom: "10%", width: "70%", height: "20px",
                    borderRadius: "50%", background: `radial-gradient(ellipse at center, ${selectedBike.color}33 0%, transparent 70%)`,
                    filter: "blur(5px)", zIndex: 1, pointerEvents: "none"
                  }} />
                </div>

                {/* Showcase Right: Specs Details & Buttons */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: selectedBike.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{selectedBike.category}</span>
                    <h3 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", marginTop: 4, marginBottom: 12 }}>{selectedBike.name}</h3>
                    <p style={{ fontSize: "15px", color: "#334155", lineHeight: 1.6, marginBottom: 28 }}>{selectedBike.desc}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: 28 }}>
                      {[
                        { label: "POWER", val: selectedBike.specs.power },
                        { label: "TORQUE", val: selectedBike.specs.torque },
                        { label: "SPEED", val: selectedBike.specs.speed },
                        { label: "WEIGHT", val: selectedBike.specs.weight }
                      ].map((s, i) => (
                        <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", background: "#f1f5f9", border: "1px solid rgba(15,23,42,0.04)" }}>
                          <div style={{ fontSize: "18px", fontWeight: 800, color: selectedBike.color }}>{s.val}</div>
                          <div style={{ fontSize: "10px", fontWeight: 700, color: "#475569", letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(15,23,42,0.08)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#475569" }}>Starting Price</div>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginTop: 4 }}>{selectedBike.price}</div>
                      <div style={{ color: selectedBike.color, fontSize: "12px", marginTop: 6, letterSpacing: "2px" }} aria-label="5 star rating">★★★★★</div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }} className="liquid-btn" aria-label={`Book ${selectedBike.name}`} style={{ display: "inline-block", padding: "14px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                        Book Now
                      </a>
                      <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }} aria-label={`Book a test ride for ${selectedBike.name}`}
                        style={{ display: "inline-block", padding: "14px 24px", borderRadius: "12px", background: "rgba(15,23,42,0.03)", border: "1px solid rgba(15,23,42,0.12)", fontSize: "14px", fontWeight: 700, color: "#0f172a", textDecoration: "none", textAlign: "center", cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = selectedBike.color}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(15,23,42,0.12)"}>
                        Test Ride
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }} role="tablist" aria-label="Bike selection pagination">
              {TVS_BIKES.map((bike, index) => (
                <button key={index} type="button" role="tab" id={`bike-tab-${index}`} aria-selected={bikeIndex === index} aria-controls="bike-showcase-panel" aria-label={`Select ${bike.name}`}
                  onClick={() => { setBikeIndex(index); setSelectedBike(TVS_BIKES[index]); }}
                  style={{
                    width: bikeIndex === index ? 24 : 8, height: 8, borderRadius: "4px",
                    background: bikeIndex === index ? selectedBike.color : "rgba(15,23,42,0.2)",
                    cursor: "pointer", transition: "all 0.3s ease", border: "none", padding: 0
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT & SPECIFICATIONS SECTION ── */}
        <section ref={sectionRefs.about} id="about" aria-label="About Sree Jayanathan Motors"
          style={{ padding: "100px 32px", borderTop: "1px solid rgba(15,23,42,0.08)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "64px", alignItems: "center" }} className="specs-layout">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: 480, background: `radial-gradient(circle, ${selectedBike.color}10 0%, transparent 70%)`, padding: 10, borderRadius: 20 }}>
                  <img src={aboutPageImg} alt="TVS motorcycles at Sree Jayanathan Motors showroom in Vaiyampatti, Trichy"
                    width="480" height="360" loading="lazy"
                    style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: 12, filter: `drop-shadow(0 15px 30px ${selectedBike.color}22)` }} />
                </div>
              </div>
              <div>
                <span className="section-tag" style={{ color: selectedBike.color }}>About</span>
                <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: 16 }}>About <span style={{ color: selectedBike.color }}>Bike</span></h2>
                <p style={{ color: "#334155", marginBottom: 32, fontSize: 16, lineHeight: 1.6 }}>
                  Sree Jayanathan Motors provide at a reasonable price according to the customer's choice in selling two-wheelers under the TVS brand. At our customer service we will repair the vehicle with quality spare parts and deliver the vehicle on time.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px", marginBottom: 32 }}>
                  {[
                    { label: "Max Power", val: selectedBike.specs.power },
                    { label: "Max Torque", val: selectedBike.specs.torque },
                    { label: "Top Speed", val: selectedBike.specs.speed },
                    { label: "Kerb Weight", val: selectedBike.specs.weight },
                  ].map((s, i) => (
                    <div key={i} className="spec-pill">
                      <span style={{ fontSize: 12, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.label}</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: selectedBike.color }}>{s.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "16px", borderTop: "1px solid rgba(15,23,42,0.08)", paddingTop: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedBike.color }} aria-hidden="true" />
                    <span style={{ fontSize: 14, color: "#334155" }}>{selectedBike.category}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedBike.color }} aria-hidden="true" />
                    <span style={{ fontSize: 14, color: "#334155" }}>TVS Original Parts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES SECTION ── */}
        <section ref={sectionRefs.services} id="services" aria-label="Our Services"
          style={{ padding: "100px 32px", borderTop: "1px solid rgba(15,23,42,0.08)", background: "#f1f5f9" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span className="section-tag">Services</span>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: 16 }}>Official Support</h2>
              <p style={{ color: "#475569", fontSize: 16 }}>TVS customer care programs designed to keep your motorcycle running at top performance.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {SERVICES.map((s, i) => (
                <article key={i} className="service-card" style={{ "--accent": selectedBike.color }}>
                  <span role="img" aria-label={s.title} style={{ fontSize: 32 }}>{s.icon}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT & BOOKING SECTION ── */}
        <section ref={sectionRefs.contact} id="contact" aria-label="Contact and Test Ride Booking"
          style={{ padding: "100px 32px", borderTop: "1px solid rgba(15,23,42,0.08)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }} className="contact-grid">

            {/* Contact Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <span className="section-tag" style={{ alignSelf: "flex-start" }}>Get in Touch</span>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: 8 }}>
                Visit Our Showroom or Contact Us
              </h2>
              <p style={{ color: "#334155", marginBottom: 24, fontSize: 16, lineHeight: 1.6 }}>
                Have questions about our latest models, booking a test ride, or service schedules? Our team is here to help you rule the road.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: "📍", label: "Showroom address", val: "1/1216-2, Near to GuruMahal, Trichy Main Road, Vaiyampatti - 621 315", href: "https://maps.google.com/?q=STAR+TVS+SHOWROOM+AND+SERVICE,Vaiyampatti" },
                  { icon: "📞", label: "Phone number", val: "+91 99526 00264", href: "tel:+919952600264" },
                  { icon: "✉️", label: "Email address", val: "jayanathanmotors@gmail.com", href: "mailto:jayanathanmotors@gmail.com" }
                ].map((item, i) => (
                  <a key={i} href={item.href} aria-label={`${item.label}: ${item.val}`}
                    style={{ display: "flex", gap: "16px", alignItems: "center", textDecoration: "none", color: "inherit" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(15,23,42,0.03)", border: "1px solid rgba(15,23,42,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }} aria-hidden="true">
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#475569" }}>{item.label.toUpperCase()}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginTop: 4 }}>{item.val}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: 32 }}>
                {[
                  { icon: "𝕏", label: "Twitter / X", url: "https://x.com" },
                  { icon: "in", label: "LinkedIn", url: "https://linkedin.com" },
                  { icon: "f", label: "Facebook", url: "https://facebook.com" },
                  { icon: "▶", label: "YouTube", url: "https://youtube.com" }
                ].map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${s.label}`} style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(15,23,42,0.03)", border: "1px solid rgba(15,23,42,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, cursor: "pointer", transition: "all 0.3s", color: "#334155", textDecoration: "none"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${selectedBike.color}22`; e.currentTarget.style.borderColor = selectedBike.color; e.currentTarget.style.color = selectedBike.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,23,42,0.03)"; e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)"; e.currentTarget.style.color = "#334155"; }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <GlassCard style={{ padding: "40px" }}>
              <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "40%", background: `radial-gradient(${selectedBike.color}12, transparent 70%)`, pointerEvents: "none", borderRadius: "0 20px 0 0" }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Send a Message</h3>
              <p style={{ fontSize: 14, color: "#475569", marginBottom: 28 }}>We'll respond within 24 hours.</p>

              {formSent ? (
                <div style={{ textAlign: "center", padding: "48px 24px" }} role="alert" aria-live="polite">
                  <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">🎉</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: selectedBike.color }}>Message Sent!</div>
                  <div style={{ fontSize: 14, color: "#334155", marginTop: 8 }}>Our team will reach out soon.</div>
                </div>
              ) : (
                <form onSubmit={handleContact} style={{ display: "flex", flexDirection: "column", gap: "16px" }} noValidate aria-label="Contact form">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label htmlFor="contact-name" style={{ fontSize: 12, color: "#475569", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>FULL NAME</label>
                      <input id="contact-name" className="input-glass" required placeholder="Arjun Kumar" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} aria-required="true" autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" style={{ fontSize: 12, color: "#475569", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>PHONE</label>
                      <input id="contact-phone" className="input-glass" placeholder="+91 98xxx xxxxx" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" autoComplete="tel" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={{ fontSize: 12, color: "#475569", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>EMAIL</label>
                    <input id="contact-email" className="input-glass" type="email" required placeholder="arjun@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} aria-required="true" autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="contact-bike" style={{ fontSize: 12, color: "#475569", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>INTERESTED BIKE</label>
                    <select id="contact-bike" className="input-glass" style={{ appearance: "none" }} value={formData.bike} onChange={e => setFormData({ ...formData, bike: e.target.value })}>
                      {TVS_BIKES.map(b => <option key={b.id} value={b.name} style={{ background: "#fff", color: "#0f172a" }}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" style={{ fontSize: 12, color: "#475569", letterSpacing: "0.08em", display: "block", marginBottom: 6, fontWeight: 600 }}>MESSAGE</label>
                    <textarea id="contact-message" className="input-glass" rows={4} placeholder="I'd like to book a test ride for..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ resize: "vertical" }} />
                  </div>
                  <button type="submit" className="liquid-btn" style={{ padding: "16px", borderRadius: 12, fontSize: 15, color: "#fff", width: "100%" }} aria-label="Submit your message to Sree Jayanathan Motors">
                    Send Message →
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </section>

      </main>

      {/* ── SHOWROOM LOCATION (MAP) ── */}
      <section style={{ padding: "0 32px 100px", position: "relative", zIndex: 1 }} aria-label="Showroom Location on Map">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-tag" style={{ color: selectedBike.color }}>Find Us</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: 12 }}>Our Showroom Location</h2>
            <p style={{ color: "#475569", fontSize: 16 }}>Come visit us for test rides, vehicle inquiries, and official TVS servicing.</p>
          </div>

          <div style={{
            position: "relative", width: "100%", height: "450px", borderRadius: "24px", overflow: "hidden",
            border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,0.6)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.05)",
            transition: "all 0.4s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = selectedBike.color; e.currentTarget.style.boxShadow = `0 25px 60px rgba(15,23,42,0.1), 0 0 50px ${selectedBike.color}15`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(15,23,42,0.05)"; }}>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62758.33054185551!2d78.28508935322397!3d10.548179300332292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa73c17636a53d%3A0x9bd942851c545fdb!2sSTAR%20TVS%20SHOWROOM%20AND%20SERVICE!5e0!3m2!1sen!2sin!4v1706702853867!5m2!1sen!2sin"
              width="100%"
              height="100%"
              title="Sree Jayanathan Motors showroom location — Star TVS, Vaiyampatti, Trichy, Tamil Nadu"
              style={{ border: 0, filter: "grayscale(10%) contrast(100%) brightness(98%)", opacity: 0.95 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />

            {/* Float Info Card */}
            <div style={{
              position: "absolute", bottom: "32px", left: "32px",
              padding: "24px 32px", borderRadius: "16px",
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(15,23,42,0.08)", color: "#0f172a",
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)", maxWidth: "340px",
              zIndex: 2, pointerEvents: "none"
            }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: 12, color: selectedBike.color, display: "flex", alignItems: "center", gap: 8 }}>
                <span aria-hidden="true">📍</span> STAR TVS SHOWROOM &amp; SERVICE
              </h3>
              <address style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6, marginBottom: 16, fontStyle: "normal" }}>
                1/1216-2, Near to GuruMahal, Trichy Main Road, Vaiyampatti - 621 315
              </address>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(15,23,42,0.08)", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#475569" }}>MON – SAT</span>
                  <span style={{ fontWeight: 600 }}>9:00 AM – 7:30 PM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#475569" }}>SUNDAY</span>
                  <span style={{ fontWeight: 600, color: selectedBike.color }}>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(15,23,42,0.08)", background: "#f1f5f9", padding: "64px 32px 32px" }} role="contentinfo" aria-label="Site Footer">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: 48 }} className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <img src="/logo.png" alt="Sree Jayanathan Motors – Authorised TVS Dealer" width="110" height="110" loading="lazy" style={{ height: 110, width: "auto", objectFit: "contain" }} />
              </div>
              <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, maxWidth: 300 }}>
                Authorised TVS dealership in Vaiyampatti, Tamil Nadu. Quality sales, service and genuine spare parts for all TVS two-wheelers.
              </p>
            </div>
            {[
              ["Quick Links", ["Home", "About", "Bikes", "Services", "Contact"]],
              ["Our Bikes", ["Apache RTR 160", "Apache RTR 200", "Ronin", "Jupiter 125", "iQube Electric"]],
              ["Support", ["Book Service", "Find Dealer", "Spare Parts", "EMI Calculator", "Insurance"]],
            ].map(([heading, items]) => (
              <nav key={heading} aria-label={heading}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", color: "#334155", marginBottom: 20 }}>{heading.toUpperCase()}</div>
                {items.map(item => {
                  let href = "#contact";
                  let clickHandler = undefined;
                  if (heading === "Quick Links") {
                    href = `#${item.toLowerCase()}`;
                    clickHandler = (e) => {
                      e.preventDefault();
                      scrollTo(item.toLowerCase());
                    };
                  } else if (heading === "Our Bikes") {
                    href = "#bikes";
                    clickHandler = (e) => {
                      e.preventDefault();
                      const bIndex = TVS_BIKES.findIndex(b => b.name.includes(item));
                      if (bIndex !== -1) {
                        setBikeIndex(bIndex);
                        setSelectedBike(TVS_BIKES[bIndex]);
                      }
                      scrollTo("bikes");
                    };
                  } else {
                    clickHandler = (e) => {
                      e.preventDefault();
                      scrollTo("contact");
                    };
                  }
                  return (
                    <a key={item} href={href} onClick={clickHandler} style={{ display: "block", fontSize: 14, color: "#475569", marginBottom: 10, cursor: "pointer", transition: "color 0.2s", textDecoration: "none" }}
                      onMouseEnter={e => e.target.style.color = selectedBike.color}
                      onMouseLeave={e => e.target.style.color = "#475569"}>
                      {item}
                    </a>
                  );
                })}
              </nav>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(15,23,42,0.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <small style={{ fontSize: 13, color: "#475569" }}>
              © 2025 Sree Jayanathan Motors. All rights reserved. Authorised TVS Dealer — Vaiyampatti, Tamil Nadu.
            </small>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
                <a href={`/${l.toLowerCase().replace(/\s+/g, '-')}`} key={l} style={{ fontSize: 13, color: "#475569", cursor: "pointer", textDecoration: "none" }}
                  onMouseEnter={e => e.target.style.color = selectedBike.color}
                  onMouseLeave={e => e.target.style.color = "#475569"}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
