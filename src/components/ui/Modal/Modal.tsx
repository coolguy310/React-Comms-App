import React, { ReactNode } from "react";
import { Modal as ResponsiveModal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const modalStyles = {
  borderRadius: "0.5rem",
  padding: "2rem",
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <ResponsiveModal
      open={isOpen}
      styles={{
        modal: modalStyles,
      }}
      onClose={onClose}
      closeOnOverlayClick={false}
      center
    >
      {children}
    </ResponsiveModal>
  );
}
