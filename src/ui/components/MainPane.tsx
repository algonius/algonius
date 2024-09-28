import InputBox from '~ui/components/InputBox'
import MessageList from '~ui/components/MessageList'
import Header from '~ui/components/Header'

import * as atoms from '../stores/atoms'
import { useAtomValue } from 'jotai'

interface Props {}

export default function MainPane(props: Props) {
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <div className="h-full w-full flex flex-col">
            <Header />
            <div className="flex-grow overflow-y-auto">
                <MessageList />
            </div>
            <InputBox 
                currentSessionId={currentSession.id} 
                currentSessionType={currentSession.type || 'chat'}
            />
        </div>
    )
}