import Table from 'react-bootstrap/Table';
import ActionModal from '../action-modal/action-modal';
import { Button } from 'react-bootstrap';

function AdminTable(props) {
    const { thArr, tdArr, customObject, handleDelete, onSendHendler } = props
    if (!tdArr) {
        return;
    }

    const idArrToString = (array) => {
        let listAsString = [];
        for (let i = 0; i < array.length; i++) {
            listAsString.push(`"${array[i]}" `);
        }
        listAsString.unshift("ids: ")
        return listAsString;
    }


    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>#</th>
                    {thArr.map(th => {
                        return (
                            <th key={th}>{th}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {tdArr.map((td, index) => {
                    return (
                        <tr key={index}>
                            <td>{index}</td>
                            {Object.values(td).map((tdContent, index) => {
                                let tdItem = td[thArr[index]];
                                tdItem = Array.isArray(tdItem) ? idArrToString(tdItem) : tdItem
                                return (
                                    <td key={index}>{tdItem}</td>
                                )
                            })}
                            <td width={75}>
                                {onSendHendler && 
                                <ActionModal buttonColor={"warning"} td={td} buttonText={"update"} customObject={customObject} onSendHendler={onSendHendler}></ActionModal>}
                            </td>
                            <td width={75}>
                                <Button variant={"danger"} onClick={() => handleDelete(td)}>
                                    delete
                                </Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    );
}

export default AdminTable;
//<ActionModal buttonColor={buttonColor} buttonText={buttonText}></ActionModal>