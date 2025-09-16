export default function Dialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog">
      <p>{message}</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}
