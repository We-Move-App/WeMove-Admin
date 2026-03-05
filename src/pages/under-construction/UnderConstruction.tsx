import React from "react";
import { Construction } from "lucide-react";

const UnderConstruction: React.FC = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                        <Construction size={28} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Page Under Construction
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-6">
                    We’re working hard to bring this feature to life.
                    Please check back soon.
                </p>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-6" />

                {/* Footer Text */}
                <p className="text-xs text-gray-400">
                    🚧 Development in progress
                </p>
            </div>
        </div>
    );
};

export default UnderConstruction;
