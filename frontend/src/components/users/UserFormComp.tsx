import {useState} from "react";
import { Alert } from "react-bootstrap";


export default   function UserFormComp (){
    const [answer, setAnswer] = useState("");
    const [userName, setName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");
    const [userPermission, setUserPermission] = useState("0");
    const token = localStorage.getItem("Token")

    const addUser = () => {
        if (!userName || !userEmail || !userPassword){
            setAnswer("Favor preencher todos os campos");
            return
        } 
        var user = {name: userName, email: userEmail, password: userPassword, permission: userPermission};
        if (token){
            fetch("http://10.5.0.5:3000/addUser", {
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
                <input className="form-control" type="text" name="name" onChange={e => setName(e.target.value)}/>
            </div>
        </div>
        
        <div className="col-md-4">
            <div className="form-group">
                <label className="form-label">E-mail</label>
                <input className="form-control" type="email"  name="email" onChange={e => setEmail(e.target.value)}/>
            </div>
        </div>
        
        <div className="col-md-4">
            <div className="form-group">
                <label className="form-label">Senha</label>
                <input className="form-control" type="password"  name="password" onChange={e => setPassword(e.target.value)}/>
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
            <button className="btn btn-success" style={{margin: "15px"}} onClick={() => addUser()}>Salvar</button>
        </div>
    </div>
  );
};
