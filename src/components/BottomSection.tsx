// @ts-ignore
import React from 'react';

const BottomSection: React.FC = () => {
    return (
        <div className="flex-1 flex">
            <div className="bg-white h-full w-[65%] border-r border-gray-200 flex flex-col items-center justify-center gap-12">
                <img src="/Assets/1641b16ec6ac0c4e733d.svg" alt="img-centre" className="w-1/2" />
                <p className="text-gray-400">No one's around to play with Wumpus.</p>
            </div>
            <div className="bg-white h-full w-[35%] p-4">
                <h1 className="text-xl font-black mb-5">Active Now</h1>
                <div className="flex flex-col items-center justify-center gap-1">
                    <h2 className="text-base font-semibold text-center">It's quiet for now...</h2>
                    <p className="text-xs text-gray-500 text-center">When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!</p>
                </div>
            </div>
        </div>
    );
};

export default BottomSection;