"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading image...", { duration: Infinity });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        toast.dismiss(toastId);
        toast.error(json.message || "Upload failed");
        return;
      }
      toast.dismiss(toastId);
      toast.success("Upload complete!");
      console.log("Image URL:", json.data.secure_url);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Upload failed");
    }
  };

  return (
    <div className='space-y-4'>
      <input
        type='file'
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className='bg-blue-600 text-white px-4 py-2 rounded'>
        Upload
      </button>
    </div>
  );
}
