import { Link, useParams } from "react-router-dom";
import DocsListComp from "../../components/docs/DocsListComp";
import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Alert, Button } from "react-bootstrap";
import GuestsDocsListComp from "../../components/docs/GuestsDocsListComp";
import GuestsDocsFormComp from "../../components/docs/GuestDocsFormComp";
import FilesListComp from "../../components/docs/FilesListComp";


export default function DocsListChild () {
    type DocsListChildParams = {
        id: string;
      };
    const {id} = useParams<DocsListChildParams>();
    const [dataDocs, setDataDocs] = useState([]);
    const [dataFiles, setDataFiles] = useState([]);
    const [doc, setDoc] = useState({});
  
    const [showInsert, setShowInsert] = useState(false);
    const handleCloseInsert = () => setShowInsert(false);
    const handleShowInsert = () => setShowInsert(true);

    const [docsName, setName] = useState("");
    const [answer, setAnswer] = useState("");
    const [file, setFile] = useState("");

    const [showInsertFile, setShowInsertFile] = useState(false);
    const handleCloseInsertFile = () => setShowInsertFile(false);
    const handleShowInsertFile = () => setShowInsertFile(true);
    const token = localStorage.getItem("Token")
    const permission = localStorage.getItem("Permission")
    const userId = localStorage.getItem("userId")
    const [createPermission, setCreatePermission] = useState(true);
    const [guestPermission, setGuestPermission] = useState(false);

    const addDocs = () => {
        if (!docsName){
            setAnswer("Favor preencher todos os campos");
            return
        } 
        if (token){
            fetch("http://10.5.0.5:3000/addDocs", {
                method: "POST",
                headers: {"Content-Type": "application/json",'Authorization': token},
                body: JSON.stringify({name: docsName, owner_id: userId, father_id: id})
            })
            .then((answer) => {
                setTimeout(()=>{
                    setAnswer(answer.statusText)
                    window.location.reload();
                },1000)
                handleCloseInsert();
            })
        }
    }
    const addFile = () => {
        if (!file){
            setAnswer("Favor preencher todos os campos");
            return
        } 
        const files = document.getElementById("files");
        const formData = new FormData();
        if (files !== null){
            for(let i =0; i < files.files.length; i++) {
                formData.append("files", files.files[i]);
            }
            if (id !== undefined){
                formData.append('document_id', id);
            }
            if (userId !== null){
                formData.append('owner_id', userId.toString());
            }
            if (token){
                fetch("http://10.5.0.5:3000/addFile", {
                    method: 'POST',
                    body: formData,
                    headers: {'Authorization': token},
                })
                .then((answer) => {
                    setTimeout(()=>{
                        setAnswer(answer.statusText)
                        handleCloseInsertFile();
                    },1000)
                })
            }
        }
    }
    
    useEffect(()=>{
        if (token){
            const headers = {'Authorization': token}
            const guest = (permission == "0" ? userId : 0)
            const creator = permission == "1" ? userId : 0

            fetch("http://10.5.0.5:3000/getDocById?id="+id,{headers})
            .then((response) => response.json())
            .then((json)=>{
                setTimeout(()=>{
                    setDoc(json)
                    
                },1000)
            });

            fetch("http://10.5.0.5:3000/getDocsByFather?father_id="+id+"&creator="+creator+"&guest="+guest,{headers})
            .then((response) => response.json())
            .then((json)=>{
                setTimeout(()=>{
                    setDataDocs(json)
                    
                },1000)
            });

            fetch("http://10.5.0.5:3000/getFilesByDoc?document_id="+id,{headers})
            .then((response) => response.json())
            .then((json)=>{
                setTimeout(()=>{
                    setDataFiles(json)
                    
                },1000)
            });
            if (guest){
                setGuestPermission(true)
                fetch("http://10.5.0.5:3000/getPermission?document_id="+id+"&guest="+guest,{headers})
                .then((response) => response.json())
                .then((json)=>{
                    setTimeout(()=>{
                        if (json.permission == 0){
                            setCreatePermission(false)
                        }
                        
                    },1000)
                });
            }
        }
    }, [])

    return (
        <>

        <div className="col-md-12">
            {/* --------------------- LISTAS DE ARQUIVOS NA PASTA  -------------------------- */}
            <div className='container-xxl bd-gutter mt-3 my-md-4 bd-layout'>
                    <div className="pd-x-20 pd-sm-x-50 pd-t-20 pd-sm-t-15">
                        <h4 className="tx-gray-800 mg-b-5">Documentos <i className="fa-solid fa-arrow-right"></i> {doc.name}</h4>
                    </div>
                <div className="card">
                    <div className="bd bd-gray-300 rounded table-responsive">
                        <div className="card-header">
                        
                        {createPermission === true && 
                        <ul className="nav nav-pills card-header-pills">
                            <li className="nav-item">
                                <Button variant="primary" onClick={handleShowInsert}>
                                    <i className="fa-solid fa-plus"></i> Adicionar pasta
                                </Button>
                            </li>
                            <li className="nav-item" style={{marginLeft: "10px"}}>
                                <Button variant="outline-primary" onClick={handleShowInsertFile}>
                                    <i className="fa-solid fa-plus"></i> Adicionar arquivo
                                </Button>
                            </li>
                        </ul>
                        }
                        </div>
                        <table className='table mg-b-0'>
                            <thead>
                                <tr>
                                    <th></th>
                                    
                                    <th>
                                    Nome
                                    </th>
                                    <th>
                                    Autor
                                    </th>
                                </tr>
                            </thead>

                        <tbody>
                            <DocsListComp data={dataDocs}/>
                            <FilesListComp data={dataFiles}/>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        {guestPermission === false &&
            <div className="row row-sm mg-t-20 d-flex justify-content-center">
            <div className="col-md-4">
                {id !== undefined && <GuestsDocsListComp id={id}/>}
            </div>
                    <div className="col-md-4">
                        {id !== undefined && <GuestsDocsFormComp id={id}/>}
                    </div>
            </div>
        }
        
      

        {/* --------------------- ADICIONAR NOVA PASTA -------------------------- */}
        <Modal show={showInsert} onHide={handleCloseInsert}>
          <Modal.Header closeButton>
              <Modal.Title>Adicionar nova pasta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="row">
                  {answer != "" && 
                    <Alert variant="warning">
                      {answer}
                  </Alert>}
                  <div className="col-md-12">
                      <div className="form-group">
                          <label className="form-label">Nome</label>
                          <input className="form-control" type="text" name="name" onChange={e => setName(e.target.value)}/>
                      </div>
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseInsert}>
              Sair
            </Button>
            <Button variant="primary" onClick={()=>{
              addDocs()
            }}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
    {   /* --------------------- ADD FILE -------------------------- */}
            <Modal show={showInsertFile} onHide={handleCloseInsertFile}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar novo arquivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        {answer != "" && 
                            <Alert variant="warning">
                            {answer}
                        </Alert>}
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="form-label">Nome</label>
                                <input className="form-control" type="file" name="name" id="files" onChange={e => setFile(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseInsertFile}>
                        Sair
                    </Button>
                    <Button variant="primary" onClick={()=>{addFile()}}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
      </>
    
    
    )
}