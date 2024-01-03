import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

type UsersListCompProps = {
    data: object[]
}

export default   function UsersListComp (props: UsersListCompProps){
    const token = localStorage.getItem("Token")

    const deleteUser = (id: number) => {
        if (token){
            fetch("http://10.5.0.5:3000/deleteUser", {
                method: "POST",
                headers: {"Content-Type": "application/json",'Authorization': token},
                body: JSON.stringify({id: id})
            })
            .then((answer) => {
                setTimeout(()=>{
                    window.location.reload();
                },1000)
            })
        }
    }
    return (
        <>
            {props.data.map(user => (
                <tr>
                    <td>
                        <Link to={"/usuarios/atualizar/"+user.id}>
                            <Button variant="outline-primary"><i className="fa-solid fa-pen-to-square"></i></Button>{' '}
                        </Link>
                        <Button variant="outline-danger" onClick={() => deleteUser(user.id)}><i className="fa-solid fa-trash"></i></Button>{' '}
                    </td>
                    <td>
                        {user.id}
                    </td>

                    <td>
                        {user.name}
                    </td>

                    <td>
                        {user.email}
                    </td>
                </tr>
            ))}
        </>
    )
}

