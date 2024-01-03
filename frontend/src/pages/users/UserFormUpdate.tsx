import { Link, useParams } from "react-router-dom"
import UserFormUpdateComp from "../../components/users/UserFormCompUpdate";

export default function UserFormUpdate (){
    type UserParams = {
        id: string;
      };
    const {id} = useParams<UserParams>();
    if (id){
        return (
            <div className='container-xxl bd-gutter mt-3 my-md-4 bd-layout'>
                <div className="pd-x-20 pd-sm-x-50 pd-t-20 pd-sm-t-15">
                    <h4 className="tx-gray-800 mg-b-5">Atualizar usuário {id}</h4>
                </div>
                <div className="card">
                    <div className="bd bd-gray-300 rounded table-responsive">
                        <div className="card-header">
    
                            <ul className="nav nav-pills card-header-pills">
                                <li className="nav-item">
                                    <Link to={"/usuarios"} className="nav-link active">
                                        Voltar
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <UserFormUpdateComp id={id}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}