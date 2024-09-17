import axios from "axios";

const uploadImage = async (e, setProgress, setFormDetails, formDetails) => {
  const file = e.target.files[0];

  if (file.type === "image/jpeg" || file.type === "image/png") {
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target.result;
      setFormDetails({ ...formDetails, [e.target.id]: base64String });
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const { loaded, total } = event;
        setProgress((loaded / total) * 100);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file: ", error);
    };

    reader.readAsDataURL(file);
  } else {
    console.error("Please select an image in jpeg or png format");
  }
};

export default uploadImage;
