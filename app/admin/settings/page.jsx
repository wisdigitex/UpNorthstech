"use client";

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-5 py-10 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Settings
        </h1>

        <p className="text-gray-400 mb-10">
          Manage website, account, notification and system settings.
        </p>

        <div className="grid gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h2 className="text-2xl font-black mb-5">
              Website Settings
            </h2>

            <div className="space-y-5">
              <input
                placeholder="Website Name"
                defaultValue="UpNorth Tech"
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <input
                placeholder="Website Email"
                defaultValue="info@upnorthstech.com"
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <input
                placeholder="Phone Number"
                defaultValue="+2347035001858"
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h2 className="text-2xl font-black mb-5">
              Admin Account
            </h2>

            <div className="space-y-5">
              <input
                placeholder="Admin Name"
                defaultValue="Admin"
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <input
                placeholder="Admin Email"
                defaultValue="sulaimonganiyu315@gmail.com"
                className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
            <h2 className="text-2xl font-black mb-5">
              Notification Settings
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4">
                <span>Email notification for new messages</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4">
                <span>Email notification for new project requests</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label className="flex items-center justify-between bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4">
                <span>Client signup alerts</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </div>

          <button className="bg-orange-500 text-black py-5 rounded-2xl font-black hover:scale-[1.01] transition">
            Save Settings
          </button>
        </div>
      </div>
    </main>
  );
}