import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { type Lead } from '../types';
import { ListIcon, GlobeIcon } from './icons';

// FIX: To use THREE.js objects like <mesh> as JSX components, we must extend react-three-fiber. 
// This resolves TypeScript errors about properties not existing on JSX.IntrinsicElements.
extend(THREE);

type ViewMode = 'list' | 'globe';

// Helper to convert lat/lon to a 3D vector
const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
};

interface MarkerProps {
    position: THREE.Vector3;
    onSelect: () => void;
}

const Marker: React.FC<MarkerProps> = ({ position, onSelect }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    
    // Pulsating effect for the marker
    useFrame(({ clock }) => {
        const scale = 1 + 0.2 * Math.sin(clock.getElapsedTime() * 5);
        if (meshRef.current) {
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <mesh position={position} ref={meshRef} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#C0A062" toneMapped={false} />
        </mesh>
    );
};

const Earth = () => {
    const earthRef = useRef<THREE.Mesh>(null!);
    useFrame((_state, delta) => {
        // slow rotation
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.03 * delta;
        }
    });

    return (
        <mesh ref={earthRef}>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial color="#222222" roughness={0.9} metalness={0.1} />
        </mesh>
    )
}

interface GlobeViewProps {
    leads: Lead[];
    onSelectLead: (lead: Lead) => void;
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
}

const GlobeView: React.FC<GlobeViewProps> = ({ leads, onSelectLead, viewMode, onViewChange }) => {
     const validLeads = useMemo(() => leads.filter(l => l.latitude != null && l.longitude != null), [leads]);
     const globeRadius = 3;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1A1A1A] p-4 border border-gray-800 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                     <h2 className="text-2xl font-bold text-gray-100">
                        Global View
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
            </div>
            <div className="w-full h-[600px] bg-[#121212] border border-gray-800 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={0.2} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
                    <Earth />
                    {validLeads.map(lead => (
                        <Marker 
                            key={lead.id} 
                            position={latLonToVector3(lead.latitude!, lead.longitude!, globeRadius)} 
                            onSelect={() => onSelectLead(lead)} 
                        />
                    ))}
                    <OrbitControls enableZoom={true} enablePan={false} minDistance={4} maxDistance={20} />
                </Canvas>
            </div>
        </div>
    );
};

export default GlobeView;