import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ActionModal from '../action-modal/action-modal';




function ActionCard(props) {
    const { imgSrc, title, text, buttonText, buttonColor,onSendHendler,customObject } = props
    return (
        <div >
            <Card style={{ width: '10rem' }}>
                <Card.Img variant="top" style={{ objectFit: 'cover', width: '180', height: '180' }} src={imgSrc} />
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                        {text}
                    </Card.Text>
                    <ActionModal buttonColor={buttonColor} td={{}} buttonText={buttonText} customObject={customObject} onSendHendler={onSendHendler}></ActionModal>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ActionCard;