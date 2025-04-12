import { X, UploadCloud } from 'lucide-react';

interface Props {
    file: File;
    onAnalyzeClick: () => void;
    onClear?: () => void;
}

export default function UploadPreviewCard({ file, onAnalyzeClick, onClear }: Props) {
    const previewUrl = URL.createObjectURL(file);

    return (
        <div className="bg-white shadow-xl rounded-xl mx-auto p-6 max-w-xl text-left relative">

            {onClear && (
                <button
                    onClick={onClear}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={18} />
                </button>
            )}

            <label className="font-semibold text-gray-700 mb-2 block">Your Image</label>


            <div className="w-full h-auto rounded-md overflow-hidden border border-gray-200 mb-4">
                <img src={previewUrl} alt="Uploaded Preview" className="w-full object-contain" />
            </div>


            <div className="flex items-center text-sm text-gray-600 mb-4">
                <UploadCloud className="w-4 h-4 mr-2" />
                {file.name} • {(file.size / 1024).toFixed(1)} KB
            </div>


            <button
                onClick={onAnalyzeClick}
                className="w-full py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
                Analyze Image →
            </button>
        </div>
    );
}
