import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
    return (
        <header className="w-full fixed top-0 left-0 bg-white shadow z-10">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">
                    🔷 VisionApp
                </Link>

                <nav className="flex items-center space-x-6 text-sm text-gray-600">
                    <a
                        href="https://github.com/JohnParkerWilson/ExerciseSaaS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-indigo-600"
                    >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                    </a>
                </nav>
            </div>
        </header>
    );
}
