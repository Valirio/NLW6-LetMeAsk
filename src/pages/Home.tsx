import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

import { Button } from '../components/Button'

import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'
import GoogleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { database } from '../services/firebase'


export function Home(){
    const history = useHistory()
    const { session, signInWithGoogle} = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function heandleCreateRoom(){
        if(!session){
            await signInWithGoogle()
        }        
        
        history.push('/rooms/new')        
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault()
        
        if(roomCode.trim() === ''){
            return;
        }
        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        
        if(!roomRef.exists()){
           alert('Room does not exists');
           return; 
        }

        if(roomRef.val().endedAt){
            alert('Room already closed')
            return;
        }

        history.push(`/rooms/${roomCode}`);

    }
    return(
        <div id="page-auth">
            <aside>
                <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie sala de Q&A ao-vivo</strong>
                <p>Tire duvidas da sua sala em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="Letmeask" />
                    <button onClick={heandleCreateRoom} className="create-room">
                        <img src={GoogleIconImg} alt="Logo do Google" />
                        crie uma sala com o google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o Código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na Sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}