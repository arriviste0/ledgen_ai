import React, { useState, useCallback } from 'react';
import { type Lead, type GroundingChunk, type LeadStatus } from './types';
import { generateLeads, generateStrategy, type Strategy } from './services/geminiService';
import LeadForm from './components/LeadForm';
import ResultsDisplay from './components/ResultsDisplay';
import StrategyAssistant from './components/StrategyAssistant';
import { CompassIcon } from './components/icons';

const App: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [strategyLoading, setStrategyLoading] = useState<boolean>(false);
    const [strategyError, setStrategyError] = useState<string | null>(null);
    const [formInitialData, setFormInitialData] = useState<Partial<Omit<Strategy, 'locations'> & { location: string }> | undefined>(undefined);
    const [formKey, setFormKey] = useState(0);


    const handleGenerateStrategy = useCallback(async (problem: string) => {
        setStrategyLoading(true);
        setStrategyError(null);
        setStrategy(null);
        try {
            const result = await generateStrategy(problem);
            setStrategy(result);
        } catch (err) {
            if (err instanceof Error) {
                setStrategyError(err.message);
            } else {
                setStrategyError('An unexpected error occurred while generating the strategy.');
            }
        } finally {
            setStrategyLoading(false);
        }
    }, []);

    const handleUseStrategy = useCallback((strategyToUse: Strategy) => {
        setFormInitialData({
            businessType: strategyToUse.businessType,
            location: strategyToUse.locations.join(', '),
            requirements: strategyToUse.requirements
        });
        setFormKey(prev => prev + 1); // Change key to force re-render of LeadForm
    }, []);


    const handleGenerateLeads = useCallback(async (
        businessType: string, 
        location: string, 
        numberOfLeads: number,
        requirements: string,
        coordinates?: { latitude: number; longitude: number }
    ) => {
        setIsLoading(true);
        setError(null);
        setLeads([]);
        setSources([]);

        try {
            const result = await generateLeads({ businessType, location, numberOfLeads, requirements, coordinates });
            const leadsWithStatus = result.leads.map((lead, index) => ({
                ...lead,
                id: index,
                status: 'New' as const
            }));
            setLeads(leadsWithStatus);
            setSources(result.sources);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleUpdateLeadStatus = useCallback((id: number, status: LeadStatus) => {
        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead.id === id ? { ...lead, status } : lead
            )
        );
    }, []);
    
    const exportToCSV = useCallback(() => {
        if (leads.length === 0) return;

        const headers = ['Name', 'Category', 'Address', 'Phone', 'Website', 'Rating', 'Reviews Count', 'Opening Hours', 'Status'];
        const csvRows = [
            headers.join(','),
            ...leads.map(lead => [
                `"${lead.name?.replace(/"/g, '""') ?? ''}"`,
                `"${lead.category?.replace(/"/g, '""') ?? ''}"`,
                `"${lead.address?.replace(/"/g, '""') ?? ''}"`,
                `"${lead.phone ?? ''}"`,
                `"${lead.website ?? ''}"`,
                lead.rating ?? '',
                lead.reviewsCount ?? '',
                `"${lead.openingHours?.replace(/"/g, '""') ?? ''}"`,
                lead.status,
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'leads.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [leads]);


    return (
        <div className="min-h-screen bg-yellow-300 text-black font-mono flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center mb-10">
                    <div className="inline-block bg-white p-4 border-4 border-black shadow-[8px_8px_0_0_#000]">
                       <div className="flex items-center justify-center gap-4">
                            <CompassIcon className="w-12 h-12 text-black" />
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                LeadGen Maps
                            </h1>
                            <span className="bg-yellow-300 text-black text-sm font-bold border-2 border-black px-2 py-1 tracking-widest -ml-2">PRO</span>
                        </div>
                    </div>
                     <p className="text-black text-lg mt-4 max-w-3xl mx-auto">
                        Your advanced tool for high-quality local business leads. Specify your needs, generate an exportable list, and accelerate your outreach.
                    </p>
                </header>

                <main>
                    <StrategyAssistant 
                        onGenerateStrategy={handleGenerateStrategy}
                        strategy={strategy}
                        isLoading={strategyLoading}
                        error={strategyError}
                        onUseStrategy={handleUseStrategy}
                    />

                    <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0_0_#000] mb-8">
                        <LeadForm 
                            key={formKey}
                            onGenerate={handleGenerateLeads} 
                            isLoading={isLoading}
                            initialData={formInitialData}
                        />
                    </div>
                    <ResultsDisplay
                        leads={leads}
                        sources={sources}
                        isLoading={isLoading}
                        error={error}
                        onUpdateStatus={handleUpdateLeadStatus}
                        onExport={exportToCSV}
                    />
                </main>
                 <footer className="text-center mt-12 text-black/80 text-sm">
                    <p>&copy; {new Date().getFullYear()} LeadGen Maps. Powered by Gemini.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;