import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Matematika', value: 4500000, color: '#2563eb' }, // Blue
    { name: 'Informatika', value: 3000000, color: '#16a34a' }, // Green
    { name: 'Fizika', value: 1500000, color: '#9333ea' }, // Purple
    { name: 'Ingliz tili', value: 1000000, color: '#ef4444' }, // Red
    { name: 'Boshqa', value: 500000, color: '#f59e0b' }, // Yellow
];

const RevenueChart = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Daromad manbalari (Fanlar kesimida)</h3>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${(Number(value) / 1000000).toFixed(1)}M so'm`} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
                Jami daromad: <span className="text-gray-900 font-bold">10.5M so'm</span>
            </div>
        </div>
    );
};

export default RevenueChart;
