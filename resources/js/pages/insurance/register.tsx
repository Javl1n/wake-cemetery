import { Head } from "@inertiajs/react"
import { InsuranceForm } from "@/components/insurance-form"
import AuthCarouselLayout from "@/layouts/auth/auth-carousel-layout"

export default function InsuranceRegisterPage() {
    return (
        <AuthCarouselLayout>
            <Head title="Insurance Registration" />
            <InsuranceForm />
        </AuthCarouselLayout>
    )
}
