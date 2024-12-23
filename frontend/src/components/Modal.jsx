const Modal = ({ closeModal, children }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} // Prevents click propagation to close the modal
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
