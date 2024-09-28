import React from 'react';

interface SideBarProps {}

const SideBar: React.FC<SideBarProps> = () => {
  return (
    <div className="fixed top-0 right-0 h-screen w-20 bg-gray-100 flex flex-col items-center justify-between p-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Chat
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Setting
      </button>
    </div>
  );
};

export default SideBar;
