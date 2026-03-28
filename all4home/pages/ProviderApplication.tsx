
import React, { useState } from 'react';
import { db } from '../services/mockDb';
import { VerificationStatus, User } from '../types';
import { 
  Upload, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  Camera, 
  Zap, 
  Briefcase, 
  Award, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Trash2
} from 'lucide-react';

interface ProviderApplicationProps {
  user: User;
  onSuccess: () => void;
}

const ProviderApplication: React.FC<ProviderApplicationProps> = ({ user, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Cleaning',
    description: '',
    pricePerHour: 30,
    idDocumentUrl: '',
    address: 'Los Angeles, CA',
    certificates: [] as string[]
  });

  const handleFileUpload = (type: 'id' | 'cert') => {
    // Mock file upload delay
    setLoading(true);
    setTimeout(() => {
      if (type === 'id') {
        setFormData(prev => ({ ...prev, idDocumentUrl: 'https://picsum.photos/seed/id/400/300' }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          certificates: [...prev.certificates, `https://picsum.photos/seed/cert${prev.certificates.length}/400/300`] 
        }));
      }
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.applyAsProvider({
        userId: user.id,
        category: formData.category,
        description: formData.description,
        pricePerHour: formData.pricePerHour,
        idDocumentUrl: formData.idDocumentUrl,
        certificateUrls: formData.certificates,
      });
      setStep(4); // Success state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-12 rounded-[3rem] text-center shadow-2xl border dark:border-gray-700 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black dark:text-white mb-4 tracking-tight">Application Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed">
          Great work! Our team is currently reviewing your professional profile and documents. You'll receive a notification and an email once your verified status is active.
        </p>
        <button 
          onClick={onSuccess}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/25"
        >
          Go to Provider Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Progress Stepper */}
      <div className="mb-12 flex items-center justify-between px-4">
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center space-y-3 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${
                step === i ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110' : 
                step > i ? 'bg-green-500 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-400 border dark:border-gray-700'
              }`}>
                {step > i ? <CheckCircle size={24} /> : i}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step === i ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                {i === 1 ? 'Business' : i === 2 ? 'Credentials' : 'Identity'}
              </span>
            </div>
            {i < 3 && (
              <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-700 ease-in-out" 
                  style={{ width: step > i ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border dark:border-gray-700 overflow-hidden">
        <div className="p-10 md:p-14">
          <header className="mb-12">
            <h2 className="text-3xl font-black dark:text-white tracking-tight">
              {step === 1 ? 'Business Information' : step === 2 ? 'Professional Credentials' : 'Identity Verification'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              {step === 1 ? 'Tell us about the home services you provide.' : 
               step === 2 ? 'Upload certificates or trade licenses to earn your trust badge.' : 
               'Help us maintain a safe platform by verifying your identity.'}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Service Category</label>
                    <div className="relative group">
                       <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                        <select 
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all appearance-none"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          <option>Cleaning</option>
                          <option>Plumbing</option>
                          <option>Electrical</option>
                          <option>Gardening</option>
                          <option>Handyman</option>
                          <option>Locksmith</option>
                        </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Base Rate ($/hr)</label>
                    <div className="relative group">
                       <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                        <input 
                          type="number"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all"
                          value={formData.pricePerHour}
                          onChange={(e) => setFormData({...formData, pricePerHour: parseInt(e.target.value)})}
                        />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Service Area</label>
                  <div className="relative group">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                      <input 
                        type="text"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all"
                        placeholder="e.g. San Francisco, CA"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Bio</label>
                  <textarea 
                    rows={4}
                    className="w-full p-6 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all resize-none"
                    placeholder="Describe your tools, experience, and why customers should choose you..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.certificates.map((cert, i) => (
                    <div key={i} className="group relative rounded-3xl overflow-hidden border dark:border-gray-700 aspect-video bg-gray-100 dark:bg-gray-900">
                      <img src={cert} className="w-full h-full object-cover" alt="Certificate" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, certificates: prev.certificates.filter((_, idx) => idx !== i) }))}
                          className="bg-red-600 text-white p-3 rounded-xl hover:scale-110 transition-transform"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    onClick={() => handleFileUpload('cert')}
                    disabled={loading}
                    className="flex flex-col items-center justify-center aspect-video border-4 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-gray-400 group"
                  >
                    {loading ? <Zap className="animate-spin text-blue-600" size={32} /> : (
                      <>
                        <Award size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Add Certificate</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start space-x-4">
                  <ShieldCheck className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                  <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                    <strong>Why upload certificates?</strong> Verified licenses can increase your booking requests by up to 40%. Our team manually checks each document for validity.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                {!formData.idDocumentUrl ? (
                  <div 
                    onClick={() => handleFileUpload('id')}
                    className="border-4 border-dashed border-gray-100 dark:border-gray-700 rounded-[3rem] p-16 text-center hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/40 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      {loading ? <Zap className="animate-spin" size={32} /> : <Camera size={32} />}
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">Upload Government ID</h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Passport, Driver's License or National ID (Front & Back)</p>
                  </div>
                ) : (
                  <div className="relative rounded-[3rem] overflow-hidden border dark:border-gray-700 shadow-xl">
                    <img src={formData.idDocumentUrl} className="w-full h-72 object-cover" alt="ID Document" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                       <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, idDocumentUrl: '' }))}
                        className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-xl font-bold hover:bg-white/40 transition-all text-sm"
                       >
                         Re-upload
                       </button>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border dark:border-gray-700 text-center">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By submitting, you agree to our Professional Terms of Service and Background Check Policy. All data is encrypted and handled according to GDPR/CCPA standards.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t dark:border-gray-700">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-8 py-5 rounded-2xl font-black hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft size={20} />
                  <span>Back</span>
                </button>
              )}
              
              <button 
                type={step === 3 ? 'submit' : 'button'}
                onClick={() => step < 3 && setStep(step + 1)}
                disabled={loading || (step === 3 && !formData.idDocumentUrl)}
                className={`
                  flex-[2] py-5 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all shadow-xl
                  ${(step === 3 && !formData.idDocumentUrl) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'}
                `}
              >
                {loading ? <Zap className="animate-spin" /> : step === 3 ? <FileText size={20} /> : <ChevronRight size={20} />}
                <span>{loading ? 'Processing...' : step === 3 ? 'Finish Application' : 'Next Step'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderApplication;
