'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Home, 
  Trees, 
  PlusSquare, 
  TrendingUp,
  Wrench,
  Sparkles,
  Hammer,
  Truck,
  Bug,
  Tv,
  Activity,
  Calendar
} from 'lucide-react';

interface SubCategory {
  title: string;
  icon: React.ElementType;
  items: string[];
}

interface MainCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  subCategories: SubCategory[];
}

const serviceData: MainCategory[] = [
  {
    id: 'interior',
    title: 'Interior',
    icon: Home,
    subCategories: [
      {
        title: 'Home Repairs & Maintenance',
        icon: Wrench,
        items: ['Electrician', 'Plumber', 'Carpenter', 'Handyman', 'Locksmith', 'HVAC Service']
      },
      {
        title: 'Cleaning & Organization',
        icon: Sparkles,
        items: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Decluttering', 'Window Cleaning']
      },
      {
        title: 'Renovations & Upgrades',
        icon: Hammer,
        items: ['Kitchen Remodel', 'Bathroom Renovation', 'Flooring Installation', 'Interior Painting']
      }
    ]
  },
  {
    id: 'exterior',
    title: 'Exterior',
    icon: Trees,
    subCategories: [
      {
        title: 'Exterior Home Care',
        icon: Home,
        items: ['Roofing', 'Siding Repair', 'Gutter Cleaning', 'Pressure Washing', 'Fence Repair']
      },
      {
        title: 'Landscaping & Outdoor',
        icon: Trees,
        items: ['Lawn Mowing', 'Garden Design', 'Tree Trimming', 'Patio Construction']
      }
    ]
  },
  {
    id: 'more',
    title: 'More Services',
    icon: PlusSquare,
    subCategories: [
      {
        title: 'Moving & Logistics',
        icon: Truck,
        items: ['Local Moving', 'Long Distance', 'Packing Services', 'Storage Solutions']
      },
      {
        title: 'Installation & Assembly',
        icon: Tv,
        items: ['Holiday Light Hanging', 'TV Mounting', 'Security Camera Install', 'Furniture Assembly']
      },
      {
        title: 'Pest Control',
        icon: Bug,
        items: ['Termite Control', 'Rodent Removal', 'General Pest Spray']
      }
    ]
  },
  {
    id: 'trending',
    title: 'Trending',
    icon: TrendingUp,
    subCategories: [
      {
        title: 'Events & Planning',
        icon: Calendar,
        items: ['Party Planning', 'Catering', 'Photography', 'Decorations']
      },
      {
        title: 'Health & Wellness',
        icon: Activity,
        items: ['Personal Training', 'Yoga Instruction', 'Home Massage', 'Nutritional Coaching']
      }
    ]
  }
];

interface ServiceMenuProps {
  isOpen: boolean;
  onSelect?: (name: string, category: string) => void;
  onClose: () => void;
}

const ServiceMenu: React.FC<ServiceMenuProps> = ({ isOpen, onSelect, onClose }) => {
  const [activeMain, setActiveMain] = useState<MainCategory>(serviceData[0]);
  const [activeSub, setActiveSub] = useState<SubCategory>(serviceData[0].subCategories[0]);

  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full right-0 mt-4 w-[850px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border dark:border-gray-700 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex h-[500px]">
        {/* Column 1: Main Categories */}
        <div className="w-1/4 bg-gray-50/50 dark:bg-gray-900/30 border-r dark:border-gray-700 p-6 flex flex-col space-y-2">
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Sections</p>
          {serviceData.map((cat) => (
            <button
              key={cat.id}
              onMouseEnter={() => {
                setActiveMain(cat);
                setActiveSub(cat.subCategories[0]);
              }}
              className={`
                flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all
                ${activeMain.id === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50 font-bold'}
              `}
            >
              <div className="flex items-center space-x-3">
                <cat.icon size={18} />
                <span className="text-sm">{cat.title}</span>
              </div>
              <ChevronRight size={14} className={activeMain.id === cat.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </div>

        {/* Column 2: Sub-Categories */}
        <div className="w-1/3 border-r dark:border-gray-700 p-6 flex flex-col space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Categories</p>
          {activeMain.subCategories.map((sub) => (
            <button
              key={sub.title}
              onMouseEnter={() => setActiveSub(sub)}
              className={`
                flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all text-left
                ${activeSub.title === sub.title 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-bold'}
              `}
            >
              <div className="flex items-center space-x-3">
                <sub.icon size={18} />
                <span className="text-sm line-clamp-1">{sub.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Column 3: Detailed Items */}
        <div className="flex-1 p-8 bg-white dark:bg-gray-800 overflow-y-auto no-scrollbar">
          <div className="flex items-center space-x-3 mb-8">
             <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                <activeSub.icon size={20} />
             </div>
             <div>
                <h4 className="text-lg font-black dark:text-white leading-none">{activeSub.title}</h4>
                <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">{activeMain.title}</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {activeSub.items.map((item) => (
              <button
                key={item}
                onClick={() => onSelect?.(item, activeSub.title)}
                className="group flex items-center justify-between p-4 rounded-2xl border dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left"
              >
                <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white p-1 rounded-lg">
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border dark:border-gray-700">
             <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                All services are performed by verified professionals with the All4Home Guarantee.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMenu;
