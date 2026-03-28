export default function Card(props) {
  const { name, link, isLiked } = props.card;
  const { handleOpenPopup, card, onCardLike, onCardDeletePopup } = props;

  const imageComponent = {
    name: name,
    link: link,
  };

  const cardsLikeButtonClassName = `cards__like-button ${
    isLiked ? "cards__like-button_active" : ""
  }`;

  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onCardDeletePopup(card);
  };

  return (
    <li className="cards__card">
      <img
        className="cards__card-image"
        src={link}
        alt={name}
        onClick={() => handleOpenPopup(imageComponent)}
      />
      <button
        className="cards__delete-button"
        type="button"
        aria-label="Delete card"
        onClick={handleDeleteClick}
      />
      <div className="cards__card-content">
        <h2 className="cards__card-title">{name}</h2>
        <button
          className={cardsLikeButtonClassName}
          onClick={handleLikeClick}
          type="button"
          aria-label="Like card"
        />
      </div>
    </li>
  );
}
