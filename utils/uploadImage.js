import imagekit from "../config/imagekit.js";

const uploadFile = async (file, folder = "uploads") => {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (
    !publicKey ||
    !privateKey ||
    !urlEndpoint ||
    publicKey.includes("xxxx") ||
    privateKey.includes("xxxx") ||
    urlEndpoint.includes("your_id")
  ) {
    console.warn("[ImageKit Warning] Using mock upload because valid keys are not configured in .env");
    return {
      fileId: `mock-file-${Date.now()}`,
      url: `https://placehold.co/600x400?text=${encodeURIComponent(file.originalname)}`,
      name: file.originalname,
      fileType: "image",
    };
  }

  const response = await imagekit.upload({
    file: file.buffer,
    fileName: `${Date.now()}-${file.originalname}`,
    folder: `/${folder}`,
  });

  return {
    fileId: response.fileId,
    url: response.url,
    name: response.name,
    fileType: response.fileType,
  };
};

export default uploadFile;