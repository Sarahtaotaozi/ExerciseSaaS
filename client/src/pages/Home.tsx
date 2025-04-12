import { useState, useRef } from 'react';
import AnalyzeImage from '../components/AnalyzeImage';
import ImageUploadCard from '../components/ImageUploadCard';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [startAnalysis, setStartAnalysis] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const resultRef = useRef<HTMLDivElement | null>(null);

    const handleSelect = (file: File) => {
        setFile(file);
        setStartAnalysis(false);
        setAnalysisComplete(false);
    };

    const handleAnalyzeClick = () => {
        if (file) {
            setStartAnalysis(true);
            setAnalysisComplete(false);
        }
    };

    const handleAnalysisDone = () => {
        setAnalysisComplete(true);
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 leading-tight">
                    AI Image Analysis
                </h1>

                <p className="text-gray-500 text-base md:text-lg mt-4">
                    Upload your image and let our AI analyze it in seconds
                </p>
            </div>


            {!file && <ImageUploadCard onFileSelect={handleSelect} />}


            {file && (
                <div className="bg-white shadow-xl rounded-2xl p-6 max-w-2xl w-full mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Image</label>
                    <img
                        src={URL.createObjectURL(file)}
                        alt="Uploaded"
                        className="w-full max-h-[400px] object-contain rounded-md mb-4"
                    />
                    <p className="text-sm text-gray-500 mb-4">
                        {file.name} • {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                        onClick={handleAnalyzeClick}
                        disabled={startAnalysis && !analysisComplete}
                        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
                            analysisComplete
                                ? 'bg-green-600 hover:bg-green-700'
                                : startAnalysis
                                    ? 'bg-gray-400 cursor-wait'
                                    : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {analysisComplete
                            ? 'Analyzed ✅'
                            : startAnalysis
                                ? 'Analyzing...'
                                : 'Analyze Image →'}
                    </button>
                </div>
            )}

            {/* Analysis result */}
            {file && startAnalysis && (
                <div ref={resultRef} className="mt-24 w-full max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h2>
                    <p className="text-gray-500 mb-8">Here’s what our AI detected in your image</p>

                    <AnalyzeImage file={file} onDone={handleAnalysisDone} />
                </div>
            )}

        </main>
    );
}
