import React from 'react';
import { type Lead, type LeadStatus } from '../types';
import { PhoneIcon, GlobeAltIcon, MapIcon, StarIcon, ClockIcon, TagIcon } from './icons';
import RequirementVerifier from './RequirementVerifier';

interface LeadCardProps {
    lead: Lead;
    onUpdateStatus: (id: number, status: LeadStatus) => void;
    requirements: string;
}

const statusColors: Record<LeadStatus, string> = {
    'New': 'bg-blue-500',
    'Contacted': 'bg-yellow-500',
    'Interested': 'bg-green-500',
    'Not Interested': 'bg-red-500',
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, onUpdateStatus, requirements }) => {
    return (
        <div className="bg-[#1A1A1A] border-2 border-gray-800 rounded-xl shadow-lg p-6 flex flex-col h-full transition-all duration-200 ease-in-out hover:border-[#C0A062] hover:shadow-[8px_8px_0px_#000] hover:-translate-x-2 hover:-translate-y-2">
            <div className="flex-grow">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-100 break-words pr-2">{lead.name}</h3>
                    <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-sm font-semibold bg-[#121212] border border-gray-700 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-[#C0A062] text-gray-200"
                        aria-label="Lead Status"
                    >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Interested</option>
                        <option>Not Interested</option>
                    </select>
                </div>
                 <div className="space-y-4 text-gray-300">
                     {lead.category && (
                        <div className="flex items-center gap-3">
                            <TagIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span className="font-semibold">{lead.category}</span>
                        </div>
                    )}
                    <div className="flex items-start gap-3">
                        <MapIcon className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                        <span>{lead.address}</span>
                    </div>
                    {lead.phone && (
                        <div className="flex items-center gap-3">
                            <PhoneIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <a href={`tel:${lead.phone}`} className="hover:underline hover:text-[#C0A062] transition-colors">{lead.phone}</a>
                        </div>
                    )}
                     {lead.rating !== null && lead.rating !== undefined && (
                        <div className="flex items-center gap-3">
                            <StarIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span><strong>{lead.rating}</strong> / 5 ({lead.reviewsCount ?? 'N/A'} reviews)</span>
                        </div>
                    )}
                    {lead.openingHours && (
                         <div className="flex items-start gap-3">
                            <ClockIcon className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                            <span>{lead.openingHours}</span>
                        </div>
                    )}
                </div>
                 <RequirementVerifier 
                    businessName={lead.name}
                    websiteUrl={lead.website}
                    requirement={requirements}
                />
            </div>

            {lead.website && (
                 <div className="mt-6 pt-4 border-t border-gray-800">
                    <a
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-bold text-gray-300 hover:text-[#C0A062] transition-colors"
                    >
                        <GlobeAltIcon className="w-5 h-5" />
                        <span>Visit Website</span>
                    </a>
                 </div>
            )}
        </div>
    );
};

export default LeadCard;