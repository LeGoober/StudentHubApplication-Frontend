import React from 'react';

interface FriendItemProps {
  imgSrc?: string;
  name: string;
}

const FriendItem: React.FC<FriendItemProps> = ({ imgSrc, name }) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer">
      <div className="w-8 h-8">
        <img src={imgSrc} alt={`${name}'s avatar`} className="w-full h-full rounded-full" />
      </div>
      <p className="text-sm text-gray-800">{name}</p>
      <i className="fa fa-xmark text-gray-500 hover:text-red-500"></i>
    </div>
  );
};

export default FriendItem;