import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'Matematika Pro', revenue: 12500000, color: '#3b82f6' },
    { name: 'Fizika Olympiad', revenue: 8400000, color: '#8b5cf6' },
    { name: 'Python Start', revenue: 6200000, color: '#10b981' },
    { name: 'Ingliz tili', revenue: 4100000, color: '#f59e0b' },
    { name: 'Mantiq', revenue: 1500000, color: '#64748b' },
];

const TopItemsChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Eng Foydali Mahsulotlar</h3>
            <p className="text-xs text-gray-500 mb-6">Jami daromad bo'yicha TOP 5</p>

            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: number) => [`${value.toLocaleString()} so'm`, "Daromad"]} />
                        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopItemsChart;
