import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useTheme } from "../hooks/useTheme";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Floating Particle ───────────────────────────────────────────────────────
const Particle = ({ style }) => (
    <div style={{
        position: "absolute", borderRadius: "50%",
        pointerEvents: "none", ...style
    }} />
);

// ─── Animated Logo Vault ─────────────────────────────────────────────────────
const VaultLogo = () => {
    const [spin, setSpin] = useState(false);
    const [glow, setGlow] = useState(false);

    useEffect(() => {
        const t1 = setInterval(() => setSpin(s => !s), 4000);
        const t2 = setInterval(() => setGlow(g => !g), 2000);
        return () => { clearInterval(t1); clearInterval(t2); };
    }, []);

    return (
        <div
            style={{
                width: 72, height: 72, borderRadius: "22px",
                background: "linear-gradient(135deg, #D4AF37 0%, #F5C842 50%, #8B6914 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", cursor: "pointer",
                transform: spin ? "rotate(360deg)" : "rotate(0deg)",
                transition: "transform 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: glow
                    ? "0 0 40px rgba(212,175,55,0.8), 0 0 80px rgba(212,175,55,0.3)"
                    : "0 0 20px rgba(212,175,55,0.3)",
                animation: "logo-pulse 3s ease-in-out infinite",
            }}
            onMouseEnter={() => setSpin(s => !s)}
        >
            💰
        </div>
    );
};

// ─── Theme Configurations ─────────────────────────────────────────────────────
const THEMES = [
    { id: "dark", label: "Dark", bg: "#080612", card: "#110F24", accent: "#D4AF37", text: "#F5E6C8", border: "rgba(212,175,55,0.25)", orb1: "#D4AF37", orb2: "#7C3AED" },
    { id: "vampire", label: "Vampire", bg: "#0d0000", card: "#1a0005", accent: "#C0392B", text: "#FFB3B3", border: "rgba(192,57,43,0.35)", orb1: "#8B0000", orb2: "#C0392B" },
    { id: "cyberpunk", label: "Cyber", bg: "#050010", card: "#0a0020", accent: "#00FFFF", text: "#E0CFFF", border: "rgba(0,255,255,0.25)", orb1: "#7C3AED", orb2: "#00FFFF" },
    { id: "moonlight", label: "Moon", bg: "#060a14", card: "#0d1426", accent: "#94A3B8", text: "#CBD5E1", border: "rgba(148,163,184,0.25)", orb1: "#1E3A5F", orb2: "#94A3B8" },
    { id: "light", label: "Cloud", bg: "#F0F4F8", card: "#FFFFFF", accent: "#10B981", text: "#1E293B", border: "rgba(16,185,129,0.3)", orb1: "#10B981", orb2: "#3B82F6" },
];

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialIsLogin = location.state?.isLogin !== undefined ? location.state.isLogin : true;

    const [mode, setMode] = useState(initialIsLogin ? "login" : "signup"); // "login" | "signup"
    const { theme: globalThemeId, setTheme: setGlobalTheme } = useTheme();

    // Find the matching theme config or default to 'dark'
    const activeThemeConfig = THEMES.find(t => t.id === globalThemeId) || THEMES[0];

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(null);
    const [particles] = useState(() => Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.4 + 0.1,
    })));
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const containerRef = useRef(null);

    const T = activeThemeConfig;

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!email || !password || (mode === "signup" && !name)) {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            return;
        }

        if (import.meta.env.VITE_FIREBASE_API_KEY === 'YOUR_API_KEY' || !import.meta.env.VITE_FIREBASE_API_KEY) {
            setError('Firebase is not configured. Please add your credentials to the .env file.');
            setShake(true);
            setTimeout(() => setShake(false), 600);
            return;
        }

        setLoading(true);

        try {
            if (mode === "login") {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    const isLight = T.id === "light";

    return (
        <div style={{
            minHeight: "100vh",
            background: T.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
            position: "relative",
            overflow: "hidden",
            transition: "background 0.6s ease",
            padding: "20px"
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float-up {
          0%   { transform: translateY(0px) scale(1);   opacity: var(--op); }
          50%  { transform: translateY(-30px) scale(1.1); opacity: calc(var(--op) * 0.6); }
          100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
        }
        @keyframes logo-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(212,175,55,0.3); }
          50%      { box-shadow: 0 0 50px rgba(212,175,55,0.7), 0 0 100px rgba(212,175,55,0.2); }
        }
        @keyframes shimmer-text {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-10px); }
          40%     { transform: translateX(10px); }
          60%     { transform: translateX(-6px); }
          80%     { transform: translateX(6px); }
        }
        @keyframes success-bounce {
          0%  { transform: scale(1); }
          50% { transform: scale(1.08); }
          100%{ transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orb-drift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(30px,-20px) scale(1.05); }
          66%     { transform: translate(-20px,30px) scale(0.95); }
        }
        @keyframes check-draw {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }

        .input-field {
          width: 100%; border: 1.5px solid; border-radius: 14px;
          padding: 15px 18px; font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          outline: none; transition: all 0.3s ease;
        }
        .input-field::placeholder { opacity: 0.4; }

        .submit-btn {
          width: 100%; border: none; border-radius: 14px;
          padding: 17px; font-size: 1rem; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden; letter-spacing: 0.5px;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-3px); }
        .submit-btn:active:not(:disabled) { transform: translateY(-1px); }
        .submit-btn:disabled { cursor: not-allowed; }

        .theme-dot {
          width: 28px; height: 28px; border-radius: 50%;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          border: 2px solid transparent;
        }
        .theme-dot:hover { transform: scale(1.2); }

        .tab-btn {
          flex: 1; padding: 12px; border: none; border-radius: 12px;
          font-size: 0.9rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.3s ease;
        }

        .social-btn {
          flex: 1; border-radius: 12px; padding: 12px 16px;
          font-size: 0.85rem; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.25s ease; display: flex;
          align-items: center; justify-content: center; gap: 8px;
        }
        .social-btn:hover { transform: translateY(-2px); }

        .divider-line {
          flex: 1; height: 1px;
        }

        .shimmer-gold {
            color: ${T.accent};
        }
      `}</style>

            {/* ── Background Orbs ── */}
            <div style={{
                position: "absolute", width: 500, height: 500, borderRadius: "50%",
                background: T.orb1, filter: "blur(100px)", opacity: 0.12,
                top: -150, left: -150, animation: "orb-drift 12s ease-in-out infinite",
                transition: "background 0.6s ease",
            }} />
            <div style={{
                position: "absolute", width: 400, height: 400, borderRadius: "50%",
                background: T.orb2, filter: "blur(100px)", opacity: 0.1,
                bottom: -100, right: -100, animation: "orb-drift 15s ease-in-out infinite reverse",
                transition: "background 0.6s ease",
            }} />

            {/* ── Grid overlay ── */}
            <div style={{
                position: "absolute", inset: 0, opacity: 0.04,
                backgroundImage: `radial-gradient(circle at 1px 1px, ${T.accent} 1px, transparent 0)`,
                backgroundSize: "36px 36px", pointerEvents: "none",
                transition: "background 0.6s ease",
            }} />

            {/* ── Floating Particles ── */}
            {particles.map(p => (
                <Particle key={p.id} style={{
                    left: `${p.x}%`, bottom: "-10px",
                    width: p.size, height: p.size,
                    background: T.accent,
                    "--op": p.opacity,
                    opacity: p.opacity,
                    animation: `float-up ${p.duration}s ${p.delay}s ease-in-out infinite`,
                    transition: "background 0.6s ease",
                }} />
            ))}

            {/* ── Theme Picker (top-right) ── */}
            <div style={{
                position: "fixed", top: 24, right: 24, zIndex: 200,
                display: "flex", gap: 8, alignItems: "center",
                background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)", borderRadius: 50,
                padding: "8px 12px",
                border: `1px solid ${T.border}`,
            }}>
                {THEMES.map(t => (
                    <div
                        key={t.id}
                        className="theme-dot"
                        title={t.label}
                        onClick={() => setGlobalTheme(t.id)}
                        style={{
                            background: `linear-gradient(135deg, ${t.orb1}, ${t.orb2})`,
                            border: globalThemeId === t.id ? `2px solid ${t.accent}` : "2px solid transparent",
                            boxShadow: globalThemeId === t.id ? `0 0 12px ${t.accent}80` : "none",
                            transform: globalThemeId === t.id ? "scale(1.25)" : "scale(1)",
                        }}
                    />
                ))}
            </div>

            {/* ── Main Card ── */}
            <form
                onSubmit={handleSubmit}
                ref={containerRef}
                style={{
                    position: "relative", zIndex: 10,
                    width: "100%", maxWidth: 460,
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 28,
                    padding: "44px 40px",
                    backdropFilter: "blur(30px)",
                    boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${T.orb1}15`,
                    animation: `fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both, ${shake ? "shake 0.5s ease" : "none"}`,
                    transition: "background 0.6s ease, border 0.6s ease, box-shadow 0.6s ease",
                }}
            >
                {/* Success Overlay */}
                {success && (
                    <div style={{
                        position: "absolute", inset: 0, borderRadius: 28, zIndex: 50,
                        background: T.card, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 16,
                        animation: "success-bounce 0.5s ease",
                    }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: "50%",
                            background: `${T.accent}20`, border: `2px solid ${T.accent}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 0 30px ${T.accent}50`,
                        }}>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <polyline points="6,16 13,23 26,10" stroke={T.accent} strokeWidth="3"
                                    strokeLinecap="round" strokeLinejoin="round"
                                    strokeDasharray="50" strokeDashoffset="0"
                                    style={{ animation: "check-draw 0.5s ease forwards" }} />
                            </svg>
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: T.text }}>
                            You're in!
                        </div>
                        <div style={{ fontSize: "0.85rem", color: T.text, opacity: 0.5 }}>Taking you to your dashboard…</div>
                    </div>
                )}

                {/* ── Logo & Brand ── */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
                    <div onClick={() => navigate('/')}>
                        <VaultLogo />
                    </div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.9rem", fontWeight: 900,
                        marginTop: 16, marginBottom: 4,
                        color: T.text, textAlign: "center",
                        letterSpacing: "-0.5px",
                    }}>
                        {mode === "login" ? "Welcome " : "Start Your "}
                        <span className="shimmer-gold">Journey</span>
                    </h1>
                    <p style={{ fontSize: "0.82rem", color: T.text, opacity: 0.45, textAlign: "center" }}>
                        {mode === "login"
                            ? "Good to see you again. Let's see how you're doing."
                            : "Create a simple account to start tracking your savings."}
                    </p>
                </div>

                {/* ── Mode Tabs ── */}
                <div style={{
                    display: "flex", gap: 6, marginBottom: 28,
                    background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)",
                    borderRadius: 16, padding: 5,
                    border: `1px solid ${T.border}`,
                }}>
                    {["login", "signup"].map(m => (
                        <button
                            type="button"
                            key={m}
                            className="tab-btn"
                            onClick={() => { setMode(m); setSuccess(false); setError(""); }}
                            style={{
                                background: mode === m
                                    ? `linear-gradient(135deg, ${T.accent}, ${T.orb1})`
                                    : "transparent",
                                color: mode === m
                                    ? (isLight ? "#fff" : "#080612")
                                    : T.text,
                                opacity: mode === m ? 1 : 0.5,
                                boxShadow: mode === m ? `0 4px 16px ${T.accent}40` : "none",
                            }}
                        >
                            {m === "login" ? "🔐 Sign In" : "✨ Sign Up"}
                        </button>
                    ))}
                </div>


                {/* ── Error Message ── */}
                {error && (
                    <div style={{
                        marginBottom: 16, padding: '12px 16px', borderRadius: 12,
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* ── Form Fields ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {mode === "signup" && (
                        <div style={{ position: "relative" }}>
                            <span style={{
                                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                                fontSize: "1rem", opacity: 0.5, pointerEvents: "none",
                            }}>👤</span>
                            <input
                                className="input-field"
                                type="text" placeholder="Full Name"
                                value={name} onChange={e => setName(e.target.value)}
                                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                                style={{
                                    paddingLeft: 44,
                                    background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                                    borderColor: focused === "name" ? T.accent : T.border,
                                    color: T.text,
                                    boxShadow: focused === "name" ? `0 0 0 3px ${T.accent}20` : "none",
                                }}
                            />
                        </div>
                    )}

                    <div style={{ position: "relative" }}>
                        <span style={{
                            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                            fontSize: "1rem", opacity: 0.5, pointerEvents: "none",
                        }}>📧</span>
                        <input
                            className="input-field"
                            type="email" placeholder="Email Address"
                            value={email} onChange={e => setEmail(e.target.value)}
                            onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                            style={{
                                paddingLeft: 44,
                                background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                                borderColor: focused === "email" ? T.accent : T.border,
                                color: T.text,
                                boxShadow: focused === "email" ? `0 0 0 3px ${T.accent}20` : "none",
                            }}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <span style={{
                            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                            fontSize: "1rem", opacity: 0.5, pointerEvents: "none",
                        }}>🔒</span>
                        <input
                            className="input-field"
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            value={password} onChange={e => setPassword(e.target.value)}
                            onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                            style={{
                                paddingLeft: 44, paddingRight: 44,
                                background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)",
                                borderColor: focused === "pass" ? T.accent : T.border,
                                color: T.text,
                                boxShadow: focused === "pass" ? `0 0 0 3px ${T.accent}20` : "none",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            style={{
                                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: "1rem", opacity: 0.5, padding: 2,
                                transition: "opacity 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
                        >
                            {showPass ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>


                {/* ── Submit ── */}
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || success}
                    style={{
                        marginTop: 22,
                        background: loading || success
                            ? isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"
                            : `linear-gradient(135deg, ${T.accent} 0%, ${T.orb1} 100%)`,
                        color: loading || success ? T.text : (isLight ? "#fff" : "#080612"),
                        boxShadow: loading || success ? "none" : `0 10px 30px ${T.accent}40`,
                        opacity: loading || success ? 0.7 : 1,
                    }}
                >
                    {loading ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            <span style={{
                                width: 18, height: 18, border: `2px solid ${T.accent}40`,
                                borderTopColor: T.accent, borderRadius: "50%",
                                display: "inline-block",
                                animation: "spin 0.7s linear infinite",
                            }} />
                            Signing you in…
                        </span>
                    ) : success ? (
                        "✓ You're all set!"
                    ) : mode === "login" ? (
                        "Sign In"
                    ) : (
                        "Create Account"
                    )}
                </button>

                {/* ── Password strength (signup) ── */}
                {mode === "signup" && password.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    flex: 1, height: 3, borderRadius: 2,
                                    background: password.length >= i * 3
                                        ? i <= 1 ? "#EF4444"
                                            : i === 2 ? "#F59E0B"
                                                : i === 3 ? "#10B981"
                                                    : T.accent
                                        : isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)",
                                    transition: "background 0.3s",
                                }} />
                            ))}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: T.text, opacity: 0.4 }}>
                            {password.length < 3 ? "Too weak" : password.length < 6 ? "Weak" : password.length < 9 ? "Good" : "Strong 💪"}
                        </div>
                    </div>
                )}

                {/* ── Footer note ── */}
                <p style={{ textAlign: "center", fontSize: "0.75rem", color: T.text, opacity: 0.35, marginTop: 24, lineHeight: 1.6 }}>
                    {mode === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <span
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        style={{ color: T.accent, fontWeight: 700, cursor: "pointer", opacity: 1 }}
                    >
                        {mode === "login" ? "Create Vault →" : "Sign In →"}
                    </span>
                </p>

            </form>

            {/* ── Branding footer ── */}
            <div style={{
                position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
                fontSize: "0.72rem", opacity: 0.3, color: T.text,
                fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
                transition: "color 0.6s ease",
            }}>
                Paise Bachaao · Simplified Money Tracking · Built by Sanmaya
            </div>
        </div>
    );
}
