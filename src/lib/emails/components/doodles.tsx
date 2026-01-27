import * as React from 'react';

interface DoodleProps {
    color?: string;
    opacity?: number;
    size?: number;
    style?: React.CSSProperties;
    className?: string; // For flexibility, though we mostly use inline styles
}

const defaultColor = '#C4BCB0';
const defaultOpacity = 1;
const defaultSize = 20;

export const Lightbulb = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M9 21H15M12 1V3M5.636 5.636L7.05 7.05M16.95 7.05L18.364 5.636M4 11C4 13.9 5.6 16.2 8 17.4V19C8 19.6 8.4 20 9 20H15C15.6 20 16 19.6 16 19V17.4C18.4 16.2 20 13.9 20 11C20 6.6 16.4 3 12 3C7.6 3 4 6.6 4 11Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Rocket = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M4.5 16.5C3 20.5 2 22 2 22C2 22 3.5 21 7.5 19.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 12C10.8807 13.3807 13.1193 13.3807 14.5 12L15.5 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 17.5L13 18.5C14.3807 19.8807 16.6193 19.8807 18 18.5L20.5 16C21.8807 14.6193 21.8807 12.3807 20.5 11L13 3.5C11.6193 2.11929 9.38071 2.11929 8 3.5L5.5 6C4.11929 7.38071 4.11929 9.61929 5.5 11L6.5 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const GraphArrow = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M22 6L13.5 14.5L8.5 9.5L2 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6H22V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Handshake = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M9.00002 11C9.00002 11 10.15 13.63 11 14C11 14 11.83 14.4 12.55 14.15M4 17L7.00002 14L8.76002 14.93C9.04002 15.08 9.37002 15.08 9.65002 14.93L12.5 12.03C12.87 11.66 12.87 11.06 12.5 10.68L12 10.18C11.63 9.8 11.03 9.8 10.66 10.18L9.00002 12L8.00002 11L4 17ZM20 7L17 10L15.34 9.17C15.09 9.04 14.81 9.04 14.56 9.17L12 11L12.7 11.7L15.5 8.7L17 10.5L20 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="15" width="3" height="5" rx="1" stroke={color} strokeWidth="1.5" />
        <rect x="19" y="4" width="3" height="5" rx="1" stroke={color} strokeWidth="1.5" />
    </svg>
);

export const Trophy = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M8 21H16M12 17V21M7 4H17M8 4V8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8V4M6 4V8C6 9.1 5.1 10 4 10C2.9 10 2 9.1 2 8V6C2 4.9 2.9 4 4 4H6ZM18 4H20C21.1 4 22 4.9 22 6V8C22 9.1 21.1 10 20 10C18.9 10 18 9.1 18 8V4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Gear = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 15C20.6 14.375 20.6 12.625 19.4 12L17.77 11.23C17.65 10.82 17.5 10.42 17.29 10.05L17.78 8.61C18.25 7.6 17.4 6.75 16.39 7.22L14.95 7.71C14.58 7.5 14.18 7.35 13.77 7.23L13 5.6C12.375 4.4 10.625 4.4 10 5.6L9.23 7.23C8.82 7.35 8.42 7.5 8.05 7.71L6.61 7.22C5.6 6.75 4.75 7.6 5.22 8.61L5.71 10.05C5.5 10.42 5.35 10.82 5.23 11.23L3.6 12C2.4 12.625 2.4 14.375 3.6 15L5.23 15.77C5.35 16.18 5.5 16.58 5.71 16.95L5.22 18.39C4.75 19.4 5.6 20.25 6.61 19.78L8.05 19.29C8.42 19.5 8.82 19.65 9.23 19.77L10 21.4C10.625 22.6 12.375 22.6 13 21.4L13.77 19.77C14.18 19.65 14.58 19.5 14.95 19.29L16.39 19.78C17.4 20.25 18.25 19.4 18.78 18.39L18.29 16.95C18.5 16.58 18.65 16.18 18.77 15.77L19.4 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SpeechBubble = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M21 11.5C21 15.65 16.95 19 12 19C10.7 19 9.5 18.8 8.4 18.5C8 18.3 7 19 6 20C6 18 6.5 16 6.2 15C5.45 13.9 5 12.75 5 11.5C5 7.35 9.05 4 14 4C18.95 4 21 7.35 21 11.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Calendar = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M8 2V5M16 2V5M3 7H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Sparkle = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Checkmark = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


export const LocationPin = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" />
    </svg>
);

export const CoffeeCup = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M18 8H19C20.1 8 21 8.9 21 10C21 11.1 20.1 12 19 12H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 8H18V14C18 16.21 16.21 18 14 18H6C3.79 18 2 16.21 2 14V8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 1V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 1V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 1V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const StarBurst = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MoneyBag = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M12 12C14.2091 12 16 10.2091 16 8H8C8 10.2091 9.79086 12 12 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 1C9.23858 1 7 3.23858 7 6V8H17V6C17 3.23858 14.7614 1 12 1Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 8H19C20.1046 8 21 8.89543 21 10V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10C3 8.89543 3.89543 8 5 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 19V17M12 17H10M12 17H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Notepad = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M16 2H8C6.9 2 6 2.9 6 4V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V4C18 2.9 17.1 2 16 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 10H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 14H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 18H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Flame = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M12 2C9 6 6 8.5 6 12.5C6 15.81 8.69 18.5 12 18.5C15.31 18.5 18 15.81 18 12.5C18 10.5 17 8.5 16 7L14.6 9.8C14.4 10.2 13.9 10.6 13.4 10.6C12.8 10.6 12.3 10.2 12.1 9.7L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22C14.7614 22 17 19.7614 17 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const BarChart = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <path d="M18 20V10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 20V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 20V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Clock = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...style, opacity }}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6V12L16.5 16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Target = ({ color = defaultColor, opacity = defaultOpacity, size = defaultSize, style }: DoodleProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ ...style, opacity }}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
);

