import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function DocumentsChart({ dashboard }) {
  const data = [
    {
      name: "Documents",
      value: dashboard.documents,
    },
    {
      name: "Activities",
      value: dashboard.history,
    },
    {
      name: "Study Hours",
      value: dashboard.study_hours,
    },
    {
      name: "Accuracy",
      value: dashboard.accuracy,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="text-xl font-bold mb-5">
        📊 Dashboard Analytics
      </h2>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={data}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#2563eb"
            radius={[8, 8, 0, 0]}
         />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default DocumentsChart;