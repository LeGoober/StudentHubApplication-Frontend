// @ts-ignore
import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [micOn, setMicOn] = useState(false);
  const [headphonesOn, setHeadphonesOn] = useState(false);

  const toggleMic = () => {
    setMicOn(!micOn);
  };

  const toggleHeadphones = () => {
    setHeadphonesOn(!headphonesOn);
  };

  return (
      <div className="bg-gray-200 flex items-center justify-between p-2 w-full absolute bottom-0">
        <div className="flex items-center gap-2">
          <div className="relative inline-block w-8 h-8">
            <img src="/Assets/img-icon-profile.jpeg" alt="profile-icon" className="w-full h-full object-cover rounded-full" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full shadow"></div>
          </div>
          <div className="flex flex-col items-start justify-center leading-tight">
            <p className="font-bold text-sm">Anonymou5</p>
            <span className="font-light text-xs">Offline</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-lg">
          <i
              className={`fa-solid ${micOn ? 'fa-microphone-slash text-red-600 animate-spring' : 'fa-microphone text-gray-600'} cursor-pointer`}
              onClick={toggleMic}
          ></i>
          <i
              className={`fa-solid ${headphonesOn ? 'fa-headphones text-red-600 animate tilt' : 'fa-headphones text-gray-600'} cursor-pointer`}
              onClick={toggleHeadphones}
          ></i>
          <i className="fa-solid fa-gear text-gray-600 cursor-pointer hover:rotate-180 transition-transform duration-500"></i>
        </div>
      </div>
  );
};

export default Profile;