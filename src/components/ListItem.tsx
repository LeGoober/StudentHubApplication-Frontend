import React from 'react';

interface ListItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  badge?: { type: 'new' | 'buy'; text: string };
}

const ListItem: React.FC<ListItemProps> = ({ icon, text, active, badge }) => {
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded ${active ? 'bg-gray-200 font-semibold' : ''} hover:bg-gray-200`}
    >
      {icon}
      <p className="text-sm text-gray-800">{text}</p>
      {badge && (
        <span
          className={`px-2 py-1 text-xs rounded ${
            badge.type === 'new' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {badge.text}
        </span>
      )}
    </div>
  );
};

export default ListItem;