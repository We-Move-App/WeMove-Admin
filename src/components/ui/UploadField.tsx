import { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface UploadFieldProps {
  label: string;
  accept?: string;
  onChange: (files: File[] | File | null) => void;
  value: string | string[] | { name?: string; fileUrl?: string } | { name?: string; fileUrl?: string }[] | File | File[] | null;
  multiple?: boolean;
  showCloseButton?: boolean;
  disabled?: boolean;
}

const UploadField = ({
  label,
  accept = "image/jpeg, image/png, application/pdf",
  onChange,
  value,
  multiple = false,
  showCloseButton = true,
  disabled = false,
}: UploadFieldProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(() => {
    if (typeof value === "string") {
      return [value];
    } else if (Array.isArray(value)) {
      return value.map(v =>
        typeof v === "string"
          ? v
          : (v?.fileUrl ?? "")
      ).filter(Boolean);
    }
    return [];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    onChange(multiple ? selectedFiles : selectedFiles[0]);

    const previewUrls = selectedFiles.map(file => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file); // image preview
      } else if (file.type === "application/pdf") {
        return URL.createObjectURL(file); // PDF preview as link
      } else {
        return ""; // fallback
      }
    });

    setPreviews(previewUrls);
  };


  const clearFile = (index?: number) => {
    if (multiple && typeof index === "number") {
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);
      setFiles(newFiles);
      setPreviews(newPreviews);
      onChange(newFiles.length ? newFiles : null);
    } else {
      setFiles([]);
      setPreviews([]);
      onChange(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!value) {
      setPreviews([]);
      setFiles([]);
      return;
    }

    // Single string URL
    if (typeof value === "string") {
      setPreviews([value]);
      setFiles([]);
      return;
    }

    // Single object with URL (from API)
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof File)) {
      const url = (value as any).url || (value as any).fileUrl || "";
      setPreviews(url ? [url] : []);
      setFiles([]);
      return;
    }

    // Array of objects or Files
    if (Array.isArray(value)) {
      const urls = value.map(v => {
        if (typeof v === "string") return v;
        if (v instanceof File) return URL.createObjectURL(v);
        if (v?.fileUrl) return v.fileUrl;
        if (v?.url) return v.url;
        return "";
      }).filter(Boolean);

      setPreviews(urls);
      setFiles(value.filter(v => v instanceof File) as File[]);
      return;
    }

    // Single File
    if (value instanceof File) {
      setPreviews([URL.createObjectURL(value)]);
      setFiles([value]);
    }
  }, [value]);

  // const renderPreview = (src: string, idx: number) => {
  //   const file = files[idx];

  //   // Determine fileName from File object or uploaded object
  //   let fileName = file?.name || src.split("/").pop();

  //   if (!fileName && Array.isArray(value)) {
  //     const val = value[idx];
  //     if (val && typeof val === "object") {
  //       fileName = (val as any).fileName || (val as any).name || "Document.pdf";
  //     }
  //   } else if (!fileName && value && typeof value === "object" && !Array.isArray(value)) {
  //     fileName = (value as any).fileName || (value as any).name || "Document.pdf";
  //   }

  //   const isPDF =
  //     file?.type === "application/pdf" ||
  //     fileName?.toLowerCase().endsWith(".pdf");

  //   if (isPDF) {
  //     return (
  //       <div key={idx} className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-200">
  //         <FileText className="text-red-500 mr-2" size={24} />
  //         <a
  //           href={src}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-sm text-blue-600 hover:underline truncate max-w-xs"
  //         >
  //           {fileName}
  //         </a>
  //         {showCloseButton && !disabled && (
  //           <button
  //             type="button"
  //             onClick={() => clearFile(idx)}
  //             className="ml-auto text-gray-500 hover:text-gray-700"
  //           >
  //             <X size={18} />
  //           </button>
  //         )}
  //       </div>
  //     );
  //   }

  //   // Image preview
  //   return (
  //     <div key={idx} className="relative mt-2 flex items-start gap-2">
  //       <img
  //         src={src}
  //         alt={fileName}
  //         className="h-40 object-cover rounded-md border border-gray-200"
  //       />
  //       {showCloseButton && !disabled && (
  //         <button
  //           type="button"
  //           onClick={() => clearFile(idx)}
  //           className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
  //           aria-label="Remove file"
  //         >
  //           <X size={18} />
  //         </button>
  //       )}
  //     </div>
  //   );
  // };

  const renderPreview = (src: string, idx: number) => {
    const file = files[idx];

    // Default name
    let fileName = file?.name || src.split("/").pop() || "Document";

    // Try to get fileName from API value
    if (Array.isArray(value)) {
      const val = value[idx];
      if (val && typeof val === "object") {
        fileName = (val as any).fileName || (val as any).name || fileName;
      }
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      fileName = (value as any).fileName || (value as any).name || fileName;
    }

    // PDF detection: from file.type, fileName extension, or explicit mimeType
    const mimeType =
      file?.type ||
      (Array.isArray(value) && value[idx] && (value[idx] as any).mimeType) ||
      (typeof value === "object" && !Array.isArray(value) && (value as any).mimeType);

    const isPDF =
      mimeType === "application/pdf" ||
      fileName.toLowerCase().endsWith(".pdf");

    if (isPDF) {
      return (
        <div
          key={idx}
          className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-200"
        >
          <FileText className="text-red-500 mr-2" size={24} />
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline truncate max-w-xs"
          >
            {fileName}
          </a>
          {showCloseButton && !disabled && (
            <button
              type="button"
              onClick={() => clearFile(idx)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>
      );
    }

    // Otherwise assume image
    return (
      <div key={idx} className="relative mt-2 flex items-start gap-2">
        <img
          src={src}
          alt={fileName}
          className="h-40 object-cover rounded-md border border-gray-200"
        />
        {showCloseButton && !disabled && (
          <button
            type="button"
            onClick={() => clearFile(idx)}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
            aria-label="Remove file"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  };



  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {previews.length > 0 ? (
        <div className="flex flex-wrap gap-2">{previews.map(renderPreview)}</div>
      ) : (
        !disabled && (
          <div className="mt-1 relative">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center">
              <div className="space-y-1 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                  <Upload size={24} />
                </div>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>{multiple ? "Upload files" : "Upload a file"}</span>
                    <input
                      ref={fileInputRef}
                      id={`file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept={accept}
                      onChange={handleFileChange}
                      multiple={multiple}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UploadField;
