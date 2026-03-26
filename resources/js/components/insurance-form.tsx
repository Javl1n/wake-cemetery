import { Form, Link } from "@inertiajs/react"
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

export type InsuranceFormProps = {
  formProps?: Partial<Omit<React.ComponentProps<typeof Form>, "children">>
  insuranceId?: string
  className?: string
}

export function InsuranceForm({
  className,
  formProps,
  insuranceId,
}: InsuranceFormProps) {
  const formClassName = cn("flex flex-col gap-2", className)

  return (
    <Form className={formClassName} {...formProps} >
      {({ processing, errors }) => (
        <FieldGroup className="flex flex-1 gap-10">
          <div className="col-span-full flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Beneficiaries Form</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Fill in the form below to submit your beneficiaries information
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 border-2 rounded-lg p-6">
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
            <InputError message={errors.name} />
          </Field>

          <Field>
            <FieldLabel htmlFor="relationship">Relationship</FieldLabel>
            <Input
              id="relationship"
              name="relationship"
              type="text"
              placeholder="e.g., Spouse, Child, Parent"
              required
            />
            <InputError message={errors.relationship} />
          </Field>
          <Field>
            <FieldLabel htmlFor="date_of_birth">Date of Birth</FieldLabel>
            <Input id="date_of_birth" name="date_of_birth" type="date" required />
            <InputError message={errors.date_of_birth} />
          </Field>
          <Field>
            <FieldLabel htmlFor="place_of_birth">Place of Birth</FieldLabel>
            <Input id="place_of_birth" name="place_of_birth" type="text" required />
            <InputError message={errors.place_of_birth} />
          </Field>
            <Field className="col-span-2">
            <FieldLabel htmlFor="place_of_birth">Place of Birth</FieldLabel>
            <Input id="place_of_birth" name="place_of_birth" type="text" required />
            <InputError message={errors.place_of_birth} />
          </Field>
          </div>
          <Field className="col-span-full">
            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Submiting…" : "Submit"}
            </Button>
          </Field>
        </FieldGroup>
      )}
    </Form>

  )
}
