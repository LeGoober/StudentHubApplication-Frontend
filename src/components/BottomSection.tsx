import React from 'react';

const BottomSection: React.FC = () => {
    return (
        <div className="discord-bottom">
            <div className="discord-main-content">
                <img src="./Assets/1641b16ec6ac0c4e733d.svg" alt="img-centre" />
                <p>No one's around to play with Wumpus.</p>
            </div>
            <div className="discord-activity-panel">
                <h1 className="discord-activity-title">Active Now</h1>
                <div className="discord-activity-content">
                    <h2>It's quiet for now...</h2>
                    <p>When a friend starts an activity—like playing a game or hanging out on voice—we'll show it here!</p>
                </div>
            </div>
        </div>
    );
};

export default BottomSection;