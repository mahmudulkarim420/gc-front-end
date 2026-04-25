export function AccountStatus() {
  return (
    <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
      <div className="glass-panel rounded-xl p-4 md:p-6">
        <h3 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Account Status</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-slate-400">2FA status</span>
            <span className="text-emerald-500 font-bold">Enabled</span>
          </div>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-slate-400">Last login</span>
            <span className="text-slate-200">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="text-slate-400">Security score</span>
            <div className="w-16 md:w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[85%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-xl p-4 md:p-6 flex items-center gap-3 md:gap-4 border-l-4 border-emerald-500 bg-emerald-500/5">
        <span className="material-symbols-outlined text-emerald-500 text-xl md:text-2xl">verified_user</span>
        <div>
          <p className="font-bold text-slate-200 text-xs md:text-sm">Identity Verified</p>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium">Verified on Jan 2024</p>
        </div>
      </div>
    </div>
  );
}
