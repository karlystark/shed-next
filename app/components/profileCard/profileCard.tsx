import React from 'react';

interface ProfileCardProps {
  username: string;
  color?: string;
  icon?: string;
  action?: React.ReactNode;
}

function ProfileCard({ username, color, icon, action }: ProfileCardProps) {
  return (
    <div
      className="ProfileCard w-full h-32 rounded-lg flex items-center justify-between p-4"
      style={{ backgroundColor: color || 'var(--green)' }}
    >
      <div className="flex items-center min-w-0">
        {icon && (
          <div
            className="w-16 h-16 rounded-full bg-[#f4f2ed] flex items-center justify-center flex-shrink-0"
            style={{ backgroundImage: `url(${icon})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          ></div>
        )}
        <h2 className="preview-name text-[#f4f2ed] ml-6 text-lg truncate">{username}</h2>
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export default ProfileCard;
