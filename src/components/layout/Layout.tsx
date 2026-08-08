import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="flex h-screen gap-3 overflow-hidden bg-slate-100 p-3 font-sans dark:bg-slate-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
