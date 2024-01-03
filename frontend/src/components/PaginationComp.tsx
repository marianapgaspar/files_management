import Pagination from 'react-bootstrap/Pagination';


export default function PaginationComp () {
    let active = 2;
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
            {number}
            </Pagination.Item>,
        );
    }

    const paginationBasic = (
        <div>
            <Pagination size="sm" style={{marginLeft: "15px"}}>{items}</Pagination>
        </div>
    );

    return(paginationBasic)
}