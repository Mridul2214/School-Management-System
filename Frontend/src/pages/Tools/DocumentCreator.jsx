import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Sparkles,
    Download,
    Copy,
    Trash2,
    Layout,
    Type,
    Clock,
    CheckCircle,
    Loader2,
    FileCode,
    Languages,
    Mail,
    PenTool
} from 'lucide-react';

const DocumentCreator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [docType, setDocType] = useState('RequestLetter');
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');

    // Form states for manual templates
    const [letterData, setLetterData] = useState({
        fromName: '',
        fromDept: '',
        date: new Date().toISOString().split('T')[0],
        toName: '',
        toTitle: 'The Principal',
        subject: '',
        body: '',
    });

    const [notesData, setNotesData] = useState({
        topic: '',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        keyPoints: '',
        content: '',
        summary: ''
    });

    const docTemplates = [
        { id: 'RequestLetter', icon: Mail, label: 'Request Letter', color: 'text-indigo-600', bg: 'bg-indigo-50', isManual: true },
        { id: 'Notes', icon: PenTool, label: 'Study Notes', color: 'text-green-600', bg: 'bg-green-50', isManual: true },
        { id: 'Assignment', icon: FileText, label: 'Assignment', color: 'text-blue-600', bg: 'bg-blue-50', isManual: false },
        { id: 'Syllabus', icon: Layout, label: 'Syllabus', color: 'text-purple-600', bg: 'bg-purple-50', isManual: false },
    ];

    useEffect(() => {
        // Auto-update preview for manual templates
        const selectedTemplate = docTemplates.find(t => t.id === docType);
        if (selectedTemplate?.isManual) {
            generateManualPreview();
        } else {
            setGeneratedContent(''); // Clear for AI mode until generated
        }
    }, [docType, letterData, notesData]);

    const handleLetterChange = (e) => {
        setLetterData({ ...letterData, [e.target.name]: e.target.value });
    };

    const handleNotesChange = (e) => {
        setNotesData({ ...notesData, [e.target.name]: e.target.value });
    };

    const generateManualPreview = () => {
        let content = '';
        if (docType === 'RequestLetter') {
            content = `From:
${letterData.fromName || '[Your Name]'}
Dept: ${letterData.fromDept || '[Your Department]'}
Date: ${letterData.date}

To:
${letterData.toTitle || '[Recipient Title]'}
${letterData.toName ? letterData.toName + '\n' : ''}[School/College Name]

Subject: ${letterData.subject || '[Subject of the Request]'}

Respected Sir/Madam,

${letterData.body || '[Write your request content here...]'}

Sincerely,

${letterData.fromName || '[Your Name]'}
${letterData.fromDept || '[Department]'}`;
        } else if (docType === 'Notes') {
            content = `# TOPIC: ${notesData.topic || '[Topic Name]'}
**Subject:** ${notesData.subject || '[Subject Name]'} | **Date:** ${notesData.date}

---

## 📌 Key Points
${notesData.keyPoints ? notesData.keyPoints.split('\n').map(p => `- ${p}`).join('\n') : '- Point 1\n- Point 2'}

## 📝 Detailed Notes
${notesData.content || '[Start writing your detailed notes here...]'}

---

## 💡 Summary
${notesData.summary || '[Brief summary of the topic]'}
`;
        }
        setGeneratedContent(content);
    };

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);

        // Mocking AI Generation for non-manual types
        setTimeout(() => {
            const content = `# ${docType}: ${prompt}\n\n` +
                `## Introduction\nThis document was automatically generated based on the prompt: "${prompt}".\n\n` +
                `## Content\nGenerated content for ${docType} would appear here, structured appropriately for the format.\n\n` +
                `## Conclusion\nEnd of generated document.`;

            setGeneratedContent(content);
            setIsGenerating(false);
        }, 1500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        alert('Copied to clipboard!');
    };

    const currentTemplate = docTemplates.find(t => t.id === docType);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                        Document Studio <Sparkles className="ml-3 h-6 w-6 text-primary-500" />
                    </h1>
                    <p className="text-gray-500 font-medium">Create professional academic documents with templates</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Template Selector */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">1. Select Template</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {docTemplates.map((tmpl) => (
                                <button
                                    key={tmpl.id}
                                    onClick={() => setDocType(tmpl.id)}
                                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${docType === tmpl.id
                                        ? 'border-primary-600 bg-primary-50 shadow-inner'
                                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl ${tmpl.bg} ${tmpl.color}`}>
                                        <tmpl.icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-xs font-bold ${docType === tmpl.id ? 'text-primary-700' : 'text-gray-600'}`}>
                                        {tmpl.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Form Area */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">2. Document Details</h2>

                        {currentTemplate?.isManual ? (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                {docType === 'RequestLetter' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 ml-1">Your Name</label>
                                                <input name="fromName" value={letterData.fromName} onChange={handleLetterChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 ml-1">Your Dept</label>
                                                <input name="fromDept" value={letterData.fromDept} onChange={handleLetterChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="CSE" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">To (Title)</label>
                                            <input name="toTitle" value={letterData.toTitle} onChange={handleLetterChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="The HOD / Principal" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">To (Name - Optional)</label>
                                            <input name="toName" value={letterData.toName} onChange={handleLetterChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="Dr. Smith" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">Subject</label>
                                            <input name="subject" value={letterData.subject} onChange={handleLetterChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm font-medium" placeholder="Request for Leave..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">Content Body</label>
                                            <textarea name="body" value={letterData.body} onChange={handleLetterChange} rows="6" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm resize-none" placeholder="I am writing to request..." />
                                        </div>
                                    </>
                                )}

                                {docType === 'Notes' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 ml-1">Topic</label>
                                                <input name="topic" value={notesData.topic} onChange={handleNotesChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="React Hooks" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 ml-1">Subject</label>
                                                <input name="subject" value={notesData.subject} onChange={handleNotesChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="Web Development" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">Key Points (One per line)</label>
                                            <textarea name="keyPoints" value={notesData.keyPoints} onChange={handleNotesChange} rows="4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="- useState manages state&#10;- useEffect handles side effects" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">Detailed Content</label>
                                            <textarea name="content" value={notesData.content} onChange={handleNotesChange} rows="8" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="Full notes..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">Summary</label>
                                            <textarea name="summary" value={notesData.summary} onChange={handleNotesChange} rows="2" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none text-sm" placeholder="In short..." />
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-500 ml-1">AI Prompt</label>
                                        <span className="text-xs text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded-full">AI Powered</span>
                                    </div>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={`Describe the ${docType} you want to generate...`}
                                        className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none text-sm font-medium placeholder:text-slate-400"
                                    />
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt}
                                    className="w-full py-4 bg-primary-600 text-white font-black rounded-2xl shadow-lg shadow-primary-200 flex items-center justify-center hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                            GENERATING...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5 mr-3" />
                                            GENERATE WITH AI
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 flex flex-col h-[calc(100vh-12rem)] min-h-[600px] overflow-hidden sticky top-8 print:overflow-visible print:h-auto print:static">
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-widest italic flex items-center">
                                    {isGenerating ? 'Processing...' : 'Document Preview'}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                    title="Copy Text"
                                >
                                    <Copy className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                    title="Print / Download as PDF"
                                >
                                    <Download className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setGeneratedContent('')}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Clear"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto bg-white" id="document-preview">
                            <AnimatePresence mode="wait">
                                {isGenerating ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center text-center space-y-4"
                                    >
                                        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
                                        <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Crafting your document...</p>
                                    </motion.div>
                                ) : generatedContent ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="prose prose-slate max-w-none"
                                    >
                                        <div className="font-serif whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                                            {generatedContent}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                                        <FileText className="h-20 w-20 mb-4" />
                                        <p className="font-black text-2xl uppercase tracking-tighter">Document Preview</p>
                                        <p className="text-sm font-medium mt-2">Fill the template to see changes instantly</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentCreator;
