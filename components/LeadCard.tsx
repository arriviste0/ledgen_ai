import React from 'react';
import { type Lead, type LeadStatus } from '../types';
import { PhoneIcon, GlobeAltIcon, MapIcon, StarIcon, ClockIcon, TagIcon } from './icons';

interface LeadCardProps {
    lead: Lead;
    onUpdateStatus: (id: number, status: LeadStatus) => void;
}

const statusColors: Record<LeadStatus, string> = {
    'New': 'bg-blue-500',
    'Contacted': 'bg-yellow-500',
    'Interested': 'bg-green-500',
    'Not Interested': 'bg-red-500',
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, onUpdateStatus }) => {
    return (
        <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0_0_#000] p-6 flex flex-col h-full transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#000]">
            <div className="flex-grow">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-black break-words pr-2">{lead.name}</h3>
                    <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-sm font-bold bg-white border-2 border-black rounded-none p-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        aria-label="Lead Status"
                    >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Interested</option>
                        <option>Not Interested</option>
                    </select>
                </div>
                 <div className="space-y-4 text-black">
                     {lead.category && (
                        <div className="flex items-center gap-3">
                            <TagIcon className="w-5 h-5 text-black/60 flex-shrink-0" />
                            <span className="font-bold">{lead.category}</span>
                        </div>
                    )}
                    <div className="flex items-start gap-3">
                        <MapIcon className="w-5 h-5 mt-1 text-black/60 flex-shrink-0" />
                        <span>{lead.address}</span>
                    </div>
                    {lead.phone && (
                        <div className="flex items-center gap-3">
                            <PhoneIcon className="w-5 h-5 text-black/60 flex-shrink-0" />
                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                        </div>
                    )}
                     {lead.rating !== null && lead.rating !== undefined && (
                        <div className="flex items-center gap-3">
                            <StarIcon className="w-5 h-5 text-black/60 flex-shrink-0" />
                            <span><strong>{lead.rating}</strong> / 5 ({lead.reviewsCount ?? 'N/A'} reviews)</span>
                        </div>
                    )}
                    {lead.openingHours && (
                         <div className="flex items-start gap-3">
                            <ClockIcon className="w-5 h-5 mt-1 text-black/60 flex-shrink-0" />
                            <span>{lead.openingHours}</span>
                        </div>
                    )}
                </div>
            </div>

            {lead.website && (
                 <div className="mt-6 pt-4 border-t-2 border-black">
                    <a
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-bold text-black hover:underline"
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
