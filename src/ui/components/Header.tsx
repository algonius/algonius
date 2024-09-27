import { useEffect } from 'react'
import { Typography, useTheme } from '@mui/material'
import { cn } from '~utils/utils'

interface Props { }

export default function Header(props: Props) {
    const theme = useTheme()
    
    return (
        <div
            className="pt-3 pb-2 px-4"
            style={{
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: theme.palette.divider,
            }}
        >
            <div className={cn('w-full mx-auto flex flex-row')}>
                <Typography
                    variant="h6"
                    color="inherit"
                    component="div"
                    noWrap
                    sx={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    className="flex items-center cursor-pointer"
                >
                    {
                        <Typography variant="h6" noWrap className={cn('max-w-56', 'ml-3')}>
                            Session Name
                        </Typography>
                    }
                </Typography>
            </div>
        </div>
    )
}
