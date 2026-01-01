import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
  }, []);

  const sendToBot = () => {
    const tg = window.Telegram.WebApp;
    tg.sendData(JSON.stringify({ action: "ping", ts: Date.now() }));
    // tg.close(); // если хочешь закрывать после отправки
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Telegram Mini App (React)</h1>
      <button onClick={sendToBot}>Отправить данные боту</button>
    </div>
  );
}
