import React, { useState, useCallback } from 'react';
import { verifyLeadRequirement } from '../services/geminiService';
import { type VerificationResult } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface RequirementVerifierProps {
    businessName: string;
    websiteUrl?: string;
    requirement: string;
}

const RequirementVerifier: React.FC<RequirementVerifierProps> = ({ businessName, websiteUrl, requirement }) => {
    const [verification, setVerification] = useState<{
        status: 'idle' | 'loading' | 'done';
        result: VerificationResult | null;
        error: string | null;
    }>({ status: 'idle', result: null, error: null });

    const handleVerify = useCallback(async () => {
        if (!websiteUrl) return;
        setVerification({ status: 'loading', result: null, error: null });
        try {
            const result = await verifyLeadRequirement(businessName, websiteUrl, requirement);
            setVerification({ status: 'done', result, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setVerification({ status: 'done', result: null, error: errorMessage });
        }
    }, [businessName, websiteUrl, requirement]);

    if (!requirement || !websiteUrl) {
        return null; // Don't show verifier if there's no requirement or website
    }

    return (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-700">
            <h4 className="text-sm font-bold mb-2 text-gray-300">AI Requirement Check:</h4>
            <p className="text-xs text-gray-400 mb-3 italic">"{requirement}"</p>

            {verification.status === 'idle' && (
                <button
                    onClick={handleVerify}
                    className="w-full text-sm bg-[#1A1A1A] text-gray-300 font-bold py-2 px-3 border-2 border-gray-600 rounded-lg shadow-[3px_3px_0px_#4A4A4A] hover:shadow-[1px_1px_0px_#4A4A4A] active:shadow-[1px_1px_0px_#4A4A4A] transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150"
                >
                    Verify Requirement
                </button>
            )}

            {verification.status === 'loading' && (
                 <div className="flex items-center justify-center space-x-2">
                     <svg className="animate-spin h-5 w-5 text-[#C0A062]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-bold text-gray-300">Verifying...</span>
                </div>
            )}

            {verification.status === 'done' && (
                <div className="space-y-3 text-sm">
                    {verification.error && (
                         <div className="p-2 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
                             <p><span className="font-bold">Error:</span> {verification.error}</p>
                         </div>
                    )}
                    {verification.result && (
                        <>
                            <div className="flex items-start gap-2">
                                {verification.result.meetsRequirement ? (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                                )}
                                <p className="font-semibold text-gray-300">{verification.result.justification}</p>
                            </div>
                            {verification.result.applicationUrl && (
                                 <a
                                    href={verification.result.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-[#C0A062] text-black font-bold py-2 px-3 border-2 border-black rounded-lg text-xs transition-all duration-150 shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] active:shadow-[1px_1px_0px_#000] transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                                >
                                    Go to Contact/Apply Page
                                </a>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default RequirementVerifier;