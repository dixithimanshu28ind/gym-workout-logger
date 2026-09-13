export default function PageSkeleton() {
  return (
    <div className="flex-1 w-full px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-card-border" />
        <div className="h-24 rounded-2xl bg-card-border" />
        <div className="h-16 rounded-2xl bg-card-border" />
        <div className="h-16 rounded-2xl bg-card-border" />
      </div>
    </div>
  );
}
