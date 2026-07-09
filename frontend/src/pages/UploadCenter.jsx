import { useState, useEffect } from "react";

function UploadCenter() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================
  // Load Uploaded Files
  // ==========================

  const loadFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://127.0.0.1:8000/uploaded-files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // ==========================
  // Select Files
  // ==========================

  const selectFiles = (e) => {
    setSelectedFiles(
      Array.from(e.target.files)
    );
    setMessage("");
  };

  // ==========================
  // Upload Files
  // ==========================

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setMessage("⚠ Please choose files.");
      return;
    }

    setUploading(true);

    const token = localStorage.getItem("token");
    const formData = new FormData();

    selectedFiles.forEach(file => {
      formData.append(
        "files",
        file
      );
    });

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      setMessage(data.message);
      await loadFiles();
      setSelectedFiles([]);
    } catch (err) {
      console.log(err);
      setMessage("Upload Failed");
    }

    setUploading(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">
        📁 Upload Center
      </h1>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">
          Upload Documents
        </h2>

        <input
          type="file"
          multiple
          onChange={selectFiles}
          accept=".pdf,.docx,.pptx,.csv,.png,.jpg,.jpeg"
          className="mb-6"
        />

        {selectedFiles.length > 0 && (
          <div className="mb-6">
            {selectedFiles.map((file, index) => (
              <p key={index}>
                📄 {file.name}
              </p>
            ))}
          </div>
        )}

        <button
          onClick={uploadFiles}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">
          Uploaded Files
        </h2>

        {files.length === 0 ? (
          <p>
            No uploaded files.
          </p>
        ) : (
          files.map((file, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">
                  📄 {file.filename}
                </h3>
                <p className="text-sm text-gray-500">
                  {file.upload_date}
                </p>
              </div>
              <span className="text-green-600 font-bold">
                {file.status}
              </span>
            </div>
          ))
        )}
      </div>

      {message && (
        <div className="bg-blue-100 text-blue-700 rounded-xl p-4 mt-6">
          {message}
        </div>
      )}
    </div>
  );
}

export default UploadCenter;