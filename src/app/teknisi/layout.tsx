export default function TeknisiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-slate-200 bg-slate-50">
      {children}
    </div>
  );
}
