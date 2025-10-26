import React, { useState } from 'react';
import { type Strategy } from '../services/geminiService';

interface StrategyAssistantProps {
    onGenerateStrategy: (problem: string) => void;
    strategy: Strategy | null;
    isLoading: boolean;
    error: string | null;
    onUseStrategy: (strategy: Strategy) => void;
}

const StrategyAssistant: React.FC<StrategyAssistantProps> = ({ onGenerateStrategy, strategy, isLoading, error, onUseStrategy }) => {
    const [problem, setProblem] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (problem.trim()) {
            onGenerateStrategy(problem);
        }
    };

    return (
        <div className="bg-[#1A1A1A] bg-opacity-50 backdrop-blur-sm p-6 sm:p-8 border border-gray-800 rounded-xl shadow-2xl shadow-black/20 mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-4 text-gray-100">Step 1: AI Strategy Assistant</h2>
            <p className="mb-4 text-gray-400">Not sure where to start? Describe your product or service, and our AI will suggest a target audience for you.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="problem" className="block text-sm font-medium text-gray-400 mb-2">
                        What are you trying to sell or promote?
                    </label>
                    <textarea
                        id="problem"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="e.g., 'A new brand of organic, fair-trade coffee beans for environmentally conscious consumers.'"
                        className="w-full bg-[#121212] border-2 border-gray-700 rounded-lg py-3 px-4 h-24 text-gray-200 focus:border-[#C0A062] outline-none transition duration-200 resize-y"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#C0A062] font-bold py-2 px-4 border-2 border-[#C0A062] rounded-lg shadow-[3px_3px_0px_#C0A062] hover:shadow-[1px_1px_0px_#C0A062] active:shadow-[1px_1px_0px_#C0A062] transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                >
                     {isLoading ? 'GENERATING...' : 'Generate Strategy'}
                </button>
            </form>

            {isLoading && (
                 <div className="text-center p-4 mt-4 border-2 border-dashed border-gray-800 animate-pulse rounded-lg">
                    <p className="font-bold text-gray-400">AI is brainstorming a strategy...</p>
                </div>
            )}

            {error && (
                 <div className="mt-4 bg-red-900/50 border border-red-500 text-red-300 font-medium px-4 py-3 rounded-xl" role="alert">
                    <strong className="font-bold">Strategy Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {strategy && (
                <div className="mt-6 p-4 bg-black/20 border border-[#C0A062]/30 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-100">AI Recommended Strategy:</h3>
                    <ul className="mt-2 space-y-2 list-disc list-inside text-gray-300">
                        <li><strong>Target Business:</strong> {strategy.businessType}</li>
                        <li><strong>Suggested Locations:</strong> {strategy.locations.join(', ')}</li>
                        <li><strong>Key Requirements:</strong> {strategy.requirements}</li>
                    </ul>
                     <button
                        onClick={() => onUseStrategy(strategy)}
                        className="mt-4 w-full sm:w-auto bg-[#C0A062] text-black font-bold py-2 px-4 border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] hover:shadow-[1px_1px_0px_#000] active:shadow-[1px_1px_0px_#000] transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150"
                    >
                        Use This Strategy
                    </button>
                </div>
            )}
        </div>
    );
};

export default StrategyAssistant;