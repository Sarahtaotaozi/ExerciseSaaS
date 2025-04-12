import { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface Props {
    onFileSelect: (file: File) => void;
}

export default function ImageUploadCard({ onFileSelect }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md text-center">

            <div
                className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-colors ${
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <UploadCloud className="mx-auto text-gray-400 w-10 h-10 mb-3" />
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Drag & Drop Your Image or Click to Browse
                </h3>
                <p className="text-sm text-gray-500">
                    Supports JPG, PNG and GIF files (max. 5MB)
                </p>
            </div>


            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />


            <div className="flex justify-center">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm"
                >
                    <ImageIcon className="w-4 h-4" />
                    Select Image
                </button>
            </div>
        </div>
    );
}
