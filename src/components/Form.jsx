export default function Form({ onSubmit, initialValues }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Enter name..."
        defaultValue={initialValues?.name || ""}
      />
      <button type="submit">{initialValues ? "Update" : "Add"}</button>
    </form>
  );
}
