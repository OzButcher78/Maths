import React from 'react';

interface CrossIconProps {
    className?: string;
}

const CrossIcon: React.FC<CrossIconProps> = ({ className }) => (
    <svg 
        className={`w-8 h-8 text-red-400 ${className || ''}`}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
        viewBox="0 0 100 100"
    >
        <line x1="15" y1="15" x2="85" y2="85" strokeLinecap="round" />
        <line x1="85" y1="15" x2="15" y2="85" strokeLinecap="round" />
    </svg>
);

export default CrossIcon;