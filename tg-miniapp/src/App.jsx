import { useEffect, useMemo, useState } from "react";

function uid() {
  // простой уникальный id без библиотек
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [clickCount, setClickCount] = useState(0);
  const sessionId = useMemo(() => uid(), []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  const sendClick = () => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      alert("Открой это внутри Telegram (в браузере SDK нет).");
      return;
    }

    const payload = {
      type: "CLICK_TEST",
      eventId: uid(),
      sessionId,
      clickCount: clickCount + 1,
      ts: new Date().toISOString()
    };

    tg.sendData(JSON.stringify(payload));
    setClickCount((c) => c + 1);

    // Если хочешь закрывать миниапп после клика — раскомментируй:
    // tg.close();
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
      <h2>Mini App тест клика</h2>

      <button
        onClick={sendClick}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 14,
          border: "none",
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        ✅ Отправить CLICK_TEST (клик #{clickCount + 1})
      </button>

      <p style={{ opacity: 0.7, marginTop: 12 }}>
        sessionId: <code>{sessionId}</code>
      </p>
    </div>
  );
}
