import {useEffect, useState} from "react";
import { Alert } from "react-bootstrap";

type UserFormUpdateCompProps = {
    id: string
}
export default   function UserFormUpdateComp (props: UserFormUpdateCompProps){
    const [answer, setAnswer] = useState("");
    const [userName, setName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");
    const [userPermission, setUserPermission] = useState("0");
    const token = localStorage.getItem("Token")

    useEffect(()=>{
        if (token){
            const headers = {'Authorization': token}
            fetch("http://10.5.0.5:3000/getUserById?id="+props.id,{headers})
            .then((response) => response.json())
            .then((json)=>{
                setTimeout(()=>{
                    setName(json.name)
                    setEmail(json.email)
                    setPassword(json.password)
                    setUserPermission(json.permission)
                },1000)
            });
        }
        
    }, [])
    const updateUser = () => {
        if (!userName || !userEmail || !userPassword){
            setAnswer("Favor preencher todos os campos");
            return
        } 
        var user = {name: userName, email: userEmail, password: userPassword};
        if (token){
            fetch("http://10.5.0.5:3000/updateUser?id="+props.id, {
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
    return (
    <div className="row">
        {answer != "" && 
        <Alert variant="warning">
            {answer}
        </Alert>}
        <div className="col-md-4">
            <div className="form-group">
                <label className="form-label">Nome</label>
                <input className="form-control" type="text" name="name" disabled onChange={e => setName(e.target.value)} value={userName}/>
            </div>
        </div>
        
        <div className="col-md-4">
            <div className="form-group">
                <label className="form-label">E-mail</label>
                <input className="form-control" type="email"  name="email" onChange={e => setEmail(e.target.value)} value={userEmail}/>
            </div>
        </div>
        
        <div className="col-md-4">
            <div className="form-group">
                <label className="form-label">Senha</label>
                <input className="form-control" type="password"  name="password" onChange={e => setPassword(e.target.value)} value={userPassword}/>
            </div>
        </div>
        <div className="col-md-4">
            <div className="form-group">
                <label>Permissão</label>
                <select className="form-control" name="permission" value={userPermission} onChange={e => setUserPermission(e.target.value)}>
                    <option value="0">Convidado</option>
                    <option value="1">Criador</option>
                    <option value="2">Administrador</option>
                </select>
            </div>
        </div>
        <div className="card-footer" style={{marginTop: "15px"}}>
            <div className="row justify-content-center"></div>
            <button className="btn btn-success" style={{margin: "15px"}} onClick={() => updateUser()}>Salvar</button>
        </div>
    </div>
  );
};
