import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UploadPage = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [labels, setLabels] = useState<string[]>([]);
    const [story, setStory] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setImageUrl('');
        }
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(event.target.value);
        setImage(null);
        setImagePreview(event.target.value);
    };

    const handleAnalyze = async () => {
        if (!image && !imageUrl.trim()) {
            setError("Please select an image");
            return;
        }

        setLoading(true);
        setError(null);
        setLabels([]);
        setStory('');

        try {
            let formData = new FormData();

            if (image) {
                formData.append("image", image);
            } else if (imageUrl.trim()) {
                formData.append("imageUrl", imageUrl.trim());
            }

            // ✅ Send request to backend (Google Vision API)
            const visionResponse = await axios.post(`${API_URL}/vision/analyze`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("✅ Vision API Response:", visionResponse.data);

            if (!visionResponse.data.labels || visionResponse.data.labels.length === 0) {
                throw new Error("No labels detected. Please try another image.");
            }

            setLabels(visionResponse.data.labels);

            let geminiPayload: { userPrompt: string } = {
                userPrompt: `Write a detailed creative story of at least 1000 words based on the following keywords. The story should be immersive, with strong character development, engaging dialogues, vivid environment descriptions, and emotional depth. **Do not include code, API references, technical descriptions, or non-story-related content.** Keywords: ${visionResponse.data.labels.join(', ')}`
            };

            // ✅ Send request to Gemini API
            await sendToGemini(geminiPayload);

        } catch (err: any) {
            console.error("❌ API Error:", err);
            setError(err.response?.data?.error || "An unknown error occurred.");
            setLoading(false);
        }
    };

    // ✅ Send data to Gemini API and process response
    const sendToGemini = async (payload: { userPrompt: string }) => {
        try {
            const geminiResponse = await axios.post(`${API_URL}/gemini`, payload, {
                headers: { "Content-Type": "application/json" }
            });

            if (!geminiResponse.data || !geminiResponse.data.story) {
                throw new Error("Gemini API did not return a story.");
            }

            let storyText = geminiResponse.data.story;

            // ✅ Remove AI-generated code-related text, keeping only pure story content
            storyText = storyText
                .split("\n")
                .filter((line: string) =>
                    !line.toLowerCase().includes("image") &&
                    !line.toLowerCase().includes("import") &&
                    !line.toLowerCase().includes("stability_ai") &&
                    !line.toLowerCase().includes("stability_api") &&
                    !line.toLowerCase().includes("os.environ") &&
                    !line.toLowerCase().includes("buffered") &&
                    !line.toLowerCase().includes("bytesio") &&
                    !line.toLowerCase().includes("api key") &&
                    !line.toLowerCase().includes("grpc") &&
                    !line.toLowerCase().includes("generation") &&
                    !line.toLowerCase().includes("request") &&
                    !line.toLowerCase().includes("artifact") &&
                    !line.toLowerCase().includes("filters") &&
                    !line.toLowerCase().includes("client") &&
                    !line.toLowerCase().includes("function") &&
                    !line.toLowerCase().includes("print(") &&
                    !line.toLowerCase().includes("python") &&
                    !line.toLowerCase().includes("pipeline") &&
                    !line.toLowerCase().includes("from_pretrained") &&
                    !line.toLowerCase().includes("cuda") &&
                    !line.toLowerCase().includes("torch") &&
                    !line.toLowerCase().includes("tensorflow") &&
                    !line.toLowerCase().includes("stablediffusion") &&
                    !line.toLowerCase().includes("model") &&
                    !line.toLowerCase().includes("checkpoint") &&
                    !line.toLowerCase().includes("verbose") &&
                    !line.toLowerCase().includes("base64")
                )
                .join("\n");

            setStory(storyText);
        } catch (err: any) {
            console.error("❌ Gemini API Error:", err);
            setError(err.response?.data?.error || "Unable to generate the story.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 w-full" />
            <input type="text" placeholder="Enter Image URL" value={imageUrl} onChange={handleUrlChange} className="border p-2 w-full mt-2" />

            {imagePreview && <img src={imagePreview} alt="Image Preview" className="mt-4 max-w-xs rounded" />}

            <button onClick={handleAnalyze} className="bg-blue-500 text-white p-2 mt-4" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            {error && <p style={{ color: 'red' }}>{JSON.stringify(error)}</p>}

            {labels.length > 0 && (
                <div>
                    <h2>Image Analysis Result:</h2>
                    <ul>{labels.map(label => <li key={label}>{label}</li>)}</ul>
                </div>
            )}

            {story && (
                <div>
                    <h2>Generated Story:</h2>
                    <p>{story}</p>
                </div>
            )}
        </div>
    );
};

export default UploadPage;
