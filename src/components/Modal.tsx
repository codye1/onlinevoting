// Modal.tsx

import closeIcon from '../../public/close.svg';
import { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  close: () => void;
}

const Modal = ({ children, close }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center ">
      <div
        onClick={close}
        className="fixed inset-0 bg-black opacity-50 z-40"
        aria-hidden="true"
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 bg-[#242424] p-6 rounded-md shadow-lg w-full max-w-[847px] mx-auto mr-[30px] ml-[30px] max-h-[80vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 cursor-pointer"
          aria-label="Close modal"
        >
          <img src={closeIcon} alt="Close" className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
