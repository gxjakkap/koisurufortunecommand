import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

import { getAns } from "@/lib/api"
import { EMPLOYEES } from "@/lib/emp_data"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

function t(inp: string, ml = 7): string {
  return inp.length > ml
    ? inp.slice(0, ml) + "…"
    : inp;
}

function SummaryPage() {
  const key = localStorage.getItem("kfcmd_key")
  const host = import.meta.env.VITE_KFCMD_API
  const navigate = useNavigate()

  if (!key) {
    location.replace("/no-access")
  }

  const { data: res } = useQuery({
    queryKey: ["status"],
    queryFn: () => getAns(host, key || "")
  })

  if (!key || !res) {
    navigate("/no-access")
    return
  }

  const data = res.data
  if (!data) return

  const allEmpty = data.every(answer => answer.ans === -1)
  
  if (allEmpty) {
    return (
      <div className="w-full h-screen flex flex-col">
        <nav className="w-full bg-white shadow-sm border-b px-4 xl:px-16 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Koisuru fortune command</h1>
            <button 
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              กลับ
            </button>
          </div>
        </nav>

        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-600 mb-4">ยังไม่มีกลุ่มใดส่งคำตอบ</h2>
            <p className="text-lg text-gray-500 mb-8">อัปเดต: {(new Date()).toLocaleString()}</p>
            <button 
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              กลับ
            </button>
          </div>
        </div>
      </div>
    )
  }

  const answerCounts = data.reduce((acc, answer) => {
    if (answer.ans !== -1) {
      const answerValue = answer.ans.toString()
      acc[answerValue] = (acc[answerValue] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(answerCounts).map(([answer, count]) => ({
    name: `${EMPLOYEES[parseInt(answer)]['name'].split(" ")[0]} ${t(EMPLOYEES[parseInt(answer)]['name'].split(" ")[1])} ${(EMPLOYEES[parseInt(answer)]['stage_name'] ? `(${EMPLOYEES[parseInt(answer)]['stage_name']})`: "")}`,
    value: count,
    answer: answer
  }))

  const totalResponses = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-screen flex flex-col">
      <nav className="w-full bg-white shadow-sm border-b px-4 xl:px-16 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Koisuru fortune command</h1>
          <button 
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            กลับ
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">คำตอบ</h2>
            <p className="text-lg text-gray-600">กลุ่มที่ส่งแล้ว: {totalResponses} กลุ่ม ({(new Date()).toLocaleString()})</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name}: ${value} กลุ่ม`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, _name, props) => [
                    `${value} responses`, 
                    `${props.payload.answer}`
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartData.map((item, index) => (
              <div key={item.answer} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{item.value}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {((item.value / totalResponses) * 100).toFixed(1)}% จากทั้งหมด
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryPage
