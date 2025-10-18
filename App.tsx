
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PromptControls from './components/PromptControls';
import ImageDisplay from './components/ImageDisplay';
import Footer from './components/Footer';
import type { Mode, GeneratedImage } from './types';
import { useDailyLimit } from './hooks/useDailyLimit';
import { generateImages, editImage } from './services/geminiService';

const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>('generate');
    const [images, setImages] = useState<GeneratedImage[]>(() => {
        try {
            const storedImages = localStorage.getItem('dreamforge_images');
            return storedImages ? JSON.parse(storedImages) : [];
        } catch (error) {
            console.error("Failed to load images from localStorage", error);
            return [];
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { remaining, isLimitReached, incrementCount } = useDailyLimit();

    useEffect(() => {
        try {
            localStorage.setItem('dreamforge_images', JSON.stringify(images));
        } catch (error) {
            console.error("Failed to save images to localStorage", error);
        }
    }, [images]);

    const handleSubmit = async (prompt: string, options: { numImages?: number; file?: File }) => {
        if (isLimitReached) {
            setError("لقد وصلت إلى الحد اليومي لتوليد الصور.");
            return;
        }
        
        setIsLoading(true);
        setError(null);

        try {
            let newImageSrcs: string[] = [];
            let imageCount = 0;

            if (mode === 'generate' && options.numImages) {
                imageCount = options.numImages;
                if (remaining < imageCount) {
                    throw new Error(`لا يمكنك توليد ${imageCount} صور. لديك ${remaining} محاولة متبقية فقط.`);
                }
                newImageSrcs = await generateImages(prompt, options.numImages);
            } else if (mode === 'edit' && options.file) {
                imageCount = 1;
                 if (remaining < imageCount) {
                    throw new Error(`لا يمكنك تعديل الصورة. لديك ${remaining} محاولة متبقية فقط.`);
                }
                newImageSrcs = await editImage(prompt, options.file);
            }
            
            const newImages: GeneratedImage[] = newImageSrcs.map(src => ({
                id: crypto.randomUUID(),
                src: `data:image/jpeg;base64,${src}`,
                prompt: prompt
            }));

            setImages(prev => [...newImages, ...prev]);
            incrementCount(imageCount);

        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-white selection:bg-purple-500/30">
            <Header remaining={remaining} />
            <main className="container mx-auto px-4 md:px-6 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <PromptControls 
                        mode={mode}
                        setMode={setMode}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        isLimitReached={isLimitReached}
                    />
                    <ImageDisplay images={images} isLoading={isLoading} error={error} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
