export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#F0F1FB]">
      {/* Persistent Shell untuk seluruh sub-segmen projects */}
      {children}
    </div>
  );
}