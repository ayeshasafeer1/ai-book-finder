type HealthData = {
    id: number;
    title: string;
    completed: boolean;
  };
  
  async function getHealthData(): Promise<HealthData> {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1",
      {
        cache: "no-store",
      }
    );
  
    if (!response.ok) {
      throw new Error("Health API is unavailable");
    }
  
    return response.json();
  }
  
  export default async function HealthPage() {
    const data = await getHealthData();
  
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Health Check
        </h1>
  
        <div className="mt-6 rounded-lg border border-[var(--border)] p-6">
          <p className="font-medium">
            ✓ Application is running
          </p>
  
          <p className="mt-2 text-[var(--muted)]">
            External API is reachable.
          </p>
  
          <div className="mt-6">
            <p className="text-sm text-[var(--muted)]">
              Fetched data:
            </p>
  
            <p className="mt-2 font-medium">
              {data.title}
            </p>
  
            <p className="mt-2 text-sm text-[var(--muted)]">
              ID: {data.id}
            </p>
  
            <p className="mt-1 text-sm text-[var(--muted)]">
              Completed: {data.completed ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </main>
    );
  }