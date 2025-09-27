import { useMutation } from "@tanstack/react-query"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { removeAns } from "@/lib/api"
import { TrashIcon } from "lucide-react"


interface DeleteDialogProps {
  gid: number
  ans: string
}

export default function DeleteDialog(props: DeleteDialogProps){
    const key = localStorage.getItem("kfcmd_key")
    const host = import.meta.env.VITE_KFCMD_API
    const { isPending, data: res, mutate } = useMutation({
        mutationFn: () => removeAns(host, key!, props.gid),
        onSuccess: () => {
            location.reload()
        }
    })

    return (
        <Dialog>
            <ContextMenu>
              <ContextMenuTrigger>
                
              </ContextMenuTrigger>
              <ContextMenuContent>
                <DialogTrigger asChild>
                    <ContextMenuItem>
                        <Button variant="ghost"><TrashIcon /> Delete Answer</Button>
                    </ContextMenuItem>
                </DialogTrigger>
              </ContextMenuContent>
            </ContextMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        You are removing answer for group {props.gid.toString()}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => mutate()}>
                        {isPending && <Spinner />} Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}