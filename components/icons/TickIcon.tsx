import React from 'react';

interface TickIconProps {
    className?: string;
}

const TickIcon: React.FC<TickIconProps> = ({ className }) => (
    <svg 
        className={`w-10 h-10 text-green-400 ${className || ''}`}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8"
        viewBox="0 0 100 100"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 50 l25 25 L85 25" />
    </svg>
);

export default TickIcon;