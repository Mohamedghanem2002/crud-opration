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
    <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div className="space-y-3">
        {items?.map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3">
            {isLink ? (
              <>
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => handleChange(e.target.value, i, "title")}
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Title"
                />
                <input
                  type="url"
                  value={item.url || ""}
                  onChange={(e) => handleChange(e.target.value, i, "url")}
                  className={`flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                    validate && !validate(item.url) && item.url?.trim() !== ""
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={placeholder}
                />
              </>
            ) : (
              <input
                type={type}
                value={item}
                onChange={(e) => handleChange(e.target.value, i)}
                className={`flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                  validate && !validate(item) && item.trim() !== ""
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder={placeholder}
              />
            )}
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
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
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-xl shadow-sm hover:bg-green-600 transition-colors duration-200"
        >
          <FaPlus size={14} /> Add {label}
        </button>
      </div>
    </div>
  );
}

export default DynamicList;
