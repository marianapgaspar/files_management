import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";

type FilesListCompProps = {
    data: object[]
}

export default   function FilesListComp (props: FilesListCompProps){
    const [answer, setAnswer] = useState("");
    const token = localStorage.getItem("Token")
    const permission = localStorage.getItem("Permission")
    const userId = localStorage.getItem("userId")
    const guest = (permission == "0" ? userId : 0)
    const [deletePermission, setDeletePermission] = useState(true);

    const deleteFile = (id: number, name: string) => {
        if (token){
            fetch("http://10.5.0.5:3000/deleteFile", {
                method: "POST",
                headers: {"Content-Type": "application/json",'Authorization': token},
                body: JSON.stringify({id: id, name: name})
            })
            .then((answer) => {
                setTimeout(()=>{
                    setAnswer(answer.statusText);
                    handleShowDelete();
                },1000)
            })
        }
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
    }
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    return (
        <>
            {props.data.map(docs => (
                <tr>
                    <td>
                        <Link to={"http://10.5.0.5:3000/getFile?name="+docs.name}>
                            <Button variant="outline-primary"><i className="fa-regular fa-eye"></i></Button>{' '}
                        </Link>
                        {deletePermission === true && 
                            <>
                                <Button variant="outline-danger" onClick={() => deleteFile(docs.id, docs.name)}><i className="fa-solid fa-trash"></i></Button>{' '}
                            </>
                        }
                        
                    </td>
                    
                    <td>
                        {docs.original_name}
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

