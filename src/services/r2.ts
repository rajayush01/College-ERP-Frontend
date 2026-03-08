import axios from "@/api/axios"; // or wherever your configured axios is


const API_BASE = "http://localhost:5000"; // 👈 your backend port

export const getR2UploadUrl = async (
  file: File,
  folder:
    | "assignments"
    | "teacher-assignments"
    | "timetables"
    | "student-documents"
    | "teacher-documents"
    | "documents"
) => {
  const res = await axios.post(
    `${API_BASE}/api/r2/upload-url`,
    {
      fileName: file.name,
      fileType: file.type,
      folder,
    },
    { withCredentials: true }
  );

  return res.data as {
    uploadUrl: string;
    publicUrl: string;
    key: string;
  };
};


export const uploadFileToR2 = async (
  uploadUrl: string,
  file: File
) => {
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
};
