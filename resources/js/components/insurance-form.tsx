import { Form, Link, router, useForm, usePage } from "@inertiajs/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import InputError from "@/components/input-error"
import { InsuranceProduct } from "@/types"
import subscriptions from "@/routes/subscriptions"

export type InsuranceFormProps = {
    formProps?: Partial<Omit<React.ComponentProps<typeof Form>, "children">>
    className?: string
}

export function InsuranceForm({
    className,
    formProps,
}: InsuranceFormProps) {
    const formClassName = cn("flex flex-col gap-2", className)
    const { insurance, insurances } = usePage<{
        insurance: InsuranceProduct,
        insurances: InsuranceProduct[]
    }>().props;

    const { data, setData, processing, errors } = useForm<{
        insurance: string | number,
        beneficiaries: {
            name: string,
            relationship: string,
            date_of_birth: string,
            place_of_birth: string,
            contact: string
        }[]
    }>({
        insurance: insurance.id,
        beneficiaries: [...Array(insurance.beneficiaries)].map((index) => ({
            name: "",
            relationship: "",
            date_of_birth: new Date().toDateString(),
            place_of_birth: "",
            contact: ""
        }))
    })

    return (
        <Form onClick={() => {
            router.post(subscriptions.store());
        }} className={formClassName} {...formProps} >
            <FieldGroup className="flex flex-1 gap-10">
                <div className="col-span-full flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Beneficiaries Form</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Fill in the form below to submit your beneficiaries information
                    </p>
                </div>
                {data.beneficiaries.map((beneficiary, index) => (

                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 border-2 rounded-lg p-6">
                        <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input value={beneficiary.name} onChange={(e) => setData(`beneficiaries.${index}.name`, e.target.value)} type="text" placeholder="John Doe" required />
                            <InputError message={errors[`beneficiaries.${index}.name`]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="relationship">Relationship</FieldLabel>
                            <Input
                                value={beneficiary.relationship}
                                onChange={(e) => setData(`beneficiaries.${index}.relationship`, e.target.value)}
                                name="relationship"
                                type="text"
                                placeholder="e.g., Spouse, Child, Parent"
                                required
                            />
                            <InputError message={errors[`beneficiaries.${index}.relationship`]} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
                            <Input
                                value={beneficiary.date_of_birth}
                                onChange={(e) => setData(`beneficiaries.${index}.date_of_birth`, e.target.value)}
                                name="date_of_birth" type="date" required />
                            <InputError message={errors[`beneficiaries.${index}.date_of_birth`]} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="place_of_birth">Place of Birth</FieldLabel>
                            <Input name="place_of_birth" type="text" required />
                            <InputError message={errors[`beneficiaries.${index}.place_of_birth`]} />
                        </Field>
                        <Field className="col-span-2">
                            <FieldLabel htmlFor="place_of_birth">Contact</FieldLabel>
                            <Input name="contact" type="text" required />
                            <InputError message={errors[`beneficiaries.${index}.contact`]} />
                        </Field>
                    </div>
                ))}
                <Field className="col-span-full">
                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? "Submiting…" : "Submit"}
                    </Button>
                </Field>
            </FieldGroup>
        </Form>

    )
}
