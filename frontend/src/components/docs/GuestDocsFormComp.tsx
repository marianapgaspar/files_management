import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import GuestsListComp from "./GuestsListComp";


type GuestsDocsProp = {
    id: string;
};
export default function GuestsDocsFormComp (props: GuestsDocsProp) {
    const [answer, setAnswer] = useState("");
    const [userPermission, setUserPermission] = useState("0");
    const [userId, setUserId] = useState("0");
    const [guestOptions, setGuestOptions] = useState([]);
    const token = localStorage.getItem("Token")

    useEffect(()=>{
        if (token){
            const headers = {'Authorization': token}

            fetch("http://10.5.0.5:3000/getGuestOptions",{headers})
            .then((response) => response.json())
            .then((json)=>{
                setGuestOptions(json)
            });
        }
        
    }, [])
    const addUser = () => {
        if (!userPermission){
            setAnswer("Favor preencher todos os campos");
            return
        } 
        var user = {guest_id: userId, permission: userPermission, document_id: props.id};
        if (token){
            fetch("http://10.5.0.5:3000/addGuest", {
                method: "POST",
                headers: {"Content-Type": "application/json",'Authorization': token},
                body: JSON.stringify(user)
                })
                .then((answer) => {
                    setTimeout(()=>{
                        setAnswer(answer.statusText)
                    },1000)
                })
        }
        
    }
    return(
        <>
            <div className='container-xxl bd-gutter mt-3 my-md-4 bd-layout'>
                    <div className="pd-x-20 pd-sm-x-50 pd-t-20 pd-sm-t-15">
                        <h4 className="tx-gray-800 mg-b-5">Adicionar colaborador</h4>
                    </div>
                <div className="card">
                    <div className="card-body">
                        <div className="col-md-12">
                        {answer != "" && 
                            <Alert variant="warning">
                                {answer}
                            </Alert>}
                            <div className="form-group">
                                <label>Usuário</label>
                                <select className="form-control" name="user_id" value={userId} onChange={e => setUserId(e.target.value)}>
                                    <option value="0">--Selecione--</option>
                                    {   
                                        guestOptions.map(guest=>{
                                            return <option value={guest.id}>{guest.name}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Permissão</label>
                                <select className="form-control" name="permission" value={userPermission} onChange={e => setUserPermission(e.target.value)}>
                                    <option value="0">Convidado</option>
                                    <option value="1">Edição</option>
                                    <option value="2">Edição e exclusão</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-footer" style={{marginTop: "15px"}}>
                        <div className="row justify-content-center"></div>
                        <button className="btn btn-success" style={{margin: "15px"}} onClick={() => addUser()}>Salvar</button>
                    </div>
                </div>
            </div>
        </>
    );
}
