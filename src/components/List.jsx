export default function List({ items, onEdit, onDelete }) {
  if (items.length === 0) return <p>No items found</p>;

  return (
    <ul>
      {items.map((item) => (
        <li key={item._id}>
          {item.name}
          <button onClick={() => onEdit(item)}>Edit</button>
          <button onClick={() => onDelete(item._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
