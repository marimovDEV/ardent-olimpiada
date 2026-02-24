import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    onSuccess?: (newBalance?: number) => void;
    requiredAmount?: number;
}

const PaymentModal = ({ isOpen, onOpenChange, onClose }: PaymentModalProps) => {

    const handleOpenChange = (open: boolean) => {
        if (onOpenChange) onOpenChange(open);
        if (!open && onClose) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-card border border-border">
                <DialogHeader>
                    <DialogTitle>Hisobni to'ldirish</DialogTitle>
                    <DialogDescription>Hozirda hisobni to'ldirish faqat Telegram orqali admin bilan bog'lanish yordamida amalga oshiriladi.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.54 2.15l-19 9.5a1 1 0 0 0-.15 1.76l5.77 2.3 2.15 7a1 1 0 0 0 1.83.18l3.14-3.5 4.54 3.63a1 1 0 0 0 1.57-.46l4.5-18a1 1 0 0 0-1.2-1.31L21.54 2.15z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-foreground">Siz admin orqali Payme, Click yoki boshqa uzatish xizmatlari orqali to'lovlarni amalga oshirishingiz mumkin.</p>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={() => window.open('https://t.me/Ardent_support_bot', '_blank')}
                        className="w-full bg-[#2AABEE] text-white hover:bg-[#229ED9] rounded-xl font-bold h-12 shadow-md">
                        Telegram orqali to'lash
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
