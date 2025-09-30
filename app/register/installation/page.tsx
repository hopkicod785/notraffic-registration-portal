'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  CloudArrowUpIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface InstallationFormData {
  intersection_name: string
  end_user: string
  distributor: string
  cabinet_type: string
  tls_connection: string
  detection_io: string
  phasing_files: FileList | null
  timing_files: FileList | null
  contact_name: string
  contact_email: string
  contact_phone: string
  estimated_install_date: string
}

const cabinetTypes = [
  'NEMA TS1',
  'NEMA TS2',
  '332',
  '335',
  '325i',
  '336',
  '332 D',
  'ATC',
  'Type B',
  'P44',
  'ITS',
  'Other'
]

const tlsConnections = [
  'NTCIP',
  'SDLC',
  'C1/C4 Harness',
  'DB25 Spade Cables',
  'None',
  'Other'
]

const detectionIO = [
  'DB37 to Spades',
  'SDLC - 15 Pin',
  'SDLC 25 to 15 Pin',
  'NTCIP',
  'Other'
]

const distributors = [
  'Orange Traffic',
  'Southwest Traffic Systems',
  'Texas Highway Products',
  'ITS',
  'CTC',
  'General Highway Products',
  'General Traffic Controls',
  'Marlin',
  'Utilicom',
  'TS&L',
  'Swarco California',
  'Swarco PNW',
  'TAPCO',
  'JTB',
  'HighAngle',
  'Paradigm',
  'TCC',
  'TSC',
  'Blackstar',
  'Direct',
  'Other'
]

export default function InstallationRegistration() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{phasing: string[], timing: string[]}>({
    phasing: [],
    timing: []
  })
  const [customValues, setCustomValues] = useState({
    cabinet_type: '',
    tls_connection: '',
    detection_io: '',
    distributor: ''
  })

  const { register, handleSubmit, formState: { errors }, watch } = useForm<InstallationFormData>()

  const handleFileUpload = async (files: FileList, type: 'phasing' | 'timing') => {
    const fileNames: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // In a real app, you'd upload to Supabase Storage
      fileNames.push(file.name)
    }
    setUploadedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileNames]
    }))
  }

  const onSubmit = async (data: InstallationFormData) => {
    setIsSubmitting(true)
    try {
      // Validate custom fields when "Other" is selected
      if (data.cabinet_type === 'Other' && !customValues.cabinet_type.trim()) {
        alert('Please specify the cabinet type when "Other" is selected.')
        setIsSubmitting(false)
        return
      }
      if (data.tls_connection === 'Other' && !customValues.tls_connection.trim()) {
        alert('Please specify the TLS connection when "Other" is selected.')
        setIsSubmitting(false)
        return
      }
      if (data.detection_io === 'Other' && !customValues.detection_io.trim()) {
        alert('Please specify the Detection I/O when "Other" is selected.')
        setIsSubmitting(false)
        return
      }
      if (data.distributor === 'Other' && !customValues.distributor.trim()) {
        alert('Please specify the distributor when "Other" is selected.')
        setIsSubmitting(false)
        return
      }

      // Use custom values if "Other" is selected
      const cabinetType = data.cabinet_type === 'Other' ? customValues.cabinet_type : data.cabinet_type
      const tlsConnection = data.tls_connection === 'Other' ? customValues.tls_connection : data.tls_connection
      const detectionIO = data.detection_io === 'Other' ? customValues.detection_io : data.detection_io
      const distributor = data.distributor === 'Other' ? customValues.distributor : data.distributor

      const { error } = await supabase
        .from('installations')
        .insert({
          intersection_name: data.intersection_name,
          end_user: data.end_user,
          distributor: distributor,
          cabinet_type: cabinetType,
          tls_connection: tlsConnection,
          detection_io: detectionIO,
          phasing_files: uploadedFiles.phasing,
          timing_files: uploadedFiles.timing,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          estimated_install_date: data.estimated_install_date,
          status: 'pending'
        })

      if (error) throw error

      setSubmitSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(`Error submitting form: ${error.message || 'Unknown error'}. Check console for details.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card max-w-md mx-auto text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Registration Successful!</h2>
          <p className="text-dark-300 mb-6">
            Your installation registration has been submitted successfully. 
            You will receive a confirmation email shortly.
          </p>
          <Link href="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Installation Registration
          </h1>
          <p className="text-dark-300">
            Please fill out all required information for your vehicle detection system installation.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Intersection Information */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Intersection Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Intersection Name *
                </label>
                <input
                  {...register('intersection_name', { required: 'Intersection name is required' })}
                  className="input-field"
                  placeholder="e.g., Main St & 1st Ave"
                />
                {errors.intersection_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.intersection_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  End User *
                </label>
                <input
                  {...register('end_user', { required: 'End user is required' })}
                  className="input-field"
                  placeholder="e.g., City of Example"
                />
                {errors.end_user && (
                  <p className="text-red-400 text-sm mt-1">{errors.end_user.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Distributor *
                </label>
                <select
                  {...register('distributor', { required: 'Distributor is required' })}
                  className="input-field"
                >
                  <option value="">Select Distributor</option>
                  {distributors.map((distributor) => (
                    <option key={distributor} value={distributor}>{distributor}</option>
                  ))}
                </select>
                {watch('distributor') === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify distributor"
                    value={customValues.distributor}
                    onChange={(e) => setCustomValues(prev => ({ ...prev, distributor: e.target.value }))}
                    className="input-field mt-2"
                    required={watch('distributor') === 'Other'}
                  />
                )}
                {errors.distributor && (
                  <p className="text-red-400 text-sm mt-1">{errors.distributor.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Technical Specifications</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Cabinet Type *
                </label>
                <select
                  {...register('cabinet_type', { required: 'Cabinet type is required' })}
                  className="input-field"
                >
                  <option value="">Select Cabinet Type</option>
                  {cabinetTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {watch('cabinet_type') === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify cabinet type"
                    value={customValues.cabinet_type}
                    onChange={(e) => setCustomValues(prev => ({ ...prev, cabinet_type: e.target.value }))}
                    className="input-field mt-2"
                    required={watch('cabinet_type') === 'Other'}
                  />
                )}
                {errors.cabinet_type && (
                  <p className="text-red-400 text-sm mt-1">{errors.cabinet_type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  TLS Connection *
                </label>
                <select
                  {...register('tls_connection', { required: 'TLS connection is required' })}
                  className="input-field"
                >
                  <option value="">Select TLS Connection</option>
                  {tlsConnections.map((connection) => (
                    <option key={connection} value={connection}>{connection}</option>
                  ))}
                </select>
                {watch('tls_connection') === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify TLS connection"
                    value={customValues.tls_connection}
                    onChange={(e) => setCustomValues(prev => ({ ...prev, tls_connection: e.target.value }))}
                    className="input-field mt-2"
                    required={watch('tls_connection') === 'Other'}
                  />
                )}
                {errors.tls_connection && (
                  <p className="text-red-400 text-sm mt-1">{errors.tls_connection.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Detection I/O *
                </label>
                <select
                  {...register('detection_io', { required: 'Detection I/O is required' })}
                  className="input-field"
                >
                  <option value="">Select Detection I/O</option>
                  {detectionIO.map((io) => (
                    <option key={io} value={io}>{io}</option>
                  ))}
                </select>
                {watch('detection_io') === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify Detection I/O"
                    value={customValues.detection_io}
                    onChange={(e) => setCustomValues(prev => ({ ...prev, detection_io: e.target.value }))}
                    className="input-field mt-2"
                    required={watch('detection_io') === 'Other'}
                  />
                )}
                {errors.detection_io && (
                  <p className="text-red-400 text-sm mt-1">{errors.detection_io.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Document Upload</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phasing Files
                </label>
                <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <CloudArrowUpIcon className="h-8 w-8 text-dark-400 mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'phasing')}
                    className="hidden"
                    id="phasing-files"
                  />
                  <label htmlFor="phasing-files" className="cursor-pointer">
                    <span className="text-primary-400 hover:text-primary-300">Click to upload</span>
                    <span className="text-dark-400"> or drag and drop</span>
                  </label>
                  <p className="text-sm text-dark-500 mt-1">PDF, DOC, DOCX, TXT files</p>
                </div>
                {uploadedFiles.phasing.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-white">Uploaded files:</p>
                    <ul className="text-sm text-dark-300">
                      {uploadedFiles.phasing.map((file, index) => (
                        <li key={index}>• {file}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Timing Files
                </label>
                <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <CloudArrowUpIcon className="h-8 w-8 text-dark-400 mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'timing')}
                    className="hidden"
                    id="timing-files"
                  />
                  <label htmlFor="timing-files" className="cursor-pointer">
                    <span className="text-primary-400 hover:text-primary-300">Click to upload</span>
                    <span className="text-dark-400"> or drag and drop</span>
                  </label>
                  <p className="text-sm text-dark-500 mt-1">PDF, DOC, DOCX, TXT files</p>
                </div>
                {uploadedFiles.timing.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-white">Uploaded files:</p>
                    <ul className="text-sm text-dark-300">
                      {uploadedFiles.timing.map((file, index) => (
                        <li key={index}>• {file}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contact Name *
                </label>
                <input
                  {...register('contact_name', { required: 'Contact name is required' })}
                  className="input-field"
                  placeholder="John Doe"
                />
                {errors.contact_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.contact_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('contact_email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field"
                  placeholder="john@example.com"
                />
                {errors.contact_email && (
                  <p className="text-red-400 text-sm mt-1">{errors.contact_email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  {...register('contact_phone', { required: 'Phone number is required' })}
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
                {errors.contact_phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.contact_phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Installation Date */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Installation Schedule</h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-white mb-2">
                Estimated Install Date *
              </label>
              <div className="relative">
                <CalendarDaysIcon className="h-5 w-5 text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  {...register('estimated_install_date', { required: 'Install date is required' })}
                  className="input-field pl-10"
                />
              </div>
              {errors.estimated_install_date && (
                <p className="text-red-400 text-sm mt-1">{errors.estimated_install_date.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
