'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full px-6 py-6 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/8 backdrop-blur-2xl border-b border-white/20 shadow-2xl'
          : 'bg-white/5 backdrop-blur-2xl border-b border-white/15'
      }`}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-widest">
          <span className={`transition-all duration-300 ${isScrolled ? 'text-white' : 'text-white/80'}`}>
            NEXUS
          </span>
        </div>
        <ul className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          <li>
            <a
              href="#"
              className={`text-sm font-medium tracking-wider transition-all duration-300 ${
                isScrolled ? 'text-white/80 hover:text-white' : 'text-white/50 hover:text-white/70'
              }`}
            >
              ABOUT
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`text-sm font-medium tracking-wider transition-all duration-300 ${
                isScrolled ? 'text-white/80 hover:text-white' : 'text-white/50 hover:text-white/70'
              }`}
            >
              SERVICES
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`text-sm font-medium tracking-wider transition-all duration-300 ${
                isScrolled ? 'text-white/80 hover:text-white' : 'text-white/50 hover:text-white/70'
              }`}
            >
              CONTACT
            </a>
          </li>
        </ul>
        <button className={`px-6 py-2 rounded-full font-medium tracking-wider transition-all duration-300 ${
          isScrolled
            ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
            : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15'
        }`}>
          ENTER
        </button>
      </nav>
    </header>
  )
}
