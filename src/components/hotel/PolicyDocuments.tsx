import React from "react";
import { FileText } from "lucide-react";

interface DocumentItem {
    name?: string;
    fileUrl: string;
}

interface PolicyDocumentsProps {
    documents: DocumentItem[];
}

const PolicyDocuments: React.FC<PolicyDocumentsProps> = ({ documents }) => {
    if (!documents || documents.length === 0) {
        return <p className="text-gray-500">No policy documents uploaded.</p>;
    }

    return (
        <div className="grid gap-4">
            {documents.map((doc, idx) => {
                const fileName = doc.name || `Document ${idx + 1}`;
                const isPDF =
                    fileName.toLowerCase().endsWith(".pdf") ||
                    doc.fileUrl.toLowerCase().includes("application/pdf");

                return (
                    <div
                        key={idx}
                        className="flex items-center gap-3 border p-3 rounded-md shadow-sm"
                    >
                        {isPDF ? (
                            <>
                                <FileText className="text-red-500" size={20} />
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {fileName}
                                </a>
                            </>
                        ) : (
                            <img
                                src={doc.fileUrl}
                                alt={fileName}
                                className="w-16 h-16 object-cover rounded"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PolicyDocuments;
