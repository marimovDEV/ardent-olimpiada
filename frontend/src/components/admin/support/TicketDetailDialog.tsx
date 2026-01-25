import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Send, Clock, AlertTriangle, Shield, StickyNote } from "lucide-react";

interface TicketDetailDialogProps {
    ticket: any;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (status: string) => void;
    onReply: (message: string) => void;
}

const TicketDetailDialog = ({ ticket, isOpen, onClose, onStatusChange, onReply }: TicketDetailDialogProps) => {
    const [replyMessage, setReplyMessage] = useState("");
    const [internalNote, setInternalNote] = useState("");
    const [isInternal, setIsInternal] = useState(false);

    if (!ticket) return null;

    const handleSend = () => {
        if (!replyMessage && !internalNote) return;

        if (isInternal) {
            // Internal note logic would go here
            console.log("Internal note:", internalNote);
            setInternalNote("");
        } else {
            onReply(replyMessage);
            setReplyMessage("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-gray-50/50">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b flex justify-between items-start">
                    <div>
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            #{ticket.id} - {ticket.subject}
                            <Badge className={`${ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} border-0`}>
                                {ticket.priority} Priority
                            </Badge>
                        </DialogTitle>
                        <DialogDescription className="mt-1 flex items-center gap-2">
                            <User className="w-4 h-4" /> {ticket.user} ({ticket.email})
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4" /> {ticket.date}
                        </DialogDescription>
                    </div>
                    <div className="flex gap-2">
                        <Select defaultValue={ticket.status} onValueChange={onStatusChange}>
                            <SelectTrigger className="w-[140px] bg-white">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Escalated">Escalated</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" title="Escalate to Super Admin" onClick={() => onStatusChange("Escalated")}>
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                        </Button>
                    </div>
                </div>

                {/* Body: Chat & Sidebar */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white border-r">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* User Initial Message */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <User className="w-6 h-6 text-gray-500" />
                                </div>
                                <div>
                                    <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none text-gray-800 text-sm">
                                        {ticket.lastMessage}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 ml-2">{ticket.date}</div>
                                </div>
                            </div>

                            {/* Mock Admin Reply */}
                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-white text-sm shadow-sm">
                                        Salom! Murojaatingiz uchun rahmat. Biz sizning to'lovingizni tekshirib chiqyapmiz.
                                        Iltimos, to'lov chekini yubora olasizmi?
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 mr-2">Bugun, 10:45</div>
                                </div>
                            </div>

                            {/* Mock Internal Note */}
                            <div className="flex gap-4 flex-row-reverse opacity-75">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                    <StickyNote className="w-4 h-4 text-yellow-600" />
                                </div>
                                <div className="flex flex-col items-end w-full max-w-[80%]">
                                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-yellow-800 text-xs italic w-full">
                                        <span className="font-bold block not-italic mb-1">Internal Note (Admin):</span>
                                        User to'lov tizimida muammo borligini aytyapti. Loglarni tekshirish kerak.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex gap-2 mb-2">
                                <Button
                                    size="sm"
                                    variant={!isInternal ? "default" : "outline"}
                                    className={!isInternal ? "bg-blue-600 hover:bg-blue-700" : ""}
                                    onClick={() => setIsInternal(false)}
                                >
                                    Mijozga javob
                                </Button>
                                <Button
                                    size="sm"
                                    variant={isInternal ? "secondary" : "outline"}
                                    onClick={() => setIsInternal(true)}
                                    className={isInternal ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}
                                >
                                    Ichki Eslatma
                                </Button>
                            </div>
                            <div className={`relative rounded-xl border ${isInternal ? 'border-yellow-300 ring-4 ring-yellow-50' : 'border-gray-200 focus-within:ring-2 ring-blue-100'} transition-all bg-white`}>
                                <Textarea
                                    placeholder={isInternal ? "Faqat adminlar ko'radigan eslatma..." : "Mijozga javob yozing..."}
                                    className="border-0 focus-visible:ring-0 min-h-[80px] resize-none py-3"
                                    value={isInternal ? internalNote : replyMessage}
                                    onChange={(e) => isInternal ? setInternalNote(e.target.value) : setReplyMessage(e.target.value)}
                                />
                                <div className="flex justify-between items-center p-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                                    <span className="text-xs text-gray-400">Markdown qo'llab-quvvatlanadi</span>
                                    <Button size="sm" onClick={handleSend} className={isInternal ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-blue-600 hover:bg-blue-700"}>
                                        <Send className="w-3 h-3 mr-2" />
                                        {isInternal ? "Eslatmani saqlash" : "Javobni yuborish"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Customer Info */}
                    <div className="w-80 bg-gray-50 p-6 border-l overflow-y-auto hidden md:block">
                        <h4 className="font-bold text-gray-900 mb-4">Mijoz Haqida</h4>

                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-xl border shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-white font-bold">
                                        {ticket.user[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{ticket.user}</div>
                                        <div className="text-xs text-gray-500">Talaba</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                                    <div className="bg-gray-50 p-2 rounded">
                                        <div className="text-gray-400">Jami Xarajat</div>
                                        <div className="font-bold text-green-600">1.2M</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <div className="text-gray-400">Kurslar</div>
                                        <div className="font-bold text-blue-600">4 Faol</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h5 className="font-bold text-xs text-gray-500 uppercase mb-3">So'nggi Faollik</h5>
                                <div className="space-y-3">
                                    <div className="flex gap-3 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium">Course Completed</div>
                                            <div className="text-gray-500">Python Start (98%)</div>
                                            <div className="text-[10px] text-gray-400">2 days ago</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 text-xs">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium">Olympiad Registration</div>
                                            <div className="text-gray-500">Math Spring 2024</div>
                                            <div className="text-[10px] text-gray-400">5 days ago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TicketDetailDialog;
