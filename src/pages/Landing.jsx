import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const FloatingOrb = ({ style }) => (
  <div style={{
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.15,
    pointerEvents: "none",
    ...style
  }} />
);

const Counter = ({ target, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const FeatureCard = ({ icon, title, desc, delay, isDarkMode }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="lux-feature-card"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
      }}
    >
      <div style={{ fontSize: "1.8rem", marginBottom: "16px" }}>{icon}</div>
      <div style={{ fontSize: "1.1rem", color: isDarkMode ? "#F1F5F9" : "#0F172A", marginBottom: "8px", fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: "0.9rem", color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)", lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
};

const MockDashboard = ({ isDarkMode }) => (
  <div style={{
    background: isDarkMode ? "rgba(10,8,20,0.9)" : "rgba(255,255,255,0.9)",
    border: "1px solid rgba(59,130,246,0.25)",
    borderRadius: "24px",
    padding: "28px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.08)",
    maxWidth: "520px",
    width: "100%",
  }}>
    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
      <div>
        <div style={{ fontSize: "1rem", color: "#3B82F6", fontWeight: 600 }}>Paise Bachaaoo</div>
        <div style={{ fontSize: "0.75rem", color: isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)", marginTop: "2px" }}>Simplified Money Tracking</div>
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        {["#FF5F57", "#FFBD2E", "#28C940"].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
      </div>
    </div>

    {/* Balance Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
      {[
        { label: "Total Balance", value: "₹2,47,840", color: "#3B82F6", change: "+12.3%" },
        { label: "Income", value: "₹85,000", color: "#4ADE80", change: "+8.1%" },
        { label: "Expenses", value: "₹42,350", color: "#F87171", change: "-3.2%" },
      ].map((item) => (
        <div key={item.label} style={{
          background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${item.color}30`,
          borderRadius: "14px",
          padding: "14px 12px",
        }}>
          <div style={{ fontSize: "0.65rem", color: isDarkMode ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.45)", marginBottom: "6px" }}>{item.label}</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: item.color, marginBottom: "4px" }}>{item.value}</div>
          <div style={{ fontSize: "0.65rem", color: item.color + "CC" }}>{item.change}</div>
        </div>
      ))}
    </div>

    {/* Mini Chart */}
    <div style={{ background: isDarkMode ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)", borderRadius: "14px", padding: "16px", marginBottom: "16px" }}>
      <div style={{ fontSize: "0.75rem", color: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.5)", marginBottom: "12px", fontWeight: 600 }}>Spending Overview</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px" }}>
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${h}%`,
            background: i === 11
              ? "linear-gradient(to top, #3B82F6, #F1F5F9)"
              : `rgba(59,130,246,${0.2 + i * 0.02})`,
            borderRadius: "4px 4px 0 0",
            transition: "all 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        {["Jan", "Apr", "Jul", "Oct", "Now"].map(m => (
          <div key={m} style={{ fontSize: "0.6rem", color: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.3)" }}>{m}</div>
        ))}
      </div>
    </div>

    {/* Recent Transactions */}
    <div style={{ fontSize: "0.75rem", color: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.5)", marginBottom: "10px", fontWeight: 600 }}>Recent Transactions</div>
    {[
      { name: "Salary Credit", cat: "Income", amount: "+₹85,000", icon: "💼", color: "#4ADE80" },
      { name: "Groceries", cat: "Expense", amount: "-₹3,240", icon: "🛒", color: "#F87171" },
      { name: "Netflix EMI", cat: "Installment", amount: "-₹649", icon: "📺", color: "#C084FC" },
    ].map((t, i) => (
      <div key={i} style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: i < 2 ? isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" : "none",
      }}>
        <div style={{ width: 32, height: 32, borderRadius: "10px", background: isDarkMode ? "rgba(255,255,255,0.06)" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", marginRight: "12px" }}>{t.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.8rem", color: isDarkMode ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.85)", fontWeight: 600 }}>{t.name}</div>
          <div style={{ fontSize: "0.65rem", color: isDarkMode ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.35)" }}>{t.cat}</div>
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: t.color }}>{t.amount}</div>
      </div>
    ))}
  </div>
);

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrollY > 50 ? (isDarkMode ? "rgba(8,6,18,0.92)" : "rgba(248,250,252,0.92)") : "transparent";

  return (
    <div className={`landing-page-wrapper ${isDarkMode ? 'dark' : ''}`}>
      {/* Background Orbs */}
      <FloatingOrb style={{ width: 600, height: 600, background: "#3B82F6", top: -200, left: -200, animation: "lux-spin-slow 30s linear infinite" }} />
      <FloatingOrb style={{ width: 400, height: 400, background: "#7C3AED", top: "30%", right: -100 }} />
      <FloatingOrb style={{ width: 300, height: 300, background: "#3B82F6", bottom: "10%", left: "20%" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.06) 1px, transparent 0)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg, backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? "1px solid rgba(59,130,246,0.1)" : "none",
        transition: "all 0.4s ease"
      }}>
        <div className="lux-nav-container" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "12px",
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", animation: "lux-pulse-glow 3s ease-in-out infinite"
            }}>💰</div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem" }} className="lux-shimmer-accent">Paise Bachaaoo</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div className="lux-nav-links" style={{ display: "flex", gap: 28 }}>
              {["Features", "Themes"].map(l => (
                <a key={l} className="lux-nav-link" href={`#${l.toLowerCase()}`}>{l}</a>
              ))}
            </div>
            
            <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Theme">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button className="lux-cta-primary" style={{ padding: "10px 24px", fontSize: "0.875rem" }}
              onClick={() => navigate('/login', { state: { isLogin: false } })}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "120px 5vw 80px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap", justifyContent: "center" }}>
          {/* Left */}
          <div className="lux-hero-left" style={{ flex: "1 1 480px", animation: "lux-fadeInUp 0.9s cubic-bezier(0.16,1,0.3,1) both", display: "flex", flexDirection: "column", maxWidth: 600 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 50, padding: "8px 18px", marginBottom: 32,
              width: 'max-content'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", display: "inline-block", boxShadow: "0 0 10px #4ADE80" }} />
              <span style={{ fontSize: "0.8rem", color: "#3B82F6", fontWeight: 600 }}>Now Live — Luxury Market 3.0</span>
            </div>

            <h1 className="lux-hero-title">
              Your Money,<br />
              <span style={{ color: "#3B82F6" }}>Simplified</span>
            </h1>

            <p style={{
              marginTop: 20, fontSize: "1rem", color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)",
              lineHeight: 1.6, maxWidth: 480, fontWeight: 400
            }}>
              Paise Bachaao is your friendly neighborhood finance tracker. No complex jargon,
              no overwhelming buttons — just a simple, beautiful space to keep your spending in check.
            </p>

            <div style={{ display: "flex", gap: 16, marginTop: 40, flexWrap: "wrap" }}>
              <button className="lux-cta-primary" onClick={() => navigate('/login', { state: { isLogin: false } })}>
                Start for Free
              </button>
              <button className="lux-cta-secondary" onClick={() => navigate('/login')}>
                Welcome Back
              </button>
            </div>

            <div className="lux-stats-strip" style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[
                { num: 5000, suf: "+", label: "Users" },
                { num: 99, suf: ".9%", label: "Uptime" },
                { num: 5, suf: "", label: "Premium Themes" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#3B82F6" }}>
                    <Counter target={s.num} suffix={s.suf} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Mock Dashboard */}
          <div style={{
            flex: "1 1 480px", display: "flex", justifyContent: "center",
            animation: "lux-fadeInUp 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s both",
          }}>
            <div style={{ animation: "lux-float 6s ease-in-out infinite", width: "100%", maxWidth: 520 }}>
              <MockDashboard isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ padding: "0 5vw 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
            borderRadius: 20, padding: "28px 40px",
            display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20
          }}>
            {[
              { icon: "⚡", text: "Instant Cloud Sync" },
              { icon: "🔒", text: "Personal & Private" },
              { icon: "📊", text: "Easy Analytics" },
              { icon: "🌙", text: "Choose Your Vibe" },
              { icon: "📱", text: "On the Go" },
            ].map(f => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1.1rem" }}>{f.icon}</span>
                <span style={{ fontSize: "0.85rem", color: isDarkMode ? "rgba(255,255,255,0.65)" : "rgba(15,23,42,0.65)", fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 5vw", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "0.8rem", color: "#3B82F6", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Everything You Need</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 700, lineHeight: 1.2 }}>
              Finance, <span className="lux-shimmer-accent">Redefined</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "🔄", title: "Always Ready", desc: "Your data stays with you on every device, updating instantly so you're always in the loop.", delay: 0 },
              { icon: "📈", title: "Simple Insights", desc: "See your spending trends in beautiful charts that actually make sense, not just fancy numbers.", delay: 100 },
              { icon: "💳", title: "Plan Ahead", desc: "Track your bills and monthly goals without the stress. We'll help you remember what's coming.", delay: 200 },
              { icon: "🎨", title: "Your Personal Style", desc: "Choose from 6 unique themes that match your mood — from warm and cozy to dark and focused.", delay: 300 },
              { icon: "📊", title: "Easy Analytics", desc: "Deep dive into your habits with simple-to-understand breakdowns of where your money goes.", delay: 400 },
              { icon: "🛡️", title: "Safe & Private", desc: "Your financial life is your business. We keep your data isolated and secured for your eyes only.", delay: 500 },
            ].map(f => <FeatureCard key={f.title} {...f} isDarkMode={isDarkMode} />)}
          </div>
        </div>
      </section>

      {/* THEMES SHOWCASE */}
      <section id="themes" style={{ padding: "80px 5vw", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: "0.8rem", color: "#3B82F6", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Personalize Everything</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", fontWeight: 700 }}>
              5 Beautiful <span className="lux-shimmer-accent">Themes</span>
            </h2>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { name: "Vampire", bg: "#1a0000", accent: "#8B0000", text: "#FF4444", border: "#8B000060" },
              { name: "Cyberpunk", bg: "#0a001a", accent: "#7C3AED", text: "#00FFFF", border: "#7C3AED60" },
              { name: "Moonlight", bg: "#0a0e1a", accent: "#334155", text: "#C0C0C0", border: "#33415560" },
              { name: "Midnight", bg: "#111827", accent: "#1F2937", text: "#E5E7EB", border: "#1F293760" },
              { name: "Cloud", bg: "#F8F9FA", accent: "#E9ECEF", text: "#10B981", border: "#10B98130" },
            ].map(t => (
              <div key={t.name} className="lux-theme-card" style={{
                background: t.bg, border: `1.5px solid ${t.border}`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.04)";
                  e.currentTarget.style.borderColor = t.accent;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${t.accent}40`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.boxShadow = "none";
                }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.accent, margin: "0 auto 12px", boxShadow: `0 0 20px ${t.accent}80` }} />
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: t.text, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: "0.7rem", color: t.text + "80" }}>Theme</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "100px 5vw", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.15)",
            borderRadius: 24, padding: "50px 30px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -80, right: -80, width: 200, height: 200, borderRadius: "50%", background: "#3B82F6", filter: "blur(80px)", opacity: 0.1 }} />
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>💰</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, marginBottom: 16 }}>
              Take Command of<br /><span style={{ color: "#3B82F6" }}>Your Wealth</span>
            </h2>
            <p style={{ color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)", marginBottom: 32, lineHeight: 1.6, fontSize: "1rem" }}>
              Join thousands who&apos;ve upgraded their financial life. Free to start, premium experience from day one.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="lux-cta-primary" style={{ fontSize: "1.05rem", padding: "18px 48px" }}
                onClick={() => navigate('/login', { state: { isLogin: false } })}>
                Open Your Vault — Free
              </button>
              <button className="lux-cta-secondary"
                onClick={() => navigate('/login')}>
                Already a member?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(59,130,246,0.1)",
        padding: "32px 5vw",
        position: "relative", zIndex: 1,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontWeight: 600, color: "#3B82F6" }}>Paise Bachaaoo</span>
          <span style={{ fontSize: "0.8rem", color: isDarkMode ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.35)" }}>
            © 2025 Sanmaya · Built with ❤️ for the ambitious
          </span>
          <a href="https://github.com/sanmaaya/Finance-Tracker" target="_blank" rel="noreferrer"
            style={{ fontSize: "0.8rem", color: "rgba(59,130,246,0.6)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#3B82F6"}
            onMouseLeave={e => e.target.style.color = "rgba(59,130,246,0.6)"}>
            GitHub →
          </a>
        </div>
      </footer>
    </div>
  );
}