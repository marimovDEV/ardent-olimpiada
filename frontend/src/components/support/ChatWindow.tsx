import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, X, MoreVertical, CheckCheck } from "lucide-react";

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'admin';
    time: string;
}

interface ChatWindowProps {
    topic: string;
    onClose: () => void;
    onBack: () => void;
}

// Mock messages for simulation
const initialMessages: Message[] = [
    { id: 1, text: "Assalomu alaykum! Bizning support jamoamizga xush kelibsiz.", sender: 'admin', time: '10:00' },
    { id: 2, text: "Savolingizni batafsil yozib qoldiring, tez orada javob beramiz.", sender: 'admin', time: '10:00' }
];

const ChatWindow = ({ topic, onClose, onBack }: ChatWindowProps) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputText("");

        // Simulate auto-reply after 1.5s
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "Rahmat! Murojaatingiz qabul qilindi (Ticket #4289). Operatorlarimiz 15 daqiqa ichida javob berishadi.",
                sender: 'admin',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
    };

    const getTopicLabel = (id: string) => {
        switch (id) {
            case 'course': return "Kurslar bo'yicha";
            case 'olympiad': return "Olimpiada";
            case 'payment': return "To'lov masalalari";
            default: return "Yordam";
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
                        <span className="text-xl">←</span>
                    </Button>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{getTopicLabel(topic)}</h3>
                        <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded w-fit font-medium">
                            ● Ticket #4289
                        </span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                            {msg.text}
                            <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                {msg.time}
                                {msg.sender === 'user' && <CheckCheck className="w-3 h-3" />}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 shrink-0">
                        <Paperclip className="w-5 h-5" />
                    </Button>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Xabar yozing..."
                        className="flex-1 bg-gray-50 border-0 rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
                    />
                    <Button onClick={handleSend} size="icon" className={`rounded-xl shrink-0 transition-all ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                        <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
