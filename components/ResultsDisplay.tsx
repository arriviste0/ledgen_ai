import React from 'react';
import { type Lead, type GroundingChunk, type LeadStatus } from '../types';
import LeadCard from './LeadCard';
import SourceLinks from './SourceLinks';
import { DownloadIcon } from './icons';

interface ResultsDisplayProps {
    leads: Lead[];
    sources: GroundingChunk[];
    isLoading: boolean;
    error: string | null;
    onUpdateStatus: (id: number, status: LeadStatus) => void;
    onExport: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ leads, sources, isLoading, error, onUpdateStatus, onExport }) => {
    if (isLoading) {
        return (
            <div className="text-center p-8 bg-white border-4 border-black">
                <div className="animate-pulse">
                    <div className="text-2xl font-bold mb-2">Generating Leads...</div>
                    <p className="text-black/70">AI is searching for the best results, please wait.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500 border-4 border-black text-white font-bold px-4 py-3" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="text-center p-8 bg-white border-2 border-dashed border-black">
                <h3 className="text-xl font-bold">Ready to find new leads?</h3>
                <p className="text-black/70 mt-2">Enter a business type and location above to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border-4 border-black shadow-[8px_8px_0_0_#000]">
                <h2 className="text-2xl font-bold">
                    {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'} Found
                </h2>
                <button
                    onClick={onExport}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 border-2 border-black transform transition-all duration-150 ease-in-out"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export to CSV
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onUpdateStatus={onUpdateStatus} />
                ))}
            </div>
            {sources.length > 0 && <SourceLinks sources={sources} />}
        </div>
    );
};

export default ResultsDisplay;
