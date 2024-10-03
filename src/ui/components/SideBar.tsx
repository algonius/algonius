import React from 'react';
import { ChatBubbleLeftRightIcon, Cog6ToothIcon, UserIcon, SquaresPlusIcon } from '@heroicons/react/24/solid';
import { openSetting } from '~ui/stores/setting_actions';

interface SideBarProps {}

const SideBar: React.FC<SideBarProps> = () => {
  return (
    <div className="switchbar w-[60px] min-w-[60px] py-2 flex flex-col items-center gap-4 h-full flex-grow overflow-x-hidden bg-background">
      <div className="top-area flex-grow-0">
        <div className="bg-background hover:bg-primary/80 text-text font-bold py-2 px-4 flex flex-col items-center justify-center">
          <ChatBubbleLeftRightIcon className="h-6 w-6" /> 
          <label>Chat</label>
        </div>

        <div className="bg-background hover:bg-primary/80 text-text font-bold py-2 px-4 flex flex-col items-center justify-center">
          <ChatBubbleLeftRightIcon className="h-6 w-6" /> 
          <label>strategy</label>
        </div>
      </div>

      <div className="divider flex-grow"></div>

      <div className="bottom-area flex-grow-0">
        <div className="bg-background hover:bg-primary/80 text-text font-bold py-2 px-4 flex flex-col items-center justify-center">
          <SquaresPlusIcon className="h-6 w-6" /> 
        </div>

        <div className="bg-background hover:bg-primary/80 text-text font-bold py-2 px-4 flex flex-col items-center justify-center" onClick={() => openSetting()}>
          <Cog6ToothIcon className="h-6 w-6" /> 
        </div>

        <div className="bg-background hover:bg-primary/80 text-text font-bold py-2 px-4 flex flex-col items-center justify-center">
          <UserIcon className="h-6 w-6" /> 
        </div>
      </div>
    </div>
  );
};

export default SideBar;


