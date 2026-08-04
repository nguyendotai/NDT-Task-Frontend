const ROLES = [
  { name: "Owner", description: "Toàn quyền quản trị Workspace", value: 100 },
  { name: "Admin", description: "Quản lý Board, Member, Setting", value: 80 },
  { name: "Member", description: "Tạo, sửa và cập nhật Task", value: 55 },
];

export function RoleBasedAccess() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-blue-500">SECURITY & PERMISSIONS</p>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Role-based access control for teams that need clarity and trust.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cấp đúng quyền cho đúng người — từ Owner toàn quyền quản trị đến Member
            chỉ thao tác trong phạm vi được giao.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
          <div className="flex flex-col gap-5">
            {ROLES.map((role) => (
              <div key={role.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{role.name}</span>
                  <span className="text-muted-foreground">{role.value}%</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{role.description}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    style={{ width: `${role.value}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
