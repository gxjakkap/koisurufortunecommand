import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import { getAns } from "@/lib/api"


function IndexPage() {
  const key = localStorage.getItem("kfcmd_key")
  const host = import.meta.env.VITE_KFCMD_API
  const { isPending, error, data: res } = useQuery({
    queryKey: ["status"],
    queryFn: () => getAns(host, key || "")
  })

  const navigate = useNavigate()

  console.log(host)

  if (!key || !res) {
    navigate("/no-access")
    return
  }

  const data = res.data
  console.log(data)
  if (!data) return

  return (
    <div className="w-full h-screen flex flex-col justify-center px-4 xl:px-16">
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
        {data.map((x, i) => (
          <>
            <div className="aspect-square size-72 rounded-lg shadow-xl flex flex-col justify-center items-center gap-y-4 mx-4 my-4">
              <span className="text-2xl font-medium">กลุ่ม {i}</span>
              <span className="text-lg">คำตอบ: {x}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

export default IndexPage
