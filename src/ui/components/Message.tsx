import { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import {
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Message, SessionType } from '../types/index'
import { cn } from '~/utils/utils'


export interface Props {
  id?: string
  sessionId: string
  sessionType: SessionType
  msg: Message
  className?: string
  collapseThreshold?: number
  hiddenButtonGroup?: boolean
  small?: boolean
}

export default function Message(props: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  const { msg, className, collapseThreshold, hiddenButtonGroup, small } = props

  return (
    <Box
      ref={ref}
      id={props.id}
      key={msg.id}
      className={cn(
        'group/message',
        'msg-block',
        'px-2',
        msg.generating ? 'rendering' : 'render-done',
        {
          user: 'user-msg',
          system: 'system-msg',
          assistant: 'assistant-msg',
        }[msg?.role || 'user'],
        className,
      )}
      sx={{
        margin: '0',
        paddingBottom: '0.1rem',
        paddingX: '1rem',
        [theme.breakpoints.down('sm')]: {
          paddingX: '0.3rem',
        },
      }}
    >
      <Avatar
        sx={{
          backgroundColor: theme.palette.primary.main,
          width: '28px',
          height: '28px',
        }}
      >
        <SmartToyIcon fontSize='small' />
      </Avatar>
      <p>
        {msg.content}
      </p>
    </Box>
  )
}
