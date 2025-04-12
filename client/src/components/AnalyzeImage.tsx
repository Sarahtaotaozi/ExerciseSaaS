import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface Props {
    file: File;
    onDone: () => void;
}

export default function AnalyzeImage({ file, onDone }: Props) {
    const [labels, setLabels] = useState<{ description: string; score: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const analyze = async () => {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await axios.post(`${API_URL}/vision/analyze`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (res.data.labels) {
                    setLabels(res.data.labels);
                } else {
                    setError("No labels found.");
                }


                onDone();
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.error || "Server error");
            } finally {
                setLoading(false);
            }
        };

        analyze();
    }, [file, onDone]);

    if (loading) {
        return <p className="text-center mt-8 text-indigo-600 font-semibold">Analyzing...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    return (
        <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2">
                <img src={URL.createObjectURL(file)} alt="Analyzed" className="w-full rounded-md" />
                <p className="text-sm text-gray-500 mt-2">{file.name}</p>
                <p className="text-sm text-gray-400">Analyzed on {new Date().toLocaleDateString()}</p>
            </div>

            <div className="w-full md:w-1/2">
                <h3 className="text-lg font-semibold mb-2">Labels Detected</h3>
                <p className="text-sm text-gray-500 mb-4">Our AI detected these elements with high confidence</p>

                <div className="space-y-3">
                    {labels.map((label, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm">
                                <span>{label.description}</span>
                                <span>{label.score.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${label.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>


                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center justify-center gap-2"
                >
                    🔁 Analyze Another Image
                </button>

            </div>
        </div>
    );
}
