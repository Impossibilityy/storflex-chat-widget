import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <div
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          width: 380,
          height: 560,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          zIndex: 9999,
          background: "white",
        }}
      >
        <ChatWidget />
      </div>
    </div>
  );
}
