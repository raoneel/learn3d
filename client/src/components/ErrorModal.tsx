import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

interface ErrorModalProps {
  onComplete(): void;
  isVisible: boolean;
  onClose(): void;
}

const ErrorModal = (props: ErrorModalProps) => {
  const toggle = () => {
    props.onComplete();
  };

  const cancel = () => {
    props.onClose();
  };

  return (
    <Modal isOpen={props.isVisible} toggle={toggle}>
      <ModalHeader toggle={toggle}>Warning</ModalHeader>
      <ModalBody>
        Changing you made in code <b>will be lost</b> when switching to coding
        blocks. Are you sure you want to continue?
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Switch to Blocks
        </Button>{" "}
        <Button color="secondary" onClick={cancel}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ErrorModal;
