import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import TicketWizard from "./TicketWizard";
import ChatWindow from "./ChatWindow";

const SupportWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'wizard' | 'chat'>('wizard');
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    const handleTopicSelect = (topic: string) => {
        setActiveTopic(topic);
        setView('chat');
    };

    const reset = () => {
        setIsOpen(false);
        // Optional: reset view after delay 
        // setTimeout(() => { setView('wizard'); setActiveTopic(null); }, 300);
    };

    return (
        <>
            {/* Trigger Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-gray-900 rotate-90 scale-90' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110 animate-pulse-soft'}`}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 fill-current" />}
                </Button>

                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </div>

            {/* Main Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[90vw] md:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up flex flex-col">
                    {view === 'wizard' ? (
                        <div className="p-6 h-full">
                            <TicketWizard onSelectTopic={handleTopicSelect} />
                        </div>
                    ) : (
                        <ChatWindow
                            topic={activeTopic || 'general'}
                            onClose={reset}
                            onBack={() => setView('wizard')}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default SupportWidget;
