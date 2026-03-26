import { GalleryVerticalEnd } from "lucide-react"

import { InsuranceForm } from "@/components/insurance-form"

export default function LoginPage() {
  return (
             <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <h1>St. Luiz wake cemetery</h1>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-lg">
                            <InsuranceForm />
                        </div>
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block h-full min-h-svh">

                </div>
            </div>

  )
}
