import DynamicList from "./DynamicList";
import { isValidPhoneNumber } from "libphonenumber-js";

const ContactSection = ({
  userData,
  formData,
  setFormData,
  editMode,
  isPublic,
}) => (
  <div className="mt-4">
    <h3 className="text-lg font-semibold my-2">Contact Information</h3>
    <div className="grid md:grid-cols-2 gap-4">
      {/* Email */}
      <div>
        <label className="block text-gray-600">Email</label>
        <p className="p-2 rounded">{userData.email || "Not set"}</p>
      </div>

      {/* Phones */}
      {editMode ? (
        <DynamicList
          label="Phones"
          items={formData.phones || userData.phones || []}
          setItems={(phones) => setFormData({ ...formData, phones })}
          placeholder="Enter phone number"
          type="tel"
          validate={isValidPhoneNumber}
        />
      ) : (
        userData.phones?.length > 0 && !isPublic && (
          <div>
            <label className="block text-gray-600">Phones</label>
            <ul className="list-disc pl-5">
              {userData.phones.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )
      )}

      {/* Links */}
      {editMode ? (
        <DynamicList
          label="Links"
          items={formData.links || userData.links || []}
          setItems={(links) => setFormData({ ...formData, links })}
          placeholder="https://example.com"
          type="url"
          validate={(link) => /^https?:\/\/.+/.test(link)}
          isLink={true}
        />
      ) : (
        userData.links?.length > 0 && (
          <div>
            <label className="block text-gray-600">Links</label>
            <ul className="list-disc pl-5">
              {userData.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.title || link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  </div>
);

export default ContactSection;
