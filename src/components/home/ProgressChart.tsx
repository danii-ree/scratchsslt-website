import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data - in a real app this would come from an API
const data = [
  {
    name: "Week 1",
    score: 65,
  },
  {
    name: "Week 2",
    score: 68,
  },
  {
    name: "Week 3",
    score: 72,
  },
  {
    name: "Week 4",
    score: 75,
  },
  {
    name: "Week 5",
    score: 79,
  },
  {
    name: "Week 6",
    score: 82,
  },
  {
    name: "Week 7",
    score: 85,
  },
];

export function ProgressChart() {
  return (
    <Card className="col-span-3 border border-osslt-purple/20">
      <CardHeader>
        <CardTitle className="text-osslt-purple">Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              domain={[50, 100]}
              ticks={[50, 60, 70, 80, 90, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e4e4e7",
              }}
            />
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8A63D2" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8A63D2" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6941C6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              activeDot={{ r: 6, fill: "#6941C6", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center text-sm">
            <div className="flex items-center">
              <span className="mr-1 inline-block h-3 w-3 rounded-full bg-gradient-to-r from-osslt-purple to-osslt-dark-purple"></span>
              <span className="text-gray-500">Score</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 