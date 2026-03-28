import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookingStore {
  selectedService: any | null
  selectedProvider: any | null
  selectedDate: Date | null
  selectedTime: string | null
  bookingStep: number
  setService: (service: any) => void
  setProvider: (provider: any) => void
  setDate: (date: Date) => void
  setTime: (time: string) => void
  setStep: (step: number) => void
  resetBooking: () => void
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      selectedService: null,
      selectedProvider: null,
      selectedDate: null,
      selectedTime: null,
      bookingStep: 1,
      
      setService: (service) => set({ selectedService: service }),
      setProvider: (provider) => set({ selectedProvider: provider }),
      setDate: (date) => set({ selectedDate: date }),
      setTime: (time) => set({ selectedTime: time }),
      setStep: (step) => set({ bookingStep: step }),
      
      resetBooking: () => set({
        selectedService: null,
        selectedProvider: null,
        selectedDate: null,
        selectedTime: null,
        bookingStep: 1
      })
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        selectedService: state.selectedService,
        selectedProvider: state.selectedProvider,
        selectedDate: state.selectedDate,
        selectedTime: state.selectedTime,
        bookingStep: state.bookingStep
      })
    }
  )
)
