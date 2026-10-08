export default function Loading() {
  return (
    <div className="bg-background font-display text-foreground">
      <main className="py-10">
        <div className="max-w-2xl">
          <div className="h-12 w-2/3 animate-pulse rounded bg-foreground/10" />
          <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-foreground/10" />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-lg bg-card p-6"
            >
              <span className="h-1 w-10 rounded bg-foreground/10" />
              <div className="mt-4 h-7 w-2/3 animate-pulse rounded bg-foreground/10" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-foreground/10" />
              <div className="mt-4 h-16 animate-pulse rounded bg-foreground/5" />
              <div className="mt-4 flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-sm bg-foreground/10" />
                <div className="h-5 w-16 animate-pulse rounded-sm bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
