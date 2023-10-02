import React from 'react';

export default function Group ({ children, ...otherProps }: React.ComponentProps<'g'>) {
    return (
        <g {...otherProps}>
            {children}
        </g>
    );
};
