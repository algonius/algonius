import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/solid';
import { openSetting } from '~ui/stores/settingActions';

interface SideBarProps {}

const SideBar: React.FC<SideBarProps> = () => {
  return (
    <div className="switchbar w-[60px] min-w-[60px] py-2 flex flex-col items-center gap-4 h-full flex-grow overflow-x-hidden bg-blue-500">
      <div className="top-area flex-grow-0">
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4">
          <ChatBubbleLeftRightIcon className="h-6 w-6" /> 
          <label>Chat</label>
        </div>

        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4">
          <ChatBubbleLeftRightIcon className="h-6 w-6" /> 
          <label>Chat</label>
        </div>
      </div>

      <div className="divider flex-grow"></div>

      <div className="bottom-area flex-grow-0">
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4" onClick={() => openSetting()}>
          <Cog6ToothIcon className="h-6 w-6" /> 
        </div>

        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4">
          <UserIcon className="h-6 w-6" /> 
        </div>
      </div>
    </div>
  );
};

export default SideBar;

