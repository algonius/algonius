interface Props { }

export default function Header(props: Props) {
    return (
        <header className="pt-3 pb-2 px-4 border-b border-gray-200"> 
            <div className="w-full mx-auto flex flex-row items-center">
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"> 
                    <span className="max-w-56 ml-3 text-lg font-medium">
                        Session Name
                    </span>
                </div>
            </div>
        </header>
    )
}