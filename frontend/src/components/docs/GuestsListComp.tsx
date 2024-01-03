import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";

type DocsListCompProps = {
    data: object[]
}

export default   function GuestsListComp (props: DocsListCompProps){
    const [answer, setAnswer] = useState("");
    const token = localStorage.getItem("Token")

    const deleteDocs = (id: number) => {
        if (token){
            fetch("http://10.5.0.5:3000/deleteGuest", {
                method: "POST",
                headers: {"Content-Type": "application/json",'Authorization': token},
                body: JSON.stringify({id: id})
            })
            .then((answer) => {
                setTimeout(()=>{
                    setAnswer(answer.statusText);
                    handleShowDelete();
                },1000)
            })
        }
        
    }
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    return (
        <>
            {props.data.map(docs => (
                <tr>
                    <td>
                        <Button variant="outline-danger" onClick={() => deleteDocs(docs.id)}><i className="fa-solid fa-trash"></i></Button>{' '}
                    </td>
                    
                    <td>
                        {docs.user_name}
                    </td>

                    <td>
                        {docs.permission}
                    </td>
                   
                </tr>
            ))}


            <Modal show={showDelete} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Mensagem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        {answer != "" && 
                            <Alert variant="warning">
                            {answer}
                        </Alert>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{window.location.reload()}}>
                    Sair
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

