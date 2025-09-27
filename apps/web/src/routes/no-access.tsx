import { useNavigate } from "react-router"
import { SaveIcon } from "lucide-react"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function NoAccessPage() {
    const [apiKeyInput, setApiKeyInput] = useState("")
    const navigate = useNavigate()
  
    function handleSave(){
        localStorage.setItem("kfcmd_key", apiKeyInput)
        navigate("/")
    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-y-14 px-4 xl:px-16">
            <span className="text-xl 2xl:text-4xl">Set API Key</span>
            <div className="flex gap-x-3">
                <Input value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} placeholder="Input API Key here" />
                <Button onClick={() => handleSave()}><SaveIcon /> Set</Button>
            </div>
        </div>
    )
}

export default NoAccessPage
