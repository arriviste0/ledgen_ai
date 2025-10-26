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
        <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0_0_#000] mb-8">
            <h2 className="text-2xl font-bold border-b-4 border-black pb-2 mb-4">Step 1: AI Strategy Assistant</h2>
            <p className="mb-4 text-black/80">Not sure where to start? Describe your product or service, and our AI will suggest a target audience for you.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="problem" className="block text-sm font-bold text-black mb-2">
                        What are you trying to sell or promote?
                    </label>
                    <textarea
                        id="problem"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="e.g., 'A new brand of organic, fair-trade coffee beans for environmentally conscious consumers.'"
                        className="w-full bg-white border-2 border-black rounded-none py-3 px-4 h-24 focus:ring-2 focus:ring-yellow-400 focus:border-black outline-none transition duration-200 resize-y"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto flex justify-center items-center bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                     {isLoading ? 'GENERATING...' : 'Generate Strategy'}
                </button>
            </form>

            {isLoading && (
                 <div className="text-center p-4 mt-4 border-2 border-dashed border-black animate-pulse">
                    <p className="font-bold">AI is brainstorming a strategy...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-500 border-4 border-black text-white font-bold px-4 py-3" role="alert">
                    <strong className="font-bold">Strategy Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {strategy && (
                <div className="mt-6 p-4 bg-yellow-100 border-2 border-black">
                    <h3 className="text-lg font-bold">AI Recommended Strategy:</h3>
                    <ul className="mt-2 space-y-2 list-disc list-inside">
                        <li><strong>Target Business:</strong> {strategy.businessType}</li>
                        <li><strong>Suggested Locations:</strong> {strategy.locations.join(', ')}</li>
                        <li><strong>Key Requirements:</strong> {strategy.requirements}</li>
                    </ul>
                     <button
                        onClick={() => onUseStrategy(strategy)}
                        className="mt-4 w-full sm:w-auto bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] active:shadow-none transform transition-all duration-150 ease-in-out"
                    >
                        Use This Strategy
                    </button>
                </div>
            )}
        </div>
    );
};

export default StrategyAssistant;