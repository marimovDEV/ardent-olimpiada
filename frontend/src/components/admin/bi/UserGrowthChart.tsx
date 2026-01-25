import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan 15', users: 40 },
    { name: 'Jan 16', users: 55 },
    { name: 'Jan 17', users: 85 },
    { name: 'Jan 18', users: 70 },
    { name: 'Jan 19', users: 110 },
    { name: 'Jan 20', users: 145 },
    { name: 'Jan 21', users: 190 },
];

const UserGrowthChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">Yangi o'quvchilar (Kunlik)</h3>
                <select className="bg-gray-50 border border-gray-200 rounded-lg text-xs px-2 py-1 outline-none">
                    <option>Oxirgi 7 kun</option>
                    <option>Oxirgi 30 kun</option>
                </select>
            </div>

            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserGrowthChart;
