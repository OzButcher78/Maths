import React from 'react';
import BackspaceIcon from './icons/BackspaceIcon';

interface KeypadProps {
    onDigitClick: (digit: string) => void;
    onBackspaceClick: () => void;
    onSubmitClick: () => void;
    playButtonSound: () => void;
}

const KeypadButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center text-3xl font-bold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50
        bg-white/30 text-white hover:bg-white/50 focus:ring-yellow-300 ${className}`}
    >
        {children}
    </button>
);


const Keypad: React.FC<KeypadProps> = ({ onDigitClick, onBackspaceClick, onSubmitClick, playButtonSound }) => {
    const buttons = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9'
    ];
    
    const handleDigit = (digit: string) => {
        playButtonSound();
        onDigitClick(digit);
    }
    
    const handleBackspace = () => {
        playButtonSound();
        onBackspaceClick();
    }
    
    const handleSubmit = () => {
        playButtonSound();
        onSubmitClick();
    }

    return (
        <div className="w-full max-w-xs grid grid-cols-3 grid-rows-4 gap-3">
            {buttons.map(digit => (
                <KeypadButton key={digit} onClick={() => handleDigit(digit)}>
                    {digit}
                </KeypadButton>
            ))}
            <KeypadButton onClick={handleBackspace}>
                <BackspaceIcon />
            </KeypadButton>
            <KeypadButton onClick={() => handleDigit('0')}>
                0
            </KeypadButton>
            <KeypadButton onClick={handleSubmit} className="bg-lime-300 text-lime-800 hover:bg-lime-400 focus:ring-lime-200">
                ✓
            </KeypadButton>
        </div>
    );
};

export default Keypad;