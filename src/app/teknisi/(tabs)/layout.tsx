import { BottomNav } from "@/components/teknisi/BottomNav";

export default function TeknisiTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <div className="flex-1 pb-6">{children}</div>
      <BottomNav />
    </div>
  );
}
