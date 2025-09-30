'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  WrenchScrewdriverIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CalendarDaysIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="NoTraffic Logo" 
                width={180} 
                height={72}
                className="w-44 h-18 object-contain"
              />
            </div>
            <Link 
              href="/admin" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Admin Portal
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Registration Portal
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamline your NoTraffic installations and manage Mobility OS Accounts 
            with our comprehensive registration platform.
          </p>
        </div>

        {/* Registration Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Installation Registration Card */}
          <Link href="/register/installation">
            <div 
              className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl cursor-pointer transform transition-all duration-300 ${
                hoveredCard === 'installation' 
                  ? 'scale-105 shadow-2xl border-blue-500' 
                  : 'hover:scale-102 hover:shadow-xl'
              }`}
              onMouseEnter={() => setHoveredCard('installation')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Register Installation
                </h3>
                <p className="text-gray-300 mb-6">
                  Submit your NoTraffic installation details including 
                  intersection information, technical specs, and contact details.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <ChartBarIcon className="h-4 w-4" />
                    <span>Intersection Details</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span>Installation Scheduling</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Mobility OS Account Card */}
          <Link href="/register/mobility">
            <div 
              className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl cursor-pointer transform transition-all duration-300 ${
                hoveredCard === 'mobility' 
                  ? 'scale-105 shadow-2xl border-blue-500' 
                  : 'hover:scale-102 hover:shadow-xl'
              }`}
              onMouseEnter={() => setHoveredCard('mobility')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Register Mobility OS Account
                </h3>
                <p className="text-gray-300 mb-6">
                  Create your Mobility OS Account to access advanced features and 
                  manage your NoTraffic installations.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>Account Management</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Secure Access</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Real-time Tracking</h4>
              <p className="text-gray-300">
                Monitor installation progress and account status in real-time
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CalendarDaysIcon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Smart Scheduling</h4>
              <p className="text-gray-300">
                Drag-and-drop calendar for easy installation rescheduling
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h4>
              <p className="text-gray-300">
                Enterprise-grade security with encrypted data storage
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 NoTraffic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}