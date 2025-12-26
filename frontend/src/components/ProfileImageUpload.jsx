import { useState } from "react";
import api from "../api/axios";

export default function ProfileImageUpload() {
  const [image, setImage] = useState(null);

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("profile_image", image);

    await api.put("accounts/profile/update/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Profile image uploaded");
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={uploadImage}>Upload Image</button>
    </div>
  );
}
