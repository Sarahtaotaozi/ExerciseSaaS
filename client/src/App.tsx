import Header from './components/Header';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
//import AnalyzeImage from './components/AnalyzeImage';

export default function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/analyze" element={<AnalyzeImage />} />*/}
            </Routes>
        </div>
    );
}
