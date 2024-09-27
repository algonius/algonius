import { Box } from '@mui/material'
import InputBox from '~ui/components/InputBox'
import MessageList from '~ui/components/MessageList'
import Header from '~ui/components/Header'

import * as atoms from '../stores/atoms'
import { useAtomValue } from 'jotai'

interface Props {}

export default function MainPane(props: Props) {
    const currentSession = useAtomValue(atoms.currentSessionAtom)

    return (
        <Box
            className="h-full w-full"
            sx={{
                flexGrow: 1,
                marginLeft: `0px`,
            }}
        >
            <div className="flex flex-col h-full">
                <Header />
                <MessageList />
                <InputBox currentSessionId={currentSession.id} currentSessionType={currentSession.type || 'chat'}/>
            </div>
        </Box>
    )
}
