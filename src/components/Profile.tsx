import React, { useState, useRef } from 'react';

interface ProfileProps {
  username?: string;
  status?: 'Online' | 'Offline';
  avatarSrc?: string;
}

const Profile: React.FC<ProfileProps> = ({ 
  username = 'Anonymou5', 
  status = 'Online', 
  avatarSrc = '/Assets/img-icon-profile.jpeg' 
}) => {
  const [micMuted, setMicMuted] = useState(false);
  const [headphonesMuted, setHeadphonesMuted] = useState(false);
  
  const muteAudioRef = useRef<HTMLAudioElement | null>(null);
  const unmuteAudioRef = useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    muteAudioRef.current = new Audio('/Assets/discordmute_IZNcLx2.mp3');
    unmuteAudioRef.current = new Audio('/Assets/discord-unmute-sound.mp3');
    
    return () => {
      muteAudioRef.current = null;
      unmuteAudioRef.current = null;
    };
  }, []);

  const toggleMic = () => {
    if (!micMuted) {
      muteAudioRef.current?.play().catch(() => {});
    } else {
      unmuteAudioRef.current?.play().catch(() => {});
    }
    setMicMuted(!micMuted);
  };

  const toggleHeadphones = () => {
    if (!headphonesMuted) {
      muteAudioRef.current?.play().catch(() => {});
    } else {
      unmuteAudioRef.current?.play().catch(() => {});
    }
    setHeadphonesMuted(!headphonesMuted);
  };

  return (
    <div className="discord-profile">
      <div className="discord-profile-info">
        <div className="discord-avatar-wrapper">
          <img src={avatarSrc} alt={`${username}'s avatar`} className="discord-avatar" />
          <div className="discord-status-indicator"></div>
        </div>
        <div className="discord-profile-text">
          <p className="discord-profile-name">{username}</p>
          <span className="discord-profile-status">{status}</span>
        </div>
      </div>
      <div className="discord-profile-controls">
        <i
          id="mic"
          className={`fa-solid ${micMuted ? 'fa-microphone-slash muted' : 'fa-microphone'}`}
          onClick={toggleMic}
        ></i>
        <i
          id="head"
          className={`fa-solid fa-headphones ${headphonesMuted ? 'muted' : ''}`}
          onClick={toggleHeadphones}
        ></i>
        <i className="fa-solid fa-gear"></i>
      </div>
    </div>
  );
};

export default Profile;