import { Outlet } from 'react-router'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 font-sans dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 overflow-auto px-3 pt-10 pb-3">
        <div className="mx-auto flex min-h-full max-w-[1600px] flex-col rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Outlet />
        </div>
      </main>
    </div>
  )
}