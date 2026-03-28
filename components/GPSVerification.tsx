'use client'

import React, { useState, useRef } from 'react'
import { Navigation, Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react'

interface GPSVerificationProps {
  bookingId: string
  onVerificationComplete: (gpsData: { lat: number; lng: number; timestamp: string }) => void
  onEvidenceUpload: (photos: string[]) => void
}

const GPSVerification: React.FC<GPSVerificationProps> = ({
  bookingId,
  onVerificationComplete,
  onEvidenceUpload
}) => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; timestamp: string } | null>(null)
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGPSVerification = async () => {
    if (!navigator.geolocation) {
      alert('GPS is not supported by your browser')
      return
    }

    setIsVerifying(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const timestamp = new Date().toISOString()
        
        const gpsInfo = {
          lat: latitude,
          lng: longitude,
          timestamp
        }
        
        setGpsData(gpsInfo)
        
        // Send GPS data to server
        try {
          const response = await fetch('/api/bookings/gps-checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              lat: latitude,
              lng: longitude,
              timestamp
            })
          })
          
          if (response.ok) {
            onVerificationComplete(gpsInfo)
          }
        } catch (error) {
          console.error('GPS verification failed:', error)
        } finally {
          setIsVerifying(false)
        }
      },
      (error) => {
        console.error('GPS error:', error)
        setIsVerifying(false)
        alert('Failed to get GPS location. Please enable location services.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleFileUpload = async (files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bookingId', bookingId)

      try {
        const response = await fetch('/api/upload/evidence', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          return data.url
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
      return null
    })

    setUploadProgress(0)
    const uploadedUrls = await Promise.all(uploadPromises)
    const validUrls = uploadedUrls.filter(url => url !== null) as string[]
    
    setEvidencePhotos(prev => [...prev, ...validUrls])
    onEvidenceUpload(validUrls)
    setUploadProgress(100)
    
    setTimeout(() => setUploadProgress(0), 1000)
  }

  const removePhoto = (index: number) => {
    setEvidencePhotos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl">
      <div>
        <h3 className="text-lg font-bold dark:text-white mb-4">Job Verification</h3>
        
        {/* GPS Verification Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Navigation className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium dark:text-white">GPS Check-in</h4>
          </div>
          
          {gpsData ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-400">
                  Location Verified
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Lat: {gpsData.lat.toFixed(6)}</p>
                <p>Lng: {gpsData.lng.toFixed(6)}</p>
                <p>Time: {new Date(gpsData.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verify your location to confirm you've arrived at the job site
              </p>
              <button
                onClick={handleGPSVerification}
                disabled={isVerifying}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Getting Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Check In Now</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Evidence Upload Section */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Camera className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium dark:text-white">Evidence Photos</h4>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
              
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Upload before and after photos
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Select Photos
                </button>
              </div>
              
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Photo Preview */}
            {evidencePhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {evidencePhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                Important Instructions
              </h5>
              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                <li>Check in when you arrive at the job location</li>
                <li>Take clear photos of the work area before starting</li>
                <li>Take photos of the completed work</li>
                <li>Include any special requirements or issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GPSVerification
