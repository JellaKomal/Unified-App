export function DottedBackground() {
  return (
    <div
      className="absolute top-0 left-0 w-full min-h-screen pointer-events-none -z-10"
      style={{
        backgroundSize: "20px 20px",
        backgroundImage: "radial-gradient(var(--primary) 1px, transparent 1px)",
      }}
    />
  );
}