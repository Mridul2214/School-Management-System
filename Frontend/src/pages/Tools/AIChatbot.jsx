import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bot,
    User,
    Sparkles,
    MoreVertical,
    Minus,
    X,
    MessageSquare,
    ChevronRight,
    Search,
    BrainCircuit,
    Info,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AIChatbot = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: `Hello ${user?.name || 'there'}! I'm your SmartCollege AI. How can I assist you today?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            role: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsTyping(true);

        // Smart College Logic Simulation
        setTimeout(() => {
            let responseText = "I'm not quite sure about that, but let me check with the department for you.";

            const lowInput = input.toLowerCase();
            if (lowInput.includes('attendance')) {
                responseText = "You can check your attendance in the 'Attendance' section of your dashboard. Currently, you need to maintain at least 75% for exam eligibility.";
            } else if (lowInput.includes('fee') || lowInput.includes('payment')) {
                responseText = "Fee details are available in the 'Fees' tab. Your next installment is due on March 15th.";
            } else if (lowInput.includes('exam') || lowInput.includes('timetable')) {
                responseText = "The semester exams are scheduled to start from May 12th. You can download the full timetable from the menu.";
            } else if (lowInput.includes('help') || lowInput.includes('support')) {
                responseText = "I can help you with course details, attendance tracking, and fee inquiries. For technical issues, please contact the admin office.";
            }

            const aiResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const suggestedPrompts = [
        "What is my attendance?",
        "When is the next fee due?",
        "Show me my schedule",
        "How to contact HOD?"
    ];

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Chat Container */}
            <div className="bg-white flex-1 rounded-3xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-primary-600 to-indigo-700 text-white">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Bot className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="font-black text-lg">Academic Assistant</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                            <BrainCircuit className="h-5 w-5" />
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                            <Info className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30"
                >
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600 border border-gray-100'
                                    }`}>
                                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className={`p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className={`text-[10px] font-bold text-gray-400 mt-1.5 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary-600 shadow-sm">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Input */}
                <div className="p-6 bg-white border-t border-gray-50">
                    {messages.length < 3 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestedPrompts.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setInput(p)}
                                    className="px-3 py-1.5 bg-gray-50 hover:bg-primary-50 hover:text-primary-600 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-100 transition-all uppercase tracking-tighter"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything about your studies or schedule..."
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-2xl py-4 pl-6 pr-16 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-sm placeholder:text-slate-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="absolute right-2 h-11 w-11 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3 text-amber-500" /> Powered by Academic Intelligence Layer
            </p>
        </div>
    );
};

export default AIChatbot;
