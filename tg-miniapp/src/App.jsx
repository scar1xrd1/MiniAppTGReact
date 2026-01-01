import { useEffect, useState } from "react";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [localClicks, setLocalClicks] = useState(0);
  const [sentClicks, setSentClicks] = useState(0);
  const [status, setStatus] = useState("Ожидаю...");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  const localTest = () => {
    setLocalClicks((c) => c + 1);
    setStatus("✅ Локальный клик (Mini App не должен закрываться)");
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
      localClicks: localClicks + 1,
      sentClicks: sentClicks + 1,
      ts: new Date().toISOString()
    };

    setSentClicks((c) => c + 1);
    setStatus("📨 Отправляю в бот...");

    tg.sendData(JSON.stringify(payload));

    // НЕ вызываем tg.close()
    // Некоторые клиенты всё равно могут закрыть — поэтому локальная кнопка выше для проверки.
  };

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
      <h2>Mini App тест</h2>

      <button
        onClick={localTest}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 14,
          border: "none",
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer",
          marginBottom: 12
        }}
      >
        ✅ Локальный тест (клик #{localClicks + 1})
      </button>

      <button
        onClick={sendToBot}
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
        📨 Отправить событие боту (#{sentClicks + 1})
      </button>

      <p style={{ marginTop: 12, opacity: 0.8 }}>{status}</p>
    </div>
  );
}
