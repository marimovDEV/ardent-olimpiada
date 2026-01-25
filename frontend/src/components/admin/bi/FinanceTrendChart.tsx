import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan 15', income: 1200000 },
    { name: 'Jan 16', income: 1850000 },
    { name: 'Jan 17', income: 950000 },
    { name: 'Jan 18', income: 2400000 },
    { name: 'Jan 19', income: 3100000 },
    { name: 'Jan 20', income: 2800000 },
    { name: 'Jan 21', income: 3500000 },
];

const FinanceTrendChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">Daromad Trendi</h3>
                    <p className="text-xs text-gray-500">So'nggi 7 kunlik tushumlar</p>
                </div>
                <select className="bg-gray-50 border border-gray-200 rounded-lg text-xs px-2 py-1 outline-none">
                    <option>7 kun</option>
                    <option>30 kun</option>
                </select>
            </div>

            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString()}`} />
                        <Tooltip formatter={(value: number) => [`${value.toLocaleString()} so'm`, "Tushum"]} />
                        <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FinanceTrendChart;
