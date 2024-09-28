import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SendHorizontal, Settings2 } from 'lucide-react'
import { cn } from '~/utils/utils'
import MiniButton from './MiniButton'
import _ from 'lodash'
import * as sessionActions from '../stores/sessionActions'
import { useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { SessionType, createMessage } from '../types/index'

export interface Props {
    currentSessionId: string
    currentSessionType: SessionType
}

export default function InputBox(props: Props) {
    // Removed useTheme hook and related theme usage
    const setChatConfigDialogSession = useSetAtom(atoms.chatConfigDialogAtom)
    const { t } = useTranslation()
    const [messageInput, setMessageInput] = useState('')
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    const handleSubmit = (needGenerating = true) => {
        if (messageInput.trim() === '') {
            return
        }
        const newMessage = createMessage('user', messageInput)
        sessionActions.submitNewUserMessage({
            currentSessionId: props.currentSessionId,
            newUserMsg: newMessage,
            needGenerating,
        })
        setMessageInput('')
    }

    const minTextareaHeight = 66
    const maxTextareaHeight = 96

    const onMessageInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = event.target.value
        setMessageInput(input)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey
        ) {
            event.preventDefault()
            handleSubmit()
            return
        }
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault()
            handleSubmit(false)
            return
        }
    }

    const [easterEgg, setEasterEgg] = useState(false)

    return (
        <div className="pl-2 pr-4 border-t border-gray-300">
            <div className={cn('w-full mx-auto flex flex-col')}>
                <div className="flex flex-row flex-nowrap justify-between py-1">
                    <div className="flex flex-row items-center">
                        <MiniButton
                            className="mr-2 text-gray-700 hover:text-gray-900"
                            onClick={() =>
                                setChatConfigDialogSession(sessionActions.getCurrentSession())
                            }
                            tooltipPlacement="top"
                        >
                            <Settings2 className="w-5 h-5" />
                        </MiniButton>
                    </div>
                    <div className="flex flex-row items-center">
                        <MiniButton
                            className="w-8 ml-2 bg-blue-500 text-white hover:bg-blue-600"
                            tooltipPlacement="top"
                            onClick={() => handleSubmit()}
                        >
                            <SendHorizontal className="w-5 h-5" />
                        </MiniButton>
                    </div>
                </div>
                <div className="w-full pl-1 pb-2">
                    <textarea
                        className={cn(
                            `w-full max-h-[${maxTextareaHeight}px]`,
                            'overflow-y-auto resize-none border-none outline-none bg-transparent p-1 text-gray-700 font-sans text-base'
                        )}
                        value={messageInput}
                        onChange={onMessageInput}
                        onKeyDown={onKeyDown}
                        ref={inputRef}
                        style={{
                            height: 'auto',
                            minHeight: `${minTextareaHeight}px`,
                        }}
                        placeholder={t('Type your question here...') || ''}
                    />
                    <div className="flex flex-row items-center"></div>
                </div>
            </div>
        </div>
    )
}
