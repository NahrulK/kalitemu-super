/* eslint-disable no-alert */
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useFileHandler = (initState) => {
  const [imageFile, setImageFile] = useState(initState);
  const [isFileLoading, setFileLoading] = useState(false);

  const removeImage = ({ id, name }) => {
    const items = imageFile[name].filter((item) => item.id !== id);

    setImageFile({
      ...imageFile,
      [name]: items,
    });
  };

  const onFileChange = (event, { name, type }) => {
    const val = event.target.value;
    const img = event.target.files[0];
    const size = img.size / 1024 / 1024;
    const regex = /(\.jpg|\.jpeg|\.png)$/i;

    setFileLoading(true);
    if (!regex.exec(val)) {
      alert("Tipe file harus JPEG atau PNG 🥽  ", "error");
      setFileLoading(false);
    } else if (size > 0.5) {
      alert("Ukuran gambar harus 500kb atau dibawahnya 💆‍♂️ ", "error");
      setFileLoading(false);
    } else if (type === "multiple") {
      Array.from(event.target.files).forEach((file) => {
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          setImageFile((oldFiles) => ({
            ...oldFiles,
            [name]: [
              ...oldFiles[name],
              { file, url: e.target.result, id: uuidv4() },
            ],
          }));
        });
        reader.readAsDataURL(file);
      });

      setFileLoading(false);
    } else {
      // type is single
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        setImageFile({
          ...imageFile,
          [name]: { file: img, url: e.target.result },
        });
        setFileLoading(false);
      });
      reader.readAsDataURL(img);
    }
  };

  return {
    imageFile,
    setImageFile,
    isFileLoading,
    onFileChange,
    removeImage,
  };
};

export default useFileHandler;
