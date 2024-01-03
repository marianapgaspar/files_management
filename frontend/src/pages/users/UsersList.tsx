import {useEffect, useState} from "react"
import UsersListComp from "../../components/users/UsersListComp";
import { Link } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';


export default function UsersList () {
    const [data, setData] = useState([]);

    const [activePage, setActivePage] = useState(0);
    useEffect(()=>{
        const token = localStorage.getItem("Token")
        if (token){
            const headers = {'Authorization': token}
            fetch("http://10.5.0.5:3000/getAllUsers", {headers})
                .then((response) => response.json())
                .then((json)=>{
                    setTimeout(()=>{
                        setData(json)
                        
                    },1000)
                });
        }
    }, [])
      var initialData = (activePage * 5) ;
      var tempData = data.slice(initialData,initialData+5)
      let items = [];
      for (let number = 0; number <= data.length / 5; number++) {
          items.push(
              <Pagination.Item key={number} active={number === activePage} onClick={() => setActivePage(number)} >
              {number +1}
              </Pagination.Item>,
          );
      }

      const paginationBasic = (
          <div>
              <Pagination size="sm" style={{marginLeft: "15px"}}>{items}</Pagination>
          </div>
      );
      return (
      <div className='container-xxl bd-gutter mt-3 my-md-4 bd-layout'>
        <div className="pd-x-20 pd-sm-x-50 pd-t-20 pd-sm-t-15">
          <h4 className="tx-gray-800 mg-b-5">Usuários</h4>
        </div>
        <div className="card">
          <div className="bd bd-gray-300 rounded table-responsive">
            <div className="card-header">
            
            <ul className="nav nav-pills card-header-pills">
              <li className="nav-item">
                <Link to={"/usuarios/adicionar"} className="nav-link active">
                  Inserir
                </Link>
              </li>
            </ul>
            </div>
            <table className='table mg-b-0'>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    Id
                  </th>
                  <th>
                    Nome
                  </th>
                  <th>
                    Email
                  </th>
                </tr>
              </thead>

              <tbody>
                <UsersListComp data={tempData}/>
              </tbody>
            </table>
            <Pagination size="sm" style={{marginLeft: "15px"}}>{items}</Pagination>
          </div>
        </div>
      </div>
    )
}