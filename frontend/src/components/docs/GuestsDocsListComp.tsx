import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import GuestsListComp from "./GuestsListComp";

type GuestsDocsProp = {
    id: string;
};

export default function GuestsDocsListComp (props: GuestsDocsProp) {
    const [dataGuests, setDataGuests] = useState([]);
    const token = localStorage.getItem("Token")

    useEffect(()=>{
        if (token){
            const headers = {'Authorization': token}

            fetch("http://10.5.0.5:3000/getGuestsByDocs?document_id="+props.id,{headers})
            .then((response) => response.json())
            .then((json)=>{
                setTimeout(()=>{
                    setDataGuests(json)
                    
                },1000)
            });
        }
       
      }, [])
    return(
        <>
            <div className='container-xxl bd-gutter mt-3 my-md-4 bd-layout'>
                    <div className="pd-x-20 pd-sm-x-50 pd-t-20 pd-sm-t-15">
                        <h4 className="tx-gray-800 mg-b-5">Lista de colaboradores</h4>
                    </div>
                <div className="card">
                    <div className="bd bd-gray-300 rounded table-responsive">
                        <table className='table mg-b-0'>
                            <thead>
                                <tr>
                                    <th></th>
                                    
                                    <th>
                                    Nome
                                    </th>
                                    <th>
                                    Permissão
                                    </th>
                                
                                </tr>
                            </thead>

                        <tbody>
                            <GuestsListComp data={dataGuests}/>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
