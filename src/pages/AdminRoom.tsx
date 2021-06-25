import { useHistory, useParams } from 'react-router-dom'

//import { useAuth } from '../hooks/useAuth'
//import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { UseRoom } from '../hooks/useRoom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss'
import { database } from '../services/firebase'

type RoomParams = {
    id:string;
}

export function AdminRoom(){
    
    //const {session} = useAuth()
    const params = useParams<RoomParams>()
    const history = useHistory()

    const roomId = params.id
    const {title, questions} = UseRoom(roomId)

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
           endedAt: new Date(),
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que você deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string, answered: boolean) {
        if(answered){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered:false,
            })
        }else{
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered:true,
            })
        }
    }

    async function handleHighlightQuestion(questionId: string, highlighted: boolean) {
        console.log(highlighted)
        if(highlighted){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted:false,
            })
        }else{
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted:true,
            })
        }
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutline onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                    
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta's</span>}  
                </div>

                
                <div className="question-list">
                    {questions.map( question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                <button onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}>
                                    <img src = {checkImg} alt="Marcar como pergunta respondida" />
                                </button>
                                {!question.isAnswered? (
                                    <button onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}>
                                        <img src = {answerImg} alt="Dar destaque" />
                                    </button>                                    
                                ) : (
                                    <button onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)} disabled>
                                        <img src = {answerImg} alt="Dar destaque" />
                                    </button>                                
                                )}
                                
                                <button onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src = {deleteImg} alt="Delete" />
                                </button>
                            </Question>

                        )                        
                    })}
                </div>                
                {console.table(JSON.stringify(questions))}
            </main>
        </div>
    )
}