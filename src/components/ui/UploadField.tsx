
import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface UploadFieldProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  value: string | File | null;
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
  const [file, setFile] = useState<File | null>(null);
  // const [preview, setPreview] = useState<string | null>(value || null);
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      setFile(selectedFile);
      onChange(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For non-image files (like PDFs), just display the file name
        setPreview(null);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isPDF =
    file?.type === 'application/pdf' ||
    (typeof value === 'string' && value.endsWith('.pdf'));


  // return (
  //   <div className="mb-4">
  //     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
  //     {!preview ? (
  //       !disabled && (
  //         <div className="mt-1 relative">
  //           <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center">
  //             <div className="space-y-1 text-center">
  //               <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
  //                 <Upload size={24} />
  //               </div>
  //               <div className="flex text-sm text-gray-600">
  //                 <label
  //                   htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
  //                   className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
  //                 >
  //                   <span>Upload a file</span>
  //                   <input
  //                     ref={fileInputRef}
  //                     id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
  //                     name="file-upload"
  //                     type="file"
  //                     className="sr-only"
  //                     accept={accept}
  //                     onChange={handleFileChange}
  //                     multiple={multiple}
  //                   />
  //                 </label>
  //                 <p className="pl-1">or drag and drop</p>
  //               </div>
  //               <p className="text-xs text-gray-500">
  //                 PNG, JPG, PDF up to 10MB
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     ) : (
  //       <div className="mt-2 relative">
  //         {isPDF ? (
  //           <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-200">
  //             <FileText className="text-red-500 mr-2" size={24} />
  //             <span className="text-sm truncate max-w-xs">
  //               {file?.name || "Document.pdf"}
  //             </span>
  //             {showCloseButton && !disabled && (
  //               <button
  //                 type="button"
  //                 onClick={clearFile}
  //                 className="ml-auto text-gray-500 hover:text-gray-700"
  //               >
  //                 <X size={18} />
  //               </button>
  //             )}
  //           </div>
  //         ) : (
  //           <div className="relative mt-2 flex items-start space-x-2 gap-2">
  //             <img
  //               src={preview}
  //               alt="Preview"
  //               className="h-40 object-cover rounded-md border border-gray-200"
  //             />
  //             {showCloseButton && !disabled && (
  //               <button
  //                 type="button"
  //                 onClick={clearFile}
  //                 className="top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
  //                 aria-label="Remove file"
  //               >
  //                 <X size={18} />
  //               </button>
  //             )}
  //           </div>
  //         )}
  //       </div>
  //     )}

  //   </div>
  // );
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {/* VIEW MODE: No file */}
      {!showCloseButton && !preview && (
        <div className="text-sm text-gray-500 italic">No file uploaded</div>
      )}

      {/* VIEW MODE: File preview */}
      {!showCloseButton && preview && (
        <div className="mt-2">
          {isPDF ? (
            <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-200">
              <FileText className="text-red-500 mr-2" size={24} />
              {/* <span className="text-sm truncate max-w-xs">{value?.split("/").pop()}</span> */}
              <span className="text-sm truncate max-w-xs">
                {typeof value === "string" ? value.split("/").pop() : file?.name ?? "File"}
              </span>
            </div>
          ) : (
            <img
              src={preview}
              alt="Uploaded preview"
              className="h-40 object-cover rounded-md border border-gray-200"
            />
          )}
        </div>
      )}

      {/* EDIT MODE: Show preview with close button */}
      {showCloseButton && preview && (
        <div className="mt-2 relative">
          {isPDF ? (
            <div className="flex items-center p-4 bg-gray-50 rounded-md border border-gray-200">
              <FileText className="text-red-500 mr-2" size={24} />
              {/* <span className="text-sm truncate max-w-xs">{file?.name || value?.split("/").pop()}</span> */}
              <span className="text-sm truncate max-w-xs">
                {typeof value === "string" ? value.split("/").pop() : file?.name ?? "File"}
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ) : (
            <div className="relative mt-2 flex items-start space-x-2 gap-2">
              <img
                src={preview}
                alt="Preview"
                className="h-40 object-cover rounded-md border border-gray-200"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* EDIT MODE: Show upload field if no preview */}
      {showCloseButton && !preview && !disabled && (
        <div className="mt-1 relative">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex justify-center">
            <div className="space-y-1 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                <Upload size={24} />
              </div>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    ref={fileInputRef}
                    id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
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
      )}
    </div>
  );


};

export default UploadField;
