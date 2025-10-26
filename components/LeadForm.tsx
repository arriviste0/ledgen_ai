import React, { useState, useEffect } from 'react';
import { LocationMarkerIcon } from './icons';
import type { Strategy } from '../services/geminiService';

type FormInitialData = Partial<Omit<Strategy, 'locations'> & { location: string }>;

interface LeadFormProps {
    onGenerate: (businessType: string, location: string, numberOfLeads: number, requirements: string, coordinates?: { latitude: number; longitude: number; }) => void;
    isLoading: boolean;
    initialData?: FormInitialData;
}

const LeadForm: React.FC<LeadFormProps> = ({ onGenerate, isLoading, initialData }) => {
    const [businessType, setBusinessType] = useState<string>(initialData?.businessType || 'Boutique Hotels');
    const [location, setLocation] = useState<string>(initialData?.location ||'Kyoto, Japan');
    const [numberOfLeads, setNumberOfLeads] = useState<number>(10);
    const [requirements, setRequirements] = useState<string>(initialData?.requirements || '');
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number; } | undefined>(undefined);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setBusinessType(initialData.businessType || 'Boutique Hotels');
            setLocation(initialData.location || 'Kyoto, Japan');
            setRequirements(initialData.requirements || '');
        }
    }, [initialData]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (businessType && location) {
            onGenerate(businessType, location, numberOfLeads, requirements, coordinates);
        }
    };
    
    const handleUseMyLocation = () => {
        setLocationError(null);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation('My Current Location');
                    setCoordinates({ latitude, longitude });
                },
                (error) => {
                    setLocationError(`Error: ${error.message}. Please enter a location manually.`);
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
             <h2 className="text-2xl font-bold border-b-4 border-black pb-2">Step 2: Generate Leads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="businessType" className="block text-sm font-bold text-black mb-2">
                        Business Type <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="businessType"
                        type="text"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        placeholder="e.g., Plumbers, Restaurants"
                        className="w-full bg-white border-2 border-black rounded-none py-3 px-4 focus:ring-2 focus:ring-yellow-400 focus:border-black outline-none transition duration-200"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="numberOfLeads" className="block text-sm font-bold text-black mb-2">
                        Number of Leads <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="numberOfLeads"
                        type="number"
                        value={numberOfLeads}
                        onChange={(e) => setNumberOfLeads(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        min="1"
                        max="50"
                        className="w-full bg-white border-2 border-black rounded-none py-3 px-4 focus:ring-2 focus:ring-yellow-400 focus:border-black outline-none transition duration-200"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-bold text-black mb-2">
                        Location(s) <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                         <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                                if (e.target.value !== 'My Current Location') {
                                    setCoordinates(undefined);
                                }
                            }}
                            placeholder="e.g., New York, NY"
                            className="w-full bg-white border-2 border-black rounded-none py-3 px-4 pr-12 focus:ring-2 focus:ring-yellow-400 focus:border-black outline-none transition duration-200"
                            required
                        />
                         <button 
                            type="button" 
                            onClick={handleUseMyLocation}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-black/60 hover:text-black transition"
                            title="Use my current location"
                        >
                            <LocationMarkerIcon className="w-5 h-5" />
                        </button>
                    </div>
                     {locationError && <p className="text-red-600 text-xs mt-2">{locationError}</p>}
                </div>
                 <div>
                    <label htmlFor="requirements" className="block text-sm font-bold text-black mb-2">
                        Specific Requirements (Optional)
                    </label>
                    <input
                        id="requirements"
                        type="text"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="e.g., free wifi, pet-friendly"
                        className="w-full bg-white border-2 border-black rounded-none py-3 px-4 focus:ring-2 focus:ring-yellow-400 focus:border-black outline-none transition duration-200"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-4 border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] active:shadow-none transform transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ANALYSING...
                    </>
                ) : (
                    'GENERATE LEADS'
                )}
            </button>
        </form>
    );
};

export default LeadForm;