
import React, { useState, useRef } from 'react';
import type { Mode } from '../types';
import { SparklesIcon, UploadIcon } from './icons';

interface PromptControlsProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
    onSubmit: (prompt: string, options: { numImages?: number; file?: File }) => void;
    isLoading: boolean;
    isLimitReached: boolean;
}

const PromptControls: React.FC<PromptControlsProps> = ({ mode, setMode, onSubmit, isLoading, isLimitReached }) => {
    const [prompt, setPrompt] = useState('');
    const [numImages, setNumImages] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLimitReached || isLoading) return;
        if (mode === 'generate') {
            onSubmit(prompt, { numImages });
        } else if (file) {
            onSubmit(prompt, { file });
        }
    };
    
    const isSubmitDisabled = isLoading || isLimitReached || !prompt || (mode === 'edit' && !file);

    return (
        <div className="p-4 md:p-6 bg-gray-800/50 rounded-2xl border border-gray-700 shadow-lg sticky top-24 z-10 backdrop-blur-md">
            <div className="flex border-b border-gray-600 mb-4">
                <TabButton isActive={mode === 'generate'} onClick={() => setMode('generate')}>
                    توليد الصور
                </TabButton>
                <TabButton isActive={mode === 'edit'} onClick={() => setMode('edit')}>
                    تعديل صورة
                </TabButton>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="اكتب وصفك الإبداعي هنا... مثال: روبوت يركب لوح تزلج أحمر"
                    className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
                    disabled={isLoading}
                />

                {mode === 'generate' ? (
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <label className="font-bold text-nowrap">عدد الصور:</label>
                        <div className="flex-grow grid grid-cols-4 gap-2 w-full">
                           {[1, 2, 3, 4].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setNumImages(n)}
                                    className={`py-2 px-4 rounded-lg transition-colors text-center ${numImages === n ? 'bg-purple-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    disabled={isLoading}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border-2 border-dashed border-gray-500"
                            disabled={isLoading}
                        >
                            <UploadIcon className="w-5 h-5" />
                            <span>{fileName || 'ارفع صورة للتعديل'}</span>
                        </button>
                    </div>
                )}
                
                <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-bold rounded-lg transition-all transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>جاري التنفيذ...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-6 h-6" />
                            <span>{isLimitReached ? 'تم الوصول للحد اليومي' : (mode === 'generate' ? 'توليد' : 'تعديل')}</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`py-2 px-4 text-lg font-bold transition-colors -mb-px border-b-2 ${isActive ? 'text-purple-400 border-purple-400' : 'text-gray-400 border-transparent hover:text-white'}`}
    >
        {children}
    </button>
);


export default PromptControls;
