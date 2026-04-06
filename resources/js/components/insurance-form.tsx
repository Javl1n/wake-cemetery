import { Form, router, useForm, usePage } from "@inertiajs/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { InsuranceProduct } from "@/types"
import subscriptions from "@/routes/subscriptions"

export type InsuranceFormProps = {
    className?: string
}

const emptyBeneficiary = () => ({
    name: "",
    relationship: "",
    date_of_birth: "",
    place_of_birth: "",
    contact: "",
})

function formatFrequency(frequency: InsuranceProduct["frequency"]) {
    const map = { monthly: "Monthly", "semi-anually": "Semi-annual", anually: "Annual" }
    return map[frequency]
}

function StepIndicator({ step }: { step: 1 | 2 }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold border-2",
                    step >= 1 ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"
                )}>1</span>
                <span className={cn("text-sm font-medium", step === 1 ? "text-foreground" : "text-muted-foreground")}>
                    Select a Plan
                </span>
            </div>
            <div className={cn("h-px w-12", step === 2 ? "bg-primary" : "bg-border")} />
            <div className="flex items-center gap-2">
                <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold border-2",
                    step === 2 ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"
                )}>2</span>
                <span className={cn("text-sm font-medium", step === 2 ? "text-foreground" : "text-muted-foreground")}>
                    Beneficiaries
                </span>
            </div>
        </div>
    )
}

export function InsuranceForm({ className }: InsuranceFormProps) {
    const { insurance: initialInsurance, insurances } = usePage<{
        insurance: InsuranceProduct
        insurances: InsuranceProduct[]
    }>().props

    const [step, setStep] = useState<1 | 2>(1)
    const [selectedInsurance, setSelectedInsurance] = useState<InsuranceProduct>(initialInsurance)

    const { data, setData, processing, errors } = useForm<{
        insurance: number
        beneficiaries: {
            name: string
            relationship: string
            date_of_birth: string
            place_of_birth: string
            contact: string
        }[]
    }>({
        insurance: initialInsurance.id,
        beneficiaries: Array.from({ length: initialInsurance.beneficiaries }, emptyBeneficiary),
    })

    function handleContinue() {
        setData({
            insurance: selectedInsurance.id,
            beneficiaries: Array.from({ length: selectedInsurance.beneficiaries }, emptyBeneficiary),
        })
        setStep(2)
    }

    return (
        <div className={cn("flex flex-col gap-8", className)}>
            <StepIndicator step={step} />

            {step === 1 && (
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold">Choose a Plan</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Select the insurance plan that best fits your needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insurances.map((plan) => {
                            const isSelected = plan.id === selectedInsurance.id
                            return (
                                <Card
                                    key={plan.id}
                                    onClick={() => setSelectedInsurance(plan)}
                                    className={cn(
                                        "cursor-pointer transition-colors gap-3",
                                        isSelected
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-muted-foreground/40"
                                    )}
                                >
                                    <CardHeader className="pb-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-base">{plan.name}</CardTitle>
                                            <Badge variant="secondary">{formatFrequency(plan.frequency)}</Badge>
                                        </div>
                                        <CardDescription>{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Separator className="mb-3" />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                {plan.beneficiaries} beneficiar{plan.beneficiaries === 1 ? "y" : "ies"}
                                            </span>
                                            <span className="font-semibold">
                                                ₱{plan.premium.toLocaleString()} / {plan.frequency}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleContinue}>
                            Continue →
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold">Beneficiary Details</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Fill in details for {selectedInsurance.beneficiaries} beneficiar{selectedInsurance.beneficiaries === 1 ? "y" : "ies"}.
                        </p>
                    </div>

                    <div onClick={() => setStep(1)} className="cursor-pointer flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="font-semibold">{selectedInsurance.name}</span>
                            <Badge variant="secondary">{formatFrequency(selectedInsurance.frequency)}</Badge>
                        </div>
                        <span className="font-semibold">₱{selectedInsurance.premium.toLocaleString()} / {selectedInsurance.frequency}</span>
                    </div>

                    <Form
                        onSubmit={(e) => {
                            e.preventDefault()
                            router.post(subscriptions.store(), data as any)
                        }}
                    >
                        <FieldGroup className="flex flex-col gap-6">
                            {data.beneficiaries.length === 0 && (
                                <p className="text-sm text-muted-foreground">No beneficiaries required for this plan.</p>
                            )}

                            {data.beneficiaries.map((beneficiary, index) => (
                                <div key={index} className="rounded-lg border p-5 flex flex-col gap-4">
                                    <p className="text-sm font-semibold text-muted-foreground">Beneficiary {index + 1}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field className="col-span-2">
                                            <FieldLabel>Full Name</FieldLabel>
                                            <Input
                                                value={beneficiary.name}
                                                onChange={(e) => setData(`beneficiaries.${index}.name` as any, e.target.value)}
                                                type="text"
                                                placeholder="John Doe"
                                                required
                                            />
                                            <InputError message={errors[`beneficiaries.${index}.name` as keyof typeof errors]} />
                                        </Field>

                                        <Field>
                                            <FieldLabel>Relationship</FieldLabel>
                                            <Input
                                                value={beneficiary.relationship}
                                                onChange={(e) => setData(`beneficiaries.${index}.relationship` as any, e.target.value)}
                                                type="text"
                                                placeholder="e.g. Spouse, Child"
                                                required
                                            />
                                            <InputError message={errors[`beneficiaries.${index}.relationship` as keyof typeof errors]} />
                                        </Field>

                                        <Field className="">
                                            <FieldLabel>Contact</FieldLabel>
                                            <Input
                                                value={beneficiary.contact}
                                                onChange={(e) => setData(`beneficiaries.${index}.contact` as any, e.target.value)}
                                                type="text"
                                                placeholder="+63 912 345 6789"
                                                required
                                            />
                                            <InputError message={errors[`beneficiaries.${index}.contact` as keyof typeof errors]} />
                                        </Field>

                                        <Field>
                                            <FieldLabel>Date of Birth</FieldLabel>
                                            <Input
                                                value={beneficiary.date_of_birth}
                                                onChange={(e) => setData(`beneficiaries.${index}.date_of_birth` as any, e.target.value)}
                                                type="date"
                                                required
                                            />
                                            <InputError message={errors[`beneficiaries.${index}.date_of_birth` as keyof typeof errors]} />
                                        </Field>

                                        <Field>
                                            <FieldLabel>Place of Birth</FieldLabel>
                                            <Input
                                                value={beneficiary.place_of_birth}
                                                onChange={(e) => setData(`beneficiaries.${index}.place_of_birth` as any, e.target.value)}
                                                type="text"
                                                placeholder="City, Province"
                                                required
                                            />
                                            <InputError message={errors[`beneficiaries.${index}.place_of_birth` as keyof typeof errors]} />
                                        </Field>

                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-between pt-2">
                                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                                    ← Back
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Submitting…" : "Submit"}
                                </Button>
                            </div>
                        </FieldGroup>
                    </Form>
                </div>
            )}
        </div>
    )
}
