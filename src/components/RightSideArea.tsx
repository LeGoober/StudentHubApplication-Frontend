import React from "react";
import NavBar from "./NavBar";
import BottomSection from "./BottomSection";

interface RightSideAreaProps {
    // Optional extra classes provided by the parent (e.g., width)
    className?: string;
}

// Keep presentational defaults minimal inside; the parent controls layout.
const BASE_CLASS = "flex flex-col";

const RightSideArea: React.FC<RightSideAreaProps> = ({ className }) => {
    const containerClassName = [BASE_CLASS, className].filter(Boolean).join(" ");

    return (
        <div className={containerClassName}>
            <NavBar />
            <BottomSection />
        </div>
    );
};

RightSideArea.displayName = "RightSideArea";

export default React.memo(RightSideArea);