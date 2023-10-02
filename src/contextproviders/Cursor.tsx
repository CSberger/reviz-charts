import React from 'react';

interface CursorProps {
    x: number,
    y: number
}
const Cursor = React.createContext<CursorProps | null>(null);

export default Cursor;
