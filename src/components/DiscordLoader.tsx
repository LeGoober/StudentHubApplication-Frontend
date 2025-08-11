import React, { useEffect, useState } from 'react';

const DiscordLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="discord-loader">
      <i className="fa-brands fa-discord"></i>
      <h1>DID YOU KNOW</h1>
      <div className="loader-text">
        <span>
          <span className="button-style">CTRL</span>
          <span className="button-style">K</span>
          to quickly find a previous
        </span>
        <span>conversation or channel.</span>
      </div>
    </div>
  );
};

export default DiscordLoader;