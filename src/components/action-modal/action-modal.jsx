import React, { useState, useRef  } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function ActionModal(props) {
  const {buttonColor,buttonText,customObject,onSendHendler,td} = props

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const formRef = useRef(null);
  
  const onSendprocesser = () => {
    let formControllers = [...formRef.current]
    let obj = {};
    formControllers.forEach(control => 
    {
      obj[control.placeholder] = control.placeholder == "isAdmin"? control.checked : control.value ; 
      return obj
    });
    onSendHendler({...td, ...obj});
    handleClose();
  }
  return (
    <>
      <Button variant={buttonColor ? buttonColor : "primary"} onClick={handleShow}>
      {buttonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            {
              customObject&&
              customObject.map((obj,index) =>{
                const {fieldName, fieldType, placeholder} = obj;
                return(
                  <div key={index}>
                  
                  {fieldType === "checkbox"? 
                  <>
                  <Form.Label >{""}</Form.Label> 
                  <Form.Check type="checkbox" label={placeholder} placeholder={placeholder} defaultChecked={td[placeholder] == "yes"? true : false} /> 
                  </>
                  : 
                  <>
                  <Form.Label >{fieldName}</Form.Label> 
                  <Form.Control
                    type={fieldType? fieldType : "text"}
                    placeholder={placeholder}
                    defaultValue={td[placeholder]}
                  />
                  </>
                  }
                  </div>
                )
              })
            }
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {onSendHendler && <Button variant="primary" onClick={() => onSendprocesser()} >
            Send
          </Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
}
//onClick={(arg) => onSendHendler(arg)}
//render(<ActionModal />);
export default ActionModal;