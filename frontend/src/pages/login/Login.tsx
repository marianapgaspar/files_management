import { useState } from "react";
import { Alert } from "react-bootstrap";

export default function Login(){
    const [answer, setAnswer] = useState("");
    const [userName, setName] = useState("");
    const [userPassword, setPassword] = useState("");

    const authenticate = () => {
        if (!userName || !userPassword){
            setAnswer("Favor preencher todos os campos");
            return
        } 
        var user = {name: userName, password: userPassword};
        fetch("http://10.5.0.5:3000/authenticate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        })
        .then((response) => response.json())
        .then((answer) => {
            setTimeout(()=>{
                setAnswer(answer.message)
                localStorage.setItem("Token", answer.token);
                localStorage.setItem("Permission", answer.user.permission);
                localStorage.setItem("userId", answer.user.id);
                window.location.reload();
            },1000)
        })
    }
    return (
    <div className="d-flex justify-content-center ">
        <div className='col-md-4'>
            <div className="pd-x-20 pd-sm-x-50 pd-t-20 pd-sm-t-15">
                <h4 className="tx-gray-800 mg-b-5">Login</h4>
                <div className="card">
                    <div className="bd bd-gray-300 rounded table-responsive">
                        <div className="card-body">
                            <div className="row">
                                  {answer != "" && 
                                  <Alert variant="warning">
                                      {answer}
                                  </Alert>}
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="form-label">Nome</label>
                                        <input className="form-control" type="text" name="name" onChange={e => setName(e.target.value)} value={userName}/>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="form-label">Senha</label>
                                        <input className="form-control" type="password"  name="password" onChange={e => setPassword(e.target.value)} value={userPassword}/>
                                    </div>
                                </div>
                            </div>
                        
                        </div>
                        <div className="card-footer" style={{marginTop: "15px"}}>
                            <div className="row justify-content-center"></div>
                            <button className="btn btn-success" style={{margin: "15px"}} onClick={() => authenticate()}>Entrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}