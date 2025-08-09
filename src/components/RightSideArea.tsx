// @ts-ignore
import React from 'react';
import NavBar from './NavBar';
import BottomSection from './BottomSection';

const RightSideArea: React.FC = () => {
    return (
        <div className="w-[75%] flex flex-col">
            <NavBar />
            <BottomSection />
        </div>
    );
};

export default RightSideArea;