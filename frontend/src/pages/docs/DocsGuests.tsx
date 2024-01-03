import { Link, useParams } from "react-router-dom"
import UserFormUpdateComp from "../../components/users/UserFormCompUpdate";
import { Button } from "react-bootstrap";

export default function DocsGuests (){
    type UserParams = {
        id: string;
      };
    const {id} = useParams<UserParams>();
    if (id){
        return (
            <>
                <div className="col-md-6">
                  <div className='container-xxl bd-gutter mt-3 my-md-4 bd-layout'>
                        <div className="pd-x-20 pd-sm-x-50 pd-t-20 pd-sm-t-15">
                            <h4 className="tx-gray-800 mg-b-5">Documentos</h4>
                        </div>
                      <div className="card">
                          <div className="bd bd-gray-300 rounded table-responsive">
                              <div className="card-header">
                            
                              <ul className="nav nav-pills card-header-pills">
                                  <li className="nav-item">
                                  <Button variant="primary">
                                      <i className="fa-solid fa-plus"></i>
                                  </Button>
                                  </li>
                                  <li className="nav-item" style={{marginLeft: "10px"}}>
                                  <Link to={"/usuarios/adicionar"} >
                                      <Button variant="outline-secondary">
                                          <i className="fa-solid fa-user-plus"></i>
                                      </Button>
                                  </Link>
                                  
                                  </li>
                              </ul>
                            </div>
                            <table className='table mg-b-0'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        
                                        <th>
                                          Nome
                                        </th>
                                      
                                    </tr>
                                </thead>

                              <tbody>

                              </tbody>
                            </table>
                          </div>
                      </div>
                  </div>
                </div>

                <div className="col-md-6">
                  
                </div>
            </>
        )
    }
}