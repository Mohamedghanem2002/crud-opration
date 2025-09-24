import DynamicList from "./DynamicList";
import { isValidPhoneNumber } from "libphonenumber-js";

const ContactSection = ({ userData, formData, setFormData, editMode, isPublic }) => (
  <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Email */}
      <div>
        <label className="block text-gray-500 mb-1">Email</label>
        {
          editMode ?(
            <p className="p-2 rounded bg-gray-50">{userData.email || "Not set"}</p>
          ):
          (
            <p className="p-2">{userData.email || "Not set"}</p>
          )
        }
      </div>

      {/* Phones */}
      <div className="sm:col-span-2">
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
              <label className="block text-gray-500 mb-1">Phones</label>
              <ul className="list-disc pl-5 text-gray-600">
                {userData.phones.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>

      {/* Links */}
      <div className="sm:col-span-2">
        {editMode ? (
          <DynamicList
            label="Links"
            items={formData.links || userData.links || []}
            setItems={(links) => setFormData({ ...formData, links })}
            placeholder="https://example.com"
            type="url"
            isLink={true}
            validate={(link) => /^https?:\/\/.+/.test(link)}
          />
        ) : (
          userData.links?.length > 0 && (
            <div>
              <label className="block text-gray-500 mb-1">Links</label>
              <ul className="list-disc pl-5 text-gray-600">
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
  </div>
);

export default ContactSection;
