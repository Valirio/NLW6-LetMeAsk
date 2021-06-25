
import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'



type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps){



    function copyRoomCodeClipboard(){
        navigator.clipboard.writeText(props.code)
    }

    return(
        <button className="room-code" onClick={copyRoomCodeClipboard}>
            <div>
                <img src={copyImg} alt="Copy Room Code" />
            </div>
            <span>sala #{props.code}</span>
        </button>
    )
}