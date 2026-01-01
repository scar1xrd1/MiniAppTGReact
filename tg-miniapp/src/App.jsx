import { useEffect, useMemo, useState } from "react";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [localClicks, setLocalClicks] = useState(0);
  const [sentClicks, setSentClicks] = useState(0);
  const [status, setStatus] = useState("Ожидаю...");
  const [pulse, setPulse] = useState(false);

  const sessionId = useMemo(() => uid(), []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  const localTest = () => {
    setLocalClicks((c) => c + 1);
    setStatus("✅ Локальный клик (Mini App не должен закрываться)");
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");

    setPulse(true);
    setTimeout(() => setPulse(false), 220);
  };

  const sendToBot = () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      alert("Открой внутри Telegram.");
      return;
    }

    const payload = {
      type: "CLICK_TEST",
      eventId: uid(),
      sessionId,
      localClicks: localClicks + 1,
      sentClicks: sentClicks + 1,
      ts: new Date().toISOString()
    };

    setSentClicks((c) => c + 1);
    setStatus("📨 Отправляю в бот...");
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");

    setPulse(true);
    setTimeout(() => setPulse(false), 220);

    tg.sendData(JSON.stringify(payload));
  };

  const glow = pulse ? "0 0 0 1px rgba(255,255,255,.25), 0 0 45px rgba(46,230,210,.35), 0 0 90px rgba(29,134,255,.20)" :
    "0 0 0 1px rgba(255,255,255,.18), 0 0 35px rgba(46,230,210,.22), 0 0 70px rgba(29,134,255,.14)";

  return (
    <div style={styles.page}>
      {/* Animated background blobs */}
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />
      <div style={{ ...styles.blob, ...styles.blob3 }} />

      <div style={{ ...styles.card, boxShadow: glow }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            <div style={styles.logoCore} />
            <div style={styles.logoRing} />
          </div>
          <div>
            <div style={styles.title}>Mini App тест</div>
            <div style={styles.subtitle}>Сияющий тест кликов + отправка события в бота</div>
          </div>
        </div>

        {/* Stats pills */}
        <div style={styles.pills}>
          <div style={styles.pill}>
            <div style={styles.pillLabel}>Локальные клики</div>
            <div style={styles.pillValue}>{localClicks}</div>
          </div>
          <div style={styles.pill}>
            <div style={styles.pillLabel}>Отправлено в бот</div>
            <div style={styles.pillValue}>{sentClicks}</div>
          </div>
        </div>

        {/* Mini chart decor */}
        <div style={styles.chartWrap}>
          <svg width="100%" height="86" viewBox="0 0 320 86" style={styles.chart}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="rgba(46,230,210,0.9)" />
                <stop offset="1" stopColor="rgba(29,134,255,0.85)" />
              </linearGradient>
              <linearGradient id="gFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(46,230,210,0.35)" />
                <stop offset="1" stopColor="rgba(29,134,255,0.05)" />
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* grid */}
            <g opacity="0.22" stroke="rgba(255,255,255,0.55)">
              <line x1="0" y1="18" x2="320" y2="18" />
              <line x1="0" y1="42" x2="320" y2="42" />
              <line x1="0" y1="66" x2="320" y2="66" />
            </g>

            {/* area */}
            <path
              d="M0 70 C40 52 64 58 92 44 C122 28 142 36 170 26 C206 12 232 18 256 10 C282 2 300 10 320 4 L320 86 L0 86 Z"
              fill="url(#gFill)"
            />
            {/* line */}
            <path
              d="M0 70 C40 52 64 58 92 44 C122 28 142 36 170 26 C206 12 232 18 256 10 C282 2 300 10 320 4"
              fill="none"
              stroke="url(#g1)"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* dot */}
            <circle cx="256" cy="10" r="5.5" fill="rgba(255,255,255,0.95)" filter="url(#glow)" />
          </svg>

          <div style={styles.sessionLine}>
            <span style={styles.badge}>session</span>
            <code style={styles.code}>{sessionId}</code>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={localTest}
          style={{
            ...styles.btn,
            ...styles.btnPrimary,
            transform: pulse ? "translateY(-1px) scale(1.005)" : "translateY(0) scale(1)"
          }}
        >
          <span style={styles.btnIcon}>✨</span>
          Локальный тест (клик #{localClicks + 1})
          <span style={styles.btnHint}>не закрывает</span>
        </button>

        <button
          onClick={sendToBot}
          style={{
            ...styles.btn,
            ...styles.btnSecondary
          }}
        >
          <span style={styles.btnIcon}>🚀</span>
          Отправить событие боту (#{sentClicks + 1})
          <span style={styles.btnHint}>sendData</span>
        </button>

        {/* Status */}
        <div style={styles.statusRow}>
          <span style={styles.statusDot} />
          <div style={styles.statusText}>{status}</div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerChip}>Glow UI</span>
          <span style={styles.footerSep}>•</span>
          <span style={styles.footerMuted}>Работает внутри Telegram WebApp</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(1200px 800px at 10% 10%, rgba(46,230,210,0.35), transparent 55%)," +
      "radial-gradient(900px 700px at 90% 20%, rgba(29,134,255,0.35), transparent 60%)," +
      "radial-gradient(800px 700px at 60% 95%, rgba(130,87,255,0.25), transparent 60%)," +
      "linear-gradient(135deg, #071432, #071a3d 35%, #06122a)",
    color: "rgba(255,255,255,0.92)",
    position: "relative",
    overflow: "hidden"
  },

  blob: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    filter: "blur(40px)",
    opacity: 0.6,
    animation: "float 8s ease-in-out infinite",
    pointerEvents: "none"
  },
  blob1: {
    left: -120,
    top: -120,
    background: "radial-gradient(circle at 30% 30%, rgba(46,230,210,0.85), rgba(46,230,210,0.05))"
  },
  blob2: {
    right: -140,
    top: 30,
    background: "radial-gradient(circle at 30% 30%, rgba(29,134,255,0.9), rgba(29,134,255,0.05))",
    animationDelay: "1.2s"
  },
  blob3: {
    left: 90,
    bottom: -170,
    background: "radial-gradient(circle at 30% 30%, rgba(130,87,255,0.75), rgba(130,87,255,0.05))",
    animationDelay: "2.1s"
  },

  card: {
    width: "min(440px, 100%)",
    borderRadius: 24,
    padding: 18,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)"
  },

  header: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 14
  },

  logoWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    position: "relative",
    background:
      "linear-gradient(135deg, rgba(46,230,210,0.25), rgba(29,134,255,0.22))",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.10), 0 16px 40px rgba(0,0,0,0.35)"
  },
  logoCore: {
    position: "absolute",
    inset: 10,
    borderRadius: 12,
    background: "linear-gradient(135deg, rgba(46,230,210,0.95), rgba(29,134,255,0.90))",
    boxShadow: "0 0 22px rgba(46,230,210,0.32), 0 0 40px rgba(29,134,255,0.18)"
  },
  logoRing: {
    position: "absolute",
    inset: 6,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.22)"
  },

  title: { fontSize: 20, fontWeight: 900, letterSpacing: 0.2 },
  subtitle: { fontSize: 12.5, opacity: 0.72, marginTop: 2 },

  pills: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 12
  },
  pill: {
    borderRadius: 16,
    padding: "10px 12px",
    background: "rgba(0,0,0,0.14)",
    border: "1px solid rgba(255,255,255,0.12)"
  },
  pillLabel: { fontSize: 11.5, opacity: 0.70 },
  pillValue: { fontSize: 20, fontWeight: 900, marginTop: 2 },

  chartWrap: {
    borderRadius: 18,
    padding: 12,
    background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(0,0,0,0.10))",
    border: "1px solid rgba(255,255,255,0.12)",
    marginBottom: 12
  },
  chart: { display: "block" },

  sessionLine: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap"
  },
  badge: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)"
  },
  code: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 10,
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)"
  },

  btn: {
    width: "100%",
    padding: "14px 14px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.14)",
    fontWeight: 900,
    fontSize: 15.5,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    transition: "transform 120ms ease, filter 120ms ease",
    userSelect: "none"
  },
  btnPrimary: {
    background:
      "linear-gradient(135deg, rgba(46,230,210,0.92), rgba(29,134,255,0.86))",
    color: "rgba(255,255,255,0.98)",
    boxShadow: "0 18px 45px rgba(29,134,255,0.18), 0 10px 30px rgba(46,230,210,0.14)",
    marginBottom: 10
  },
  btnSecondary: {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(0,0,0,0.10))",
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.28)"
  },
  btnIcon: { width: 24, textAlign: "center" },
  btnHint: {
    fontSize: 11.5,
    fontWeight: 800,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.16)",
    border: "1px solid rgba(255,255,255,0.14)",
    opacity: 0.92,
    whiteSpace: "nowrap"
  },

  statusRow: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.10)"
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "linear-gradient(135deg, rgba(46,230,210,1), rgba(29,134,255,1))",
    boxShadow: "0 0 18px rgba(46,230,210,0.35), 0 0 28px rgba(29,134,255,0.18)"
  },
  statusText: { fontSize: 13.5, opacity: 0.88 },

  footer: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: 0.75,
    fontSize: 12
  },
  footerChip: {
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
    fontWeight: 800
  },
  footerSep: { opacity: 0.6 },
  footerMuted: { opacity: 0.8 }
};
