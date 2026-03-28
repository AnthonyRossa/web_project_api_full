export default function RemoveCard({ deleteComponent, onCardDelete }) {
  const handleDeleteCard = () => {
    onCardDelete(deleteComponent);
  };

  return (
    <>
      <button
        type="button"
        className="popup__button"
        onClick={handleDeleteCard}
      >
        Deletar
      </button>
    </>
  );
}
