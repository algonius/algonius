import React from 'react'
import { cn } from '~utils/utils'

export default function MiniButton(props: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    className?: string
    style?: React.CSSProperties
    tooltipTitle?: React.ReactNode
    tooltipPlacement?: "top" | "bottom" | "left" | "right" | "bottom-end" | "bottom-start" | "left-end" | "left-start" | "right-end" | "right-start" | "top-end" | "top-start"
}) {
    const { onClick, disabled, className, style, tooltipTitle, tooltipPlacement, children } = props
    const button = (
        <button onClick={onClick} disabled={disabled}
            className={cn(
                'bg-transparent hover:bg-gray-200',
                'border-none rounded',
                'h-8 w-8 p-1',
                disabled ? '' : 'cursor-pointer',
                className,
            )}
            style={style}
        >
            {children}
        </button>
    )
    if (!tooltipTitle) {
        return button
    }
    return (
        <div className="relative"> 
            {button}
            <div className={`absolute ${tooltipPlacement === 'top' ? 'bottom-full' : 'top-full'} left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white rounded-md shadow-md`}>
                {tooltipTitle}
            </div>
        </div>
    )
}
