export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-fg">Loading AutoDiagnostics AI</h2>
          <p className="text-text-secondary">Initializing AI diagnostic systems...</p>
        </div>
      </div>
    </div>
  );
}
