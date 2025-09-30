'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface MobilityFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  end_user: string
}

export default function MobilityRegistration() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<MobilityFormData>()

  const onSubmit = async (data: MobilityFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('mobility_accounts')
        .insert({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          end_user: data.end_user,
          status: 'active'
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
          <h2 className="text-2xl font-bold text-white mb-4">Account Created Successfully!</h2>
          <p className="text-dark-300 mb-6">
            Your Mobility OS account has been created successfully. 
            You can now access advanced features and manage your installations.
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            Mobility OS Account Registration
          </h1>
          <p className="text-dark-300">
            Create your Mobility OS account to access advanced features and manage your 
            vehicle detection system installations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Account Information</h2>
            
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    {...register('first_name', { required: 'First name is required' })}
                    className="input-field pl-10"
                    placeholder="John"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    {...register('last_name', { required: 'Last name is required' })}
                    className="input-field pl-10"
                    placeholder="Doe"
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="input-field pl-10"
                    placeholder="john.doe@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <PhoneIcon className="h-5 w-5 text-dark-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    className="input-field pl-10"
                    placeholder="(555) 123-4567"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  End User Organization *
                </label>
                <input
                  {...register('end_user', { required: 'End user organization is required' })}
                  className="input-field"
                  placeholder="e.g., City of Example, State DOT, Private Company"
                />
                {errors.end_user && (
                  <p className="text-red-400 text-sm mt-1">{errors.end_user.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="card bg-dark-700">
            <h3 className="text-xl font-semibold text-white mb-4">Account Benefits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span className="text-dark-300">Access to installation management dashboard</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span className="text-dark-300">Real-time installation status updates</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span className="text-dark-300">Priority technical support</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span className="text-dark-300">Advanced reporting and analytics</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span className="text-dark-300">Direct communication with installation teams</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <span className="text-dark-300">Custom notification preferences</span>
              </div>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="card bg-dark-700">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-primary-600 bg-dark-800 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-dark-300">
                I agree to the <a href="#" className="text-primary-400 hover:text-primary-300 underline">Terms of Service</a> and 
                <a href="#" className="text-primary-400 hover:text-primary-300 underline ml-1">Privacy Policy</a>
              </label>
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
