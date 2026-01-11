import { useState ,useEffect} from "react";
import Navbar from "./components/navbar";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [form, setForm] = useState({ site: "", url: "", password: "" });
  const [errors, setErrors] = useState({});
  const [credentials, setCredentials] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("credentials");
    if (saved) {
      const parsed = JSON.parse(saved); 
      setCredentials(Array.isArray(parsed) ? parsed : [parsed]);
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const newErrors = {};
    if (!form.site.trim()) newErrors.site = "Site name is required.";
    if (!form.url.trim()) newErrors.url = "URL is required.";
    else {
      try {
        new URL(form.url);
      } catch {
        newErrors.url = "Enter a valid URL (e.g., https://example.com).";
      }
    }
    if (!form.password.trim()) newErrors.password = "Password is required.";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    let updated;
    if (editingIndex !== null) {
      updated = [...credentials];
      updated[editingIndex] = form;
      setEditingIndex(null);
    } else {
      updated = [...credentials, form];
    }
    setCredentials(updated);
    localStorage.setItem("credentials", JSON.stringify(updated));
    setForm({ site: "", url: "", password: "" });
  };
  const handleEdit = (index) => {
    setForm(credentials[index]);
    setEditingIndex(index);
  };
  const handleDelete = (index) => {
    const updated = credentials.filter((_, i) => i !== index);
    setCredentials(updated);
    localStorage.setItem("credentials", JSON.stringify(updated));
  };
  return (
    <>
      <div className="">
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
          
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white shadow-sm rounded-lg p-6 border border-gray-200 mb-8">
            
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
             
              {editingIndex !== null
                ? "Edit credential"
                : "Save credentials"}
            </h1>
            {/* Site */}
            <div className="mb-4">
              
              <label
                htmlFor="site"
                className="block text-sm font-medium text-gray-700 mb-1">
                
                Site name
              </label>
              <input
                id="site"
                name="site"
                type="text"
                value={form.site}
                onChange={handleChange}
                placeholder="e.g., GitHub"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {errors.site && (
                <p className="mt-1 text-sm text-red-600">{errors.site}</p>
              )}
            </div>
            {/* URL */}
            <div className="mb-4">
              
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1">
                
                URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url}</p>
              )}
            </div>
            {/* Password */}
            <div className="mb-6">
              
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1">
                
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter a strong password"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">
              
              {editingIndex !== null ? "Update" : "Save"}
            </button>
          </form>
          {/* Table of saved credentials */}
          <div className="w-full max-w-2xl bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Saved Credentials
            </h2>
            {credentials.length === 0 ? (
              <p className="text-gray-500">No credentials saved yet.</p>
            ) : (
              <table className="min-w-full border border-gray-300">
                
                <thead className="bg-gray-100">
                  
                  <tr>
                    
                    <th className="px-4 py-2 border">Site</th>
                    <th className="px-4 py-2 border">URL</th>
                    <th className="px-4 py-2 border">Password</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {credentials.map((cred, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      
                      <td className="px-4 py-2 border">{cred.site}</td>
                      <td className="px-4 py-2 border">
                        
                        <a
                          href={cred.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline">
                          
                          {cred.url}
                        </a>
                      </td>
                      <td className="px-4 py-2 border">{cred.password}</td>
                      <td className="px-4 py-2 border space-x-2">
                        
                        <button
                          onClick={() => handleEdit(index)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                          
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                          
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}{" "}
          </div>{" "}
        </div>
      </div>
    </>
  );
}

export default App;
