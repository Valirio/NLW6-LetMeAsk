import { useState, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'


import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { database } from '../services/firebase'




import '../styles/auth.scss'


export function NewRoom(){
    
    const { session } = useAuth()
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory();

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault()

        if(newRoom.trim() === ''){
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRom = await roomRef.push({
            title: newRoom,
            authorId: session?.id,
        })

        history.push(`/rooms/${firebaseRom.key}`)
    }

    return(
        <div id="page-auth">
            <aside>            
                <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salar de Q&A ao-vivo</strong>
                <p>Tire duvidas da sua sala em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Digite o Código da sala"
                            onChange={event => setNewRoom(event.target.value)}
                        />
                        <Button type="submit">
                            Criar Sala
                        </Button>
                    </form>
                    <p>
                        quer entrar em uma sala existente? <Link to="/">Clique aqui!</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}