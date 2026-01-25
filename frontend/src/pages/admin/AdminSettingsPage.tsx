import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Save, Bell, Shield, Settings as SettingsIcon, Globe, Lock, Mail, Smartphone, RefreshCw, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminSettingsPage = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Mock Settings State
    const [settings, setSettings] = useState({
        // General
        platformName: "Ardent Olimpiada",
        supportEmail: "support@ardent.uz",
        currency: "UZS",
        language: "uz",

        // Notifications
        notifyRegistration: true,
        notifyPayment: true,
        notifySystemUpdates: false,
        smsEnabled: true,
        emailEnabled: true,
        pushEnabled: false,

        // System
        smsLimit: 5000,
        smsApiKey: "sk_live_********************",
        paymentProvider: "both", // click, payme, both

        // Security
        admin2FA: true,
        sessionTimeout: 30, // minutes
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Sozlamalar saqlandi",
                description: `O'zgarishlar tizimga muvaffaqiyatli qo'llanildi. Audit log yangilandi.`
            });
        }, 1000);
    };

    const handleChange = (key: string, value: any) => {
        setSettings({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Tizim Sozlamalari</h1>
                    <p className="text-gray-500">Platforma konfiguratsiyasi va xavfsizlik parametrlari</p>
                </div>
                <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 min-w-[140px]">
                    {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Saqlash
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-gray-100 p-1">
                    <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Umumiy</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Xabarlar</TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Tizim</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Xavfsizlik</TabsTrigger>
                </TabsList>

                {/* GENERAL SETTINGS */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Umumiy Ma'lumotlar</CardTitle>
                            <CardDescription>Platformaning asosiy ko'rinishi va aloqa ma'lumotlari.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-500" /> Platforma Nomi
                                    </label>
                                    <Input
                                        value={settings.platformName}
                                        onChange={(e) => handleChange('platformName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" /> Support Email
                                    </label>
                                    <Input
                                        value={settings.supportEmail}
                                        onChange={(e) => handleChange('supportEmail', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Valyuta</label>
                                    <Select value={settings.currency} onValueChange={(val) => handleChange('currency', val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UZS">UZS (So'm)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tizim Tili (Default)</label>
                                    <Select value={settings.language} onValueChange={(val) => handleChange('language', val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="uz">O'zbekcha</SelectItem>
                                            <SelectItem value="ru">Русский</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS SETTINGS */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bildirishnomalar</CardTitle>
                            <CardDescription>Foydalanuvchi va adminlarga yuboriladigan xabarlar nazorati.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="font-bold text-sm text-gray-900">Kanallar Statusi</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><Smartphone className="w-4 h-4" /></div>
                                        <div>
                                            <div className="font-medium text-sm">SMS Xabarlar</div>
                                            <div className="text-xs text-gray-500">Tasdiqlash kodlari va muhim ogohlantirishlar</div>
                                        </div>
                                    </div>
                                    <Switch checked={settings.smsEnabled} onCheckedChange={(c) => handleChange('smsEnabled', c)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Mail className="w-4 h-4" /></div>
                                        <div>
                                            <div className="font-medium text-sm">Email Xabarlar</div>
                                            <div className="text-xs text-gray-500">Marketing va hisobotlar</div>
                                        </div>
                                    </div>
                                    <Switch checked={settings.emailEnabled} onCheckedChange={(c) => handleChange('emailEnabled', c)} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-sm text-gray-900">Admin Ogohlantirishlari</h3>
                                <div className="flex items-center justify-between border-b pb-4">
                                    <label className="text-sm font-medium text-gray-700">Yangi ro'yxatdan o'tishlar haqida xabar berish</label>
                                    <Switch checked={settings.notifyRegistration} onCheckedChange={(c) => handleChange('notifyRegistration', c)} />
                                </div>
                                <div className="flex items-center justify-between border-b pb-4">
                                    <label className="text-sm font-medium text-gray-700">Yangi to'lovlar bo'lganda xabar berish</label>
                                    <Switch checked={settings.notifyPayment} onCheckedChange={(c) => handleChange('notifyPayment', c)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Tizim yangilanishlari (System Updates)</label>
                                    <Switch checked={settings.notifySystemUpdates} onCheckedChange={(c) => handleChange('notifySystemUpdates', c)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SYSTEM SETTINGS */}
                <TabsContent value="system">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tizim Konfiguratsiyasi</CardTitle>
                            <CardDescription className="text-red-500 font-medium bg-red-50 w-fit px-2 py-1 rounded text-xs mt-2">
                                Diqqat: Bu bo'limdagi o'zgarishlar butun platforma ishlashiga ta'sir qiladi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        <Key className="w-4 h-4 text-gray-500" /> SMS Provider API Key
                                    </label>
                                    <Input
                                        type="password"
                                        value={settings.smsApiKey}
                                        onChange={(e) => handleChange('smsApiKey', e.target.value)}
                                        className="font-mono bg-gray-50"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Kunlik SMS Limiti</label>
                                        <Input
                                            type="number"
                                            value={settings.smsLimit}
                                            onChange={(e) => handleChange('smsLimit', Number(e.target.value))}
                                        />
                                        <p className="text-[10px] text-gray-400">Limit tugaganda admin ogohlantiriladi.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">To'lov Tizimlari</label>
                                        <Select value={settings.paymentProvider} onValueChange={(val) => handleChange('paymentProvider', val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="click">Faqat Click</SelectItem>
                                                <SelectItem value="payme">Faqat Payme</SelectItem>
                                                <SelectItem value="both">Click va Payme</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY SETTINGS */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Xavfsizlik va Audit</CardTitle>
                            <CardDescription>Admin hisoblari xavfsizligi va harakatlar tarixi.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="font-bold text-sm text-gray-900">Kirish Xavfsizligi</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block">Ikki bosqichli tasdiqlash (2FA)</label>
                                        <span className="text-xs text-gray-400">Barcha adminlar uchun majburiy</span>
                                    </div>
                                    <Switch checked={settings.admin2FA} onCheckedChange={(c) => handleChange('admin2FA', c)} />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Sessiya vaqti (daqiqada)</label>
                                    <Input
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
                                        className="max-w-[150px]"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm text-gray-900 mb-4">Audit Log (So'nggi harakatlar)</h3>
                                <div className="border rounded-lg divide-y bg-gray-50/50">
                                    <div className="p-3 text-xs flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Admin User</span>
                                        <span className="text-gray-500">Sozlamalar o'zgartirildi (SMS Limit)</span>
                                        <span className="text-gray-400 ml-auto">Bugun, 10:45</span>
                                    </div>
                                    <div className="p-3 text-xs flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Super Admin</span>
                                        <span className="text-gray-500">Yangi kurs qo'shildi (Matematika Pro)</span>
                                        <span className="text-gray-400 ml-auto">Bugun, 09:12</span>
                                    </div>
                                    <div className="p-3 text-xs flex justify-between items-center">
                                        <span className="font-medium text-gray-700">Finance Admin</span>
                                        <span className="text-gray-500">Refund tasdiqlandi (#TRX-1004)</span>
                                        <span className="text-gray-400 ml-auto">Kecha, 18:30</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </div>
    );
};

export default AdminSettingsPage;
