import React from 'react';
import { type Lead, type LeadStatus } from '../types';
import { XIcon, PhoneIcon, GlobeAltIcon, MapIcon, StarIcon, ClockIcon, TagIcon } from './icons';
import RequirementVerifier from './RequirementVerifier';

interface LeadDetailModalProps {
    lead: Lead;
    onClose: () => void;
    onUpdateStatus: (id: number, status: LeadStatus) => void;
    requirements: string;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onUpdateStatus, requirements }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-[#1A1A1A] border-2 border-gray-800 rounded-xl shadow-2xl shadow-black/40 w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100">{lead.name}</h2>
                        {lead.category && <p className="text-gray-400">{lead.category}</p>}
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-white transition-colors"
                        aria-label="Close lead details"
                    >
                        <XIcon className="w-7 h-7" />
                    </button>
                </header>
                
                <main className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Status</h3>
                            <select
                                value={lead.status}
                                onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                                className="w-full text-base font-semibold bg-[#121212] border-2 border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:border-[#C0A062] text-gray-200"
                                aria-label="Lead Status"
                            >
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Interested</option>
                                <option>Not Interested</option>
                            </select>
                         </div>
                          {lead.rating !== null && lead.rating !== undefined && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Rating</h3>
                                <div className="flex items-center gap-3 bg-[#121212] border-2 border-gray-700 rounded-lg py-2 px-3">
                                    <StarIcon className="w-5 h-5 text-[#C0A062] flex-shrink-0" />
                                    <span className="text-gray-200"><strong>{lead.rating}</strong> / 5 ({lead.reviewsCount ?? 'N/A'} reviews)</span>
                                </div>
                            </div>
                         )}
                    </div>

                    <div className="space-y-4 text-gray-300">
                        <div className="flex items-start gap-4">
                            <MapIcon className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-100">Address</h4>
                                <p>{lead.address}</p>
                            </div>
                        </div>
                        {lead.phone && (
                            <div className="flex items-center gap-4">
                                <PhoneIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-gray-100">Phone</h4>
                                    <a href={`tel:${lead.phone}`} className="hover:underline hover:text-[#C0A062] transition-colors">{lead.phone}</a>
                                </div>
                            </div>
                        )}
                         {lead.openingHours && (
                             <div className="flex items-start gap-4">
                                <ClockIcon className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-gray-100">Opening Hours</h4>
                                    <p>{lead.openingHours}</p>
                                </div>
                            </div>
                        )}
                    </div>
                     <RequirementVerifier 
                        businessName={lead.name}
                        websiteUrl={lead.website}
                        requirement={requirements}
                    />
                </main>

                {lead.website && (
                    <footer className="mt-auto flex-shrink-0 p-6 border-t border-gray-800 bg-black/20">
                        <a
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 font-bold text-gray-200 hover:text-[#C0A062] transition-colors"
                        >
                            <GlobeAltIcon className="w-5 h-5" />
                            <span>Visit Website</span>
                        </a>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default LeadDetailModal;