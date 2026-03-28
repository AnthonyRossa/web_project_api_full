export default function ImagePopup(props) {
  const { name, link } = props.imageComponent;
  return (
    <>
      <img className="popup__image" alt={name} src={link} />
      <h4 className="popup__caption">{name}</h4>
    </>
  );
}
