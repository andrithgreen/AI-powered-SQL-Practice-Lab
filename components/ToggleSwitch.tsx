import React from 'react';

interface ToggleSwitchProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange, label }) => {
    return (
        <label htmlFor={id} className="flex items-center cursor-pointer select-none">
            <span className="mr-2 text-sm text-gray-300">{label}</span>
            <div className="relative">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                    aria-label={label}
                />
                <div className="block w-10 h-6 rounded-full transition-colors bg-gray-600 peer-checked:bg-[#007acc]"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
            </div>
        </label>
    );
};

export default ToggleSwitch;
