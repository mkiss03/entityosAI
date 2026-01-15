export function PageTransition({ children }) {
  return <div className="min-h-screen animate-[pageIn_240ms_ease-out]">{children}</div>;
}
