import { FaPlus, FaXmark } from "react-icons/fa6";

function DynamicList({
  label,
  items,
  setItems,
  placeholder,
  type = "text",
  validate,
  isLink = false,
}) {
  const handleChange = (value, index, field = null) => {
    const newItems = [...items];
    if (isLink) {
      newItems[index] = { ...newItems[index], [field]: value };
    } else {
      newItems[index] = value;
    }
    setItems(newItems);
  };

  const handleRemove = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-gray-600">{label}</label>
      <div className="space-y-2">
        {items?.map((item, i) => (
          <div key={i} className="flex gap-2">
            {isLink ? (
              <>
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => handleChange(e.target.value, i, "title")}
                  className="w-1/3 border rounded p-2"
                  placeholder="Title"
                />
                <input
                  type="url"
                  value={item.url || ""}
                  onChange={(e) => handleChange(e.target.value, i, "url")}
                  className={`w-2/3 border rounded p-2 ${
                    validate && !validate(item.url) && item.url?.trim() !== ""
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder={placeholder}
                />
              </>
            ) : (
              <input
                type={type}
                value={item}
                onChange={(e) => handleChange(e.target.value, i)}
                className={`w-full border rounded p-2 ${
                  validate && !validate(item) && item.trim() !== ""
                    ? "border-red-500"
                    : ""
                }`}
                placeholder={placeholder}
              />
            )}
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaXmark size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setItems([
              ...items,
              isLink ? { title: "", url: "" } : "",
            ])
          }
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FaPlus size={14} /> Add {label}
        </button>
      </div>
    </div>
  );
}

export default DynamicList;
