export function AccountStatus() {
  return (
    <div className="md:col-span-4 flex flex-col gap-6">
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-headline-md text-body-lg font-bold text-on-background mb-4">Account Status</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">2FA status</span>
            <span className="text-primary font-bold">Enabled</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Last login</span>
            <span className="text-on-surface">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Security score</span>
            <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-xl p-6 flex items-center gap-4 border-l-4 border-tertiary">
        <span className="material-symbols-outlined text-tertiary">verified_user</span>
        <div>
          <p className="font-semibold text-on-surface text-sm">Identity Verified</p>
          <p className="text-xs text-on-surface-variant">Your identity was verified on Jan 2024</p>
        </div>
      </div>
    </div>
  );
}
