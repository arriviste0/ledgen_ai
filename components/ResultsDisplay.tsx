import React from 'react';
import { type Lead, type GroundingChunk, type LeadStatus } from '../types';
import LeadCard from './LeadCard';
import SourceLinks from './SourceLinks';
import { DownloadIcon, ListIcon, GlobeIcon } from './icons';

type ViewMode = 'list' | 'globe';

interface ResultsDisplayProps {
    leads: Lead[];
    sources: GroundingChunk[];
    isLoading: boolean;
    error: string | null;
    onUpdateStatus: (id: number, status: LeadStatus) => void;
    onExport: () => void;
    requirements: string;
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
    onSelectLead: (lead: Lead) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ leads, sources, isLoading, error, onUpdateStatus, onExport, requirements, viewMode, onViewChange, onSelectLead }) => {
    if (isLoading) {
        return (
            <div className="text-center p-8 bg-[#1A1A1A] border border-gray-800 rounded-xl">
                <div className="animate-pulse">
                    <div className="text-2xl font-bold mb-2 text-gray-200">Generating Leads...</div>
                    <p className="text-gray-400">AI is searching for the best results, please wait.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/50 border border-red-500 text-red-300 font-medium px-4 py-3 rounded-xl" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="text-center p-10 bg-transparent border-2 border-dashed border-gray-800 rounded-xl">
                <h3 className="text-xl font-bold text-gray-300">Ready to find new leads?</h3>
                <p className="text-gray-500 mt-2">Enter a business type and location above to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1A1A1A] p-4 border border-gray-800 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                     <h2 className="text-2xl font-bold text-gray-100">
                        {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'} Found
                    </h2>
                     <div className="flex items-center gap-2 bg-[#121212] p-1 rounded-lg border border-gray-700">
                        <button onClick={() => onViewChange('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-[#C0A062] text-black' : 'text-gray-400 hover:bg-gray-800'}`} title="List View">
                            <ListIcon className="w-5 h-5" />
                        </button>
                         <button onClick={() => onViewChange('globe')} className={`p-2 rounded-md transition ${viewMode === 'globe' ? 'bg-[#C0A062] text-black' : 'text-gray-400 hover:bg-gray-800'}`} title="Globe View">
                            <GlobeIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <button
                    onClick={onExport}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#C0A062] font-bold py-2 px-4 border-2 border-[#C0A062] rounded-lg shadow-[3px_3px_0px_#C0A062] hover:shadow-[1px_1px_0px_#C0A062] active:shadow-[1px_1px_0px_#C0A062] transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export to CSV
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onUpdateStatus={onUpdateStatus} requirements={requirements} onSelect={onSelectLead} />
                ))}
            </div>
            {sources.length > 0 && <SourceLinks sources={sources} />}
        </div>
    );
};

export default ResultsDisplay;