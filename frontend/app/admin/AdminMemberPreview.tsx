
"use client";

 

 

export type AdminPreviewMember = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  photo?: string;
  status?: string;
  
};

type Props = {
  member: AdminPreviewMember;
  onBack: () => void;
};

export default function AdminMemberPreview({
  member,
  onBack,
}: Props) {

  const stats = [
    {
      icon: "🏋️",
      label: "Total Workouts",
      value: "—",
      note: "Workout records unavailable",
    },
    {
      icon: "📅",
      label: "Days Attended",
      value: "—",
      note: "Attendance records unavailable",
    },
    {
      icon: "🔥",
      label: "Calories Burned",
      value: "—",
      note: "Workout records unavailable",
    },
    {
      icon: "🏆",
      label: "Current Streak",
      value: "—",
      note: "Attendance records unavailable",
    },
  ];

  return (
    <div className="space-y-6 text-[#28171A]">
      {/* ADMIN BACK BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#800020]/50">
            Member Management
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#800020]">
            Member Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Viewing {member.name}'s dashboard
          </p>
        </div>

        
      </div>

      {/* WELCOME BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#160D0F] via-[#48121E] to-[#791D35] p-7 text-white md:p-10">
        <div className="relative z-10 max-w-xl">
          <p className="text-lg text-white/80">Welcome Back,</p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#E69BA5] md:text-5xl">
            {member.name}!
          </h2>

          <p className="mt-4 text-white/80">
            Member dashboard preview from the admin panel.
          </p>

          <a
            href="#admin-member-membership"
            className="mt-6 inline-block rounded-full bg-[#7C1A31] px-6 py-3 font-semibold transition hover:bg-[#A02A46]"
          >
            View Membership →
          </a>
        </div>

        <div className="absolute bottom-[-30px] right-10 hidden text-[150px] opacity-10 md:block">
          🏋️
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E8D8CF] bg-[#FFFDF9] p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{stat.icon}</span>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-[#641629]">
                  {stat.value}
                </h3>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">{stat.note}</p>
          </div>
        ))}
      </section>

      {/* MEMBERSHIP + PROFILE */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div
          id="admin-member-membership"
          className="overflow-hidden rounded-2xl border border-[#E8D8CF] bg-[#FFFDF9] shadow-sm"
        >
          <div className="bg-gradient-to-r from-[#641629] to-[#831F3C] px-6 py-4 text-white">
            <h2 className="text-lg font-bold">♛ My Membership</h2>
          </div>

          <div className="flex min-h-[220px] items-center gap-5 p-6">
            <div className="text-6xl text-[#641629]">🏅</div>

            
          </div>
        </div>

        {/* MEMBER PROFILE */}
        <div className="overflow-hidden rounded-2xl border border-[#E8D8CF] bg-[#FFFDF9] shadow-sm">
          <div className="bg-gradient-to-r from-[#641629] to-[#831F3C] px-6 py-4 text-white">
            <h2 className="text-lg font-bold">♙ Member Profile</h2>
          </div>

          <div className="space-y-4 p-6">
            <ProfileRow label="Full Name" value={member.name} />
            <ProfileRow label="Email" value={member.email} />
            <ProfileRow label="Phone" value={member.phone || "Not provided"} />
             
            <ProfileRow
              label="Account Status"
              value={member.status || "Unknown"}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-[#E8D8CF] bg-[#FFFDF9]">
          <SectionHeader title="▦ Upcoming Classes" />
          <div className="p-6 text-center">
            <div className="text-4xl">📅</div>
            <p className="mt-3 font-semibold">
              Classes API not connected yet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Classes scheduled by the trainer will appear here when the
              classes feature is implemented.
            </p>
          </div>
        </div>

      
      </section>

      {/* QUICK ACTIONS */}
      <section className="overflow-hidden rounded-2xl border border-[#E8D8CF] bg-[#FFFDF9]">
        <SectionHeader title="⚡ Quick Actions" />

        <div className="grid grid-cols-2 gap-4 p-5 md:grid-cols-4">
          {[
            ["🏋️", "Workouts"],
            ["🥗", "Diet Plan"],
            ["📅", "Attendance"],
            ["👤", "Profile"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="rounded-xl border border-[#E8D8CF] bg-[#FAF0E9] p-6 text-center"
            >
              <div className="text-3xl">{icon}</div>
              <p className="mt-3 font-semibold">{label}</p>
              <p className="mt-1 text-xs text-gray-400">Coming soon</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-gradient-to-r from-[#641629] to-[#831F3C] px-6 py-4 text-white">
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#F0E5DF] pb-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-semibold text-[#641629]">
        {value}
      </span>
    </div>
  );
}
