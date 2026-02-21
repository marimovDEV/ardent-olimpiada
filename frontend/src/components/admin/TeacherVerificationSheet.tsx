
import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ShieldCheck,
    FileText,
    ExternalLink,
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/services/api";

interface Teacher {
    id: number;
    first_name: string;
    last_name: string;
    teacher_profile?: {
        verification_status: string;
        rejection_reason?: string;
        is_identity_verified: boolean;
        identity_document?: string;
    };
}

interface TeacherVerificationSheetProps {
    teacher: Teacher | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onVerify: (id: number, status: string, reason?: string) => Promise<void>;
    onToggleIdentity: (id: number) => Promise<void>;
}

const TeacherVerificationSheet = ({
    teacher,
    open,
    onOpenChange,
    onVerify,
    onToggleIdentity
}: TeacherVerificationSheetProps) => {
    const { t } = useTranslation();
    const [reason, setReason] = useState(teacher?.teacher_profile?.rejection_reason || "");
    const [loading, setLoading] = useState(false);

    if (!teacher) return null;

    const handleAction = async (status: string) => {
        setLoading(true);
        try {
            await onVerify(teacher.id, status, status === 'REJECTED' ? reason : "");
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleIdentity = async () => {
        setLoading(true);
        try {
            await onToggleIdentity(teacher.id);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[500px] overflow-y-auto">
                <SheetHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <SheetTitle className="text-2xl font-black">
                            {t('admin.teacherVerification')}
                        </SheetTitle>
                        <SheetDescription>
                            {teacher.first_name} {teacher.last_name} arizasini ko'rib chiqish va tasdiqlash.
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <div className="py-8 space-y-8">
                    {/* Identity Doc */}
                    <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {t('admin.identityDocument')}
                        </Label>
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border group">
                            {teacher.teacher_profile?.identity_document ? (
                                <>
                                    <img
                                        src={getImageUrl(teacher.teacher_profile.identity_document)}
                                        className="w-full h-full object-cover"
                                        alt="Passport/ID"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <Button variant="secondary" size="sm" asChild>
                                            <a href={getImageUrl(teacher.teacher_profile.identity_document)} target="_blank" rel="noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" /> {t('common.viewLarge')}
                                            </a>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                    <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-xs font-bold">{t('admin.noDocumentUploaded')}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between bg-muted/30 p-4 rounded-xl">
                            <div className="space-y-1">
                                <p className="text-sm font-bold">{t('admin.identityVerified')}</p>
                                <p className="text-xs text-muted-foreground">{t('admin.manuallyVerifyIdentity')}</p>
                            </div>
                            <Button
                                variant={teacher.teacher_profile?.is_identity_verified ? "default" : "outline"}
                                size="sm"
                                className="rounded-xl h-10 px-4"
                                onClick={handleToggleIdentity}
                                disabled={loading}
                            >
                                {teacher.teacher_profile?.is_identity_verified ? (
                                    <><CheckCircle2 className="w-4 h-4 mr-2" /> {t('common.verified')}</>
                                ) : (
                                    t('common.verify')
                                )}
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Status Actions */}
                    <div className="space-y-6">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            {t('admin.finalDecision')}
                        </Label>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label className="font-bold text-xs ml-1">{t('admin.rejectionReason')} (Ixtiyoriy)</Label>
                                <Textarea
                                    placeholder={t('admin.rejectionReasonPlaceholder')}
                                    className="min-h-[100px] rounded-2xl bg-muted/30 border-none font-medium"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 h-14 rounded-2xl bg-red-500 hover:bg-red-600 font-black shadow-lg shadow-red-500/20"
                                    onClick={() => handleAction('REJECTED')}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <><XCircle className="w-5 h-5 mr-2" /> {t('common.reject')}</>
                                    )}
                                </Button>
                                <Button
                                    className="flex-1 h-14 rounded-2xl bg-green-600 hover:bg-green-700 font-black shadow-lg shadow-green-600/20"
                                    onClick={() => handleAction('APPROVED')}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <><CheckCircle2 className="w-5 h-5 mr-2" /> {t('common.approve')}</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter className="pt-4">
                    <p className="text-[10px] text-center w-full text-muted-foreground font-medium italic">
                        Tasdiqlashdan so'ng o'qituvchiga avtomatik bildirishnoma yuboriladi.
                    </p>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

const Separator = () => <div className="h-px bg-border/60 w-full" />;

export default TeacherVerificationSheet;
