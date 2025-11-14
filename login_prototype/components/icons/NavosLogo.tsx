import React from 'react';

export const NavosLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="100%" height="100%" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontSize="28" 
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
            fontWeight="700" 
            fill="white"
            letterSpacing="1px"
        >
            Navos
        </text>
    </svg>
);



