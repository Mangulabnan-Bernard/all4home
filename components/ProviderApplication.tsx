'use client'

import React, { useState } from 'react'
import { Upload, FileText, Award, MapPin, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'

interface ProviderApplicationProps {
  userId: string
  onApplicationComplete: () => void
}

const ProviderApplication: React.FC<ProviderApplicationProps> = ({
  userId,
  onApplicationComplete
}) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    price: '',
    serviceArea: '',
    workingHours: '',
    idDocument: null as File | null,
    certificates: [] as File[]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ id: 0, certificates: 0 })

  const categories = [
    'Cleaning',
    'Plumbing',
    'Electrical',
    'Gardening',
    'Handyman',
    'Painting',
    'HVAC',
    'Appliance Repair',
    'Moving',
    'Carpentry'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (type: 'id' | 'certificates', files: FileList) => {
    if (type === 'id') {
      setFormData(prev => ({ ...prev, idDocument: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, certificates: [...prev.certificates, ...Array.from(files)] }))
    }
  }

  const removeCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload ID document
      let idDocumentUrl = ''
      if (formData.idDocument) {
        const idFormData = new FormData()
        idFormData.append('file', formData.idDocument)
        idFormData.append('type', 'id-document')
        
        const idResponse = await fetch('/api/upload/provider-docs', {
          method: 'POST',
          body: idFormData
        })
        
        if (idResponse.ok) {
          const idData = await idResponse.json()
          idDocumentUrl = idData.url
        }
      }

      // Upload certificates
      const certificateUrls = []
      for (const certificate of formData.certificates) {
        const certFormData = new FormData()
        certFormData.append('file', certificate)
        certFormData.append('type', 'certificate')
        
        const certResponse = await fetch('/api/upload/provider-docs', {
          method: 'POST',
          body: certFormData
        })
        
        if (certResponse.ok) {
          const certData = await certResponse.json()
          certificateUrls.push(certData.url)
        }
      }

      // Submit application
      const response = await fetch('/api/providers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          category: formData.category,
          description: formData.description,
          price: parseFloat(formData.price),
          serviceArea: formData.serviceArea,
          workingHours: formData.workingHours,
          idDocumentUrl,
          certificateUrls
        })
      })

      if (response.ok) {
        onApplicationComplete()
      }
    } catch (error) {
      console.error('Application submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold dark:text-white mb-4">Become a Service Provider</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Join our network of verified professionals and start earning money on your terms.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold dark:text-white mb-6">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">
                Service Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">
                Hourly Rate ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="15"
                  max="500"
                  className="w-full pl-10 pr-3 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium dark:text-white mb-2">
              Service Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe your services, experience, and what makes you unique..."
            />
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold dark:text-white mb-6">Service Details</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                Service Area *
              </label>
              <input
                type="text"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleInputChange}
                required
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Los Angeles County, 25-mile radius"
              />
            </div>

            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">
                Working Hours *
              </label>
              <input
                type="text"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleInputChange}
                required
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Monday-Friday 9AM-6PM, Weekends 10AM-4PM"
              />
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-bold dark:text-white mb-6">Verification Documents</h3>
          
          <div className="space-y-6">
            {/* ID Document */}
            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                Government ID * (Required)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files && handleFileUpload('id', e.target.files)}
                  className="hidden"
                  id="id-upload"
                />
                <label htmlFor="id-upload" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload driver's license, passport, or state ID
                    </p>
                    {formData.idDocument && (
                      <div className="mt-3 text-sm text-green-600 font-medium">
                        ✓ {formData.idDocument.name}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Certificates */}
            <div>
              <label className="block text-sm font-medium dark:text-white mb-2">
                <Award className="inline w-4 h-4 mr-2" />
                Certifications (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload('certificates', e.target.files)}
                  className="hidden"
                  id="cert-upload"
                />
                <label htmlFor="cert-upload" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload professional certificates or licenses
                    </p>
                  </div>
                </label>
                
                {formData.certificates.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.certificates.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-sm truncate">{cert.name}</span>
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                Important Information
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                <li>All documents will be verified by our team</li>
                <li>Background check will be conducted</li>
                <li>Approval process typically takes 2-3 business days</li>
                <li>You'll receive email notification once approved</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.idDocument}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProviderApplication
