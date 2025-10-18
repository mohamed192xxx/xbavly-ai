
import React, { useState, useRef, useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon, SparklesIcon } from './icons';

interface ImageDisplayProps {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
}

const ImageCard: React.FC<{ image: GeneratedImage }> = ({ image }) => {
    const [isZoomed, setIsZoomed] = useState(false);
    const timerRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        timerRef.current = window.setTimeout(() => {
            setIsZoomed(true);
        }, 2000);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsZoomed(false);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `dreamforge-${image.id}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            className={`relative group aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-500 ease-in-out ${isZoomed ? 'scale-110 z-10' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img src={image.src} alt={image.prompt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white text-sm line-clamp-3">{image.prompt}</p>
                <button 
                    onClick={handleDownload}
                    className="absolute top-3 right-3 p-2 bg-white/20 rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors"
                    aria-label="Download Image"
                >
                    <DownloadIcon className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    );
};


const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, isLoading, error }) => {
    if (isLoading && images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-10 h-96">
                <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-gray-300">يتم توليد تحفتك الفنية...</h3>
                <p className="text-gray-400">قد يستغرق الأمر بضع لحظات.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center text-center p-10 h-96 bg-red-900/20 border border-red-500 rounded-lg">
                <div>
                    <h3 className="text-xl font-bold text-red-400">حدث خطأ</h3>
                    <p className="text-red-300 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-10 h-96 bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-lg">
                <SparklesIcon className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-400">حول أفكارك إلى صور</h3>
                <p className="text-gray-500 mt-2">ابدأ بكتابة وصف في الأعلى وشاهد السحر يحدث هنا.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading && <div className="absolute inset-0 bg-gray-900/50 z-10 flex items-center justify-center"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}
            {images.map((image) => (
                <ImageCard key={image.id} image={image} />
            ))}
        </div>
    );
};

export default ImageDisplay;
