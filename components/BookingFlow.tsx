'use client'

import React, { useState } from 'react'
import { useBookingStore } from '../lib/stores/bookingStore'
import { Calendar, Clock, MapPin, CreditCard, CheckCircle, ArrowRight } from 'lucide-react'

interface BookingFlowProps {
  onBookingComplete: (bookingId: string) => void
}

const BookingFlow: React.FC<BookingFlowProps> = ({ onBookingComplete }) => {
  const { 
    selectedService, 
    selectedProvider, 
    selectedDate, 
    selectedTime, 
    bookingStep,
    setService,
    setProvider,
    setDate,
    setTime,
    setStep
  } = useBookingStore()

  const [isProcessing, setIsProcessing] = useState(false)

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  const handlePayment = async () => {
    if (!selectedService || !selectedProvider || !selectedDate || !selectedTime) {
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          providerId: selectedProvider.id,
          scheduledTime: new Date(`${selectedDate.toDateString()} ${selectedTime}`),
          totalAmount: selectedService.basePrice
        })
      })

      const data = await response.json()
      
      if (data.clientSecret) {
        // Initialize Stripe payment
        const { loadStripe } = await import('@stripe/stripe-js')
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        
        const { error } = await stripe!.confirmPayment({
          clientSecret: data.clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/booking-success`,
          },
        })

        if (error) {
          console.error('Payment failed:', error)
        } else {
          onBookingComplete(data.bookingId)
        }
      }
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold dark:text-white">Select Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service selection would go here */}
              <div className="p-6 border rounded-xl hover:border-blue-500 cursor-pointer">
                <h4 className="font-bold dark:text-white">Home Cleaning</h4>
                <p className="text-gray-500">Professional cleaning services</p>
                <p className="text-lg font-bold text-green-600 mt-2">$50/hr</p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold dark:text-white">Choose Provider</h3>
            <div className="space-y-4">
              {/* Provider selection would go here */}
              <div className="p-6 border rounded-xl hover:border-blue-500 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full"></div>
                  <div>
                    <h4 className="font-bold dark:text-white">Sarah Johnson</h4>
                    <p className="text-gray-500">Professional Cleaner</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="ml-2 text-sm">4.9 (128 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold dark:text-white">Select Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  onChange={(e) => setDate(new Date(e.target.value))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setTime(time)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'dark:bg-gray-800 dark:border-gray-700 dark:text-white hover:border-blue-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold dark:text-white">Payment & Confirmation</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h4 className="font-bold dark:text-white mb-4">Booking Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service:</span>
                  <span className="font-medium dark:text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Provider:</span>
                  <span className="font-medium dark:text-white">{selectedProvider?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium dark:text-white">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium dark:text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="font-medium dark:text-white flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Your Address
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${selectedService?.basePrice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Secure Escrow Payment</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Payment held securely until job completion is confirmed by both parties
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step <= bookingStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {step < bookingStep ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-full h-1 mx-2 ${
                    step < bookingStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Service</span>
          <span>Provider</span>
          <span>Schedule</span>
          <span>Payment</span>
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-8">
        {bookingStep > 1 && (
          <button
            onClick={() => setStep(bookingStep - 1)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Previous
          </button>
        )}
        
        {bookingStep < 4 ? (
          <button
            onClick={() => setStep(bookingStep + 1)}
            className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Booking
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default BookingFlow
