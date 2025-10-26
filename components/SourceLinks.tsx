import React from 'react';
import { type GroundingChunk } from '../types';

interface SourceLinksProps {
    sources: GroundingChunk[];
}

const SourceLinks: React.FC<SourceLinksProps> = ({ sources }) => {
    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-10 p-6 bg-white border-4 border-black">
            <h4 className="text-lg font-bold text-black mb-4">Data Sources</h4>
            <ul className="space-y-2 text-sm">
                {sources.map((source, index) => (
                    source.maps && (
                        <li key={index} className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.665l3-3Z"></path>
                                <path d="M8.603 3.799a.75.75 0 0 0-1.06 1.06l1.225 1.224a2.5 2.5 0 0 1-3.536 3.536l-1.224-1.224a.75.75 0 0 0-1.061 1.06l1.224 1.224a4 4 0 0 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.665l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.06-1.06l-1.225 1.224Z"></path>
                            </svg>
                            <a
                                href={source.maps.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:underline truncate"
                                title={source.maps.title}
                            >
                                {source.maps.title}
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};

export default SourceLinks;
