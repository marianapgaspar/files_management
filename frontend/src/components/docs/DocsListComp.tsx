import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";

type DocsListCompProps = {
    data: object[]
}

export default   function DocsListComp (props: DocsListCompProps){
    const [answer, setAnswer] = useState("");
    const token = localStorage.getItem("Token")
    const permission = localStorage.getItem("Permission")
    const userId = localStorage.getItem("userId")
    const guest = (permission == "0" ? userId : 0)
    const [deletePermission, setDeletePermission] = useState(true);
    const [editPermission, setEditPermission] = useState(true);
    const deleteDocs = (id: number) => {
        if (token){
            fetch("http://10.5.0.5:3000/deleteDoc", {
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

            if (guest){
                const headers = {'Authorization': token}

                fetch("http://10.5.0.5:3000/getPermission?document_id="+id+"&guest="+guest,{headers})
                .then((response) => response.json())
                .then((json)=>{
                    setTimeout(()=>{
                        if (json.permission == 2){
                            setDeletePermission(false)
                        }
                        
                    },1000)
                });
            }
            if (permission == "0"){
                setEditPermission(false)
            }
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
                        <Link to={"/documentos/filhos/"+docs.id}>
                            <Button variant="outline-primary"><i className="fa-regular fa-eye"></i></Button>{' '}
                        </Link>
                        {(editPermission || docs.permission == "2") && 
                            <>
                                <Button variant="outline-danger" onClick={() => deleteDocs(docs.id)}><i className="fa-solid fa-trash"></i></Button>{' '}
                            </>
                        }
                    </td>
                    
                    <td>
                        {docs.name}
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

