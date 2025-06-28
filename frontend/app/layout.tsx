import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Book Review App',
  description: 'A simple book review application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          {/* Teal accent bar */}
          <div className="h-1 bg-teal-600 w-full" />
          <header className="sticky top-0 z-30 bg-white shadow-md border-b border-gray-200">
            <div className="container mx-auto px-4 py-7 flex items-center justify-between min-h-[90px]">
              <h1 className="text-3xl font-extrabold text-teal-700 tracking-tight flex items-center gap-4">
                <span role="img" aria-label="Book" className="text-4xl">📚</span> Book Review App
              </h1>
              <nav className="hidden md:flex gap-10 text-lg text-gray-700 font-semibold">
                <a href="/" className="hover:text-teal-600 transition-colors">Home</a>
                <a href="/about" className="hover:text-teal-600 transition-colors">About</a>
              </nav>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-10">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-base mt-8 shadow-inner">
            <div className="flex flex-col items-center gap-2">
              <span>
                Made with <span className="text-teal-600">♥</span> by <span className="font-semibold text-teal-700">Book Review Team</span>
              </span>
              <span className="text-xs">&copy; {new Date().getFullYear()} All rights reserved.</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
