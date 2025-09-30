'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import InstallationCalendar from '@/components/InstallationCalendar'
import Image from 'next/image'

interface Installation {
  id: string
  intersection_name: string
  end_user: string
  distributor: string
  cabinet_type: string
  tls_connection: string
  detection_io: string
  contact_name: string
  contact_email: string
  contact_phone: string
  estimated_install_date: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
}

interface MobilityAccount {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  end_user: string
  status: 'active' | 'inactive'
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'installations' | 'mobility' | 'calendar'>('installations')
  const [installations, setInstallations] = useState<Installation[]>([])
  const [mobilityAccounts, setMobilityAccounts] = useState<MobilityAccount[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin')
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [installationsResult, mobilityResult] = await Promise.all([
        supabase.from('installations').select('*').order('created_at', { ascending: false }),
        supabase.from('mobility_accounts').select('*').order('created_at', { ascending: false })
      ])

      if (installationsResult.data) setInstallations(installationsResult.data)
      if (mobilityResult.data) setMobilityAccounts(mobilityResult.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateInstallationStatus = async (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('installations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setInstallations(prev => 
        prev.map(inst => 
          inst.id === id ? { ...inst, status } : inst
        )
      )
    } catch (error) {
      console.error('Error updating installation:', error)
    }
  }

  const updateMobilityStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('mobility_accounts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setMobilityAccounts(prev => 
        prev.map(account => 
          account.id === id ? { ...account, status } : account
        )
      )
    } catch (error) {
      console.error('Error updating mobility account:', error)
    }
  }

  const filteredInstallations = installations.filter(inst => {
    const matchesSearch = inst.intersection_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.end_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.contact_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inst.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredMobilityAccounts = mobilityAccounts.filter(account => {
    const matchesSearch = account.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.end_user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const completedInstallations = installations.filter(inst => inst.status === 'completed')

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-4">
                <Image 
                  src="/logo.png" 
                  alt="NoTraffic Logo" 
                  width={100} 
                  height={40}
                  className="w-24 h-10 object-contain"
                />
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('admin_authenticated')
                router.push('/admin')
              }}
              className="btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-600 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-dark-400">Total Installations</p>
                <p className="text-2xl font-bold text-white">{installations.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-dark-400">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {installations.filter(inst => inst.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-dark-400">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {installations.filter(inst => inst.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-dark-400">Mobility Accounts</p>
                <p className="text-2xl font-bold text-white">{mobilityAccounts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-dark-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'installations', name: 'Installations', icon: ChartBarIcon },
                { id: 'mobility', name: 'Mobility Accounts', icon: UserGroupIcon },
                { id: 'calendar', name: 'Installation Calendar', icon: CalendarDaysIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-dark-400 hover:text-white hover:border-dark-600'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="h-5 w-5 text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-10 pr-8"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'installations' && (
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Installation Registrations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-dark-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Intersection
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      End User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Install Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredInstallations.map((installation) => (
                    <tr key={installation.id} className="hover:bg-dark-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{installation.intersection_name}</div>
                        <div className="text-sm text-dark-400">{installation.distributor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {installation.end_user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{installation.contact_name}</div>
                        <div className="text-sm text-dark-400">{installation.contact_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {new Date(installation.estimated_install_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          installation.status === 'completed' 
                            ? 'bg-green-900/20 text-green-400'
                            : installation.status === 'pending'
                            ? 'bg-yellow-900/20 text-yellow-400'
                            : 'bg-red-900/20 text-red-400'
                        }`}>
                          {installation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {installation.status !== 'completed' && (
                          <button
                            onClick={() => updateInstallationStatus(installation.id, 'completed')}
                            className="text-green-400 hover:text-green-300"
                          >
                            Mark Complete
                          </button>
                        )}
                        {installation.status !== 'cancelled' && (
                          <button
                            onClick={() => updateInstallationStatus(installation.id, 'cancelled')}
                            className="text-red-400 hover:text-red-300"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'mobility' && (
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Mobility OS Accounts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-dark-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700">
                  {filteredMobilityAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-dark-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {account.first_name} {account.last_name}
                        </div>
                        <div className="text-sm text-dark-400">{account.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {account.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {account.end_user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          account.status === 'active' 
                            ? 'bg-green-900/20 text-green-400'
                            : 'bg-red-900/20 text-red-400'
                        }`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => updateMobilityStatus(account.id, account.status === 'active' ? 'inactive' : 'active')}
                          className={`${
                            account.status === 'active' 
                              ? 'text-red-400 hover:text-red-300'
                              : 'text-green-400 hover:text-green-300'
                          }`}
                        >
                          {account.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <InstallationCalendar />
        )}
      </div>
    </div>
  )
}
