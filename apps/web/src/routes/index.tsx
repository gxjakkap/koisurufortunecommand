import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { RotateCcw, Trash2 } from "lucide-react"
import { useState } from "react"

import { getAns, removeAns, resetAllAns } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from "@/components/ui/context-menu"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EMPLOYEES } from "@/lib/emp_data"


function IndexPage() {
  const key = localStorage.getItem("kfcmd_key")
  const host = import.meta.env.VITE_KFCMD_API
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [resetAllOpen, setResetAllOpen] = useState(false)
  const [resetGroupOpen, setResetGroupOpen] = useState<number | null>(null)

  if (!key) {
    location.replace("/no-access")
  }

  const { data: res } = useQuery({
    queryKey: ["status"],
    queryFn: () => getAns(host, key || "")
  })

  const resetMutation = useMutation({
    mutationFn: (gid: number) => removeAns(host, key || "", gid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status"] })
      setResetGroupOpen(null)
    }
  })

  const resetAllMutation = useMutation({
    mutationFn: () => resetAllAns(host, key || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status"] })
      setResetAllOpen(false)
    }
  })

  console.log(host)

  if (!res) {
    navigate("/no-access")
    return
  }

  const data = res.data
  console.log(data)
  if (!data) return

  return (
    <div className="w-full h-screen flex flex-col">
      <nav className="w-full bg-white shadow-sm border-b px-4 xl:px-16 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Koisuru fortune command</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/summary")}
              className="px-4 text-black"
            >
              สรุป
            </button>
            <AlertDialog open={resetAllOpen} onOpenChange={setResetAllOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset คำตอบ
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will reset all group answers. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => resetAllMutation.mutate()}
                  disabled={resetAllMutation.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {resetAllMutation.isPending ? "Resetting..." : "Reset All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col justify-center px-4 xl:px-16">
        <div className="grid grid-cols-1 place-items-center md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4">
          {data.map((answerData, i) => {
            const isAnswered = answerData.ans !== -1
            const answerValue = answerData.ans
            const submitTime = answerData.submitTime
            
            return (
              <ContextMenu key={i}>
                <ContextMenuTrigger asChild>
                  <div className="aspect-square size-72 rounded-lg shadow-xl flex flex-col justify-center items-center gap-y-4 mx-4 my-4 cursor-context-menu hover:shadow-2xl transition-shadow">
                    <span className="text-2xl font-medium">กลุ่ม {i}</span>
                    {!isAnswered ? (
                      <span className="text-lg">ยังไม่ได้ตอบ</span>
                    ) : (
                      <div className="text-center">
                        <span className="text-lg">คำตอบ: {EMPLOYEES[answerValue]['name']} {EMPLOYEES[answerValue]['stage_name'] ? `(${EMPLOYEES[answerValue]['stage_name']})` : ""}</span>
                        {submitTime && (
                          <div className="text-base text-gray-600 mt-2">
                            {new Date(submitTime).toLocaleString('th-TH')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => setResetGroupOpen(i)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Group {i}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          })}
        </div>
      </div>
      <AlertDialog open={resetGroupOpen !== null} onOpenChange={(open) => !open && setResetGroupOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Group {resetGroupOpen}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will reset the answer for group {resetGroupOpen}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resetGroupOpen !== null && resetMutation.mutate(resetGroupOpen)}
              disabled={resetMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Group"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default IndexPage
