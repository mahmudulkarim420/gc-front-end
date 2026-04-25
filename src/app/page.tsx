import { LoginForm } from '@/components/auth/LoginForm';


export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-[24px] relative w-full"
      style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #171f33 0%, #0b1326 70%)' }}
    >
      {/* Hero Background Visual (Abstract Glassmorphism) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-container/5 blur-[150px]"></div>
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[440px] flex flex-col gap-8 z-10 relative">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-xl glass-panel flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          </div>
          <div className="space-y-1">
            <h1 className="font-display-lg text-display-lg text-on-surface">
              CollabChat
            </h1>
            <p className="text-on-surface-variant font-body-lg text-body-lg opacity-70">
              Professional communication for high-stakes teams.
            </p>
          </div>
        </header>

        <LoginForm />
      </main>
    </div>
  );
}
