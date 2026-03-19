// diri ang membership form choi

// inputs to include:
// date_of_birth
// sex
// civil_status: single, married, divorced, widowed
// phone
// address
// nationality
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import InputError from "@/components/input-error"

export type SignupFormProps = {
  formProps?: Partial<Omit<React.ComponentProps<typeof Form>, "children">>
  signInHref?: string
  className?: string
}

export function MembershipRegisterForm({
  className,
  formProps,
  signInHref,
}: SignupFormProps) {
  const formClassName = cn("flex flex-col gap-2", className)

  return (
    <Form className={formClassName} {...formProps}>
      {({ processing, errors }) => (
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-2">
          <div className="col-span-full flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Membership Registration</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Fill up your details to register as a member. You can always update your profile information later.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="date_of_birth">Date of birth</FieldLabel>
            <Input id="date_of_birth" name="date_of_birth" type="date" required />
            <InputError message={errors.date_of_birth} />
          </Field>

          <Field>
            <FieldLabel htmlFor="gender">Gender</FieldLabel>
            <Select>
                <SelectTrigger className="bg-background w-full">
                    <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <InputError message={errors.gender} />
          </Field>
          <Field>
            <FieldLabel htmlFor="civil_status">Civil Status</FieldLabel>
            <Select>
                <SelectTrigger className="bg-background w-full">
                    <SelectValue placeholder="Select your civil status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <InputError message={errors.civil_status} />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
            />
            <InputError message={errors.phone} />
          </Field>

          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input id="address" name="address" type="text" placeholder="Enter your Adress" required />
            <InputError message={errors.address} />
          </Field>
        <Field>
            <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
            <Input id="nationality" name="nationality" type="text" required />
            <InputError message={errors.nationality} />
          </Field>

          <Field className="col-span-full">
            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Submitting…" : "Submit"}
            </Button>
          </Field>
        </FieldGroup>
      )}
    </Form>

  )
}
