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
import { Home } from "lucide-react"

export type SignupFormProps = {
  formProps?: Partial<Omit<React.ComponentProps<typeof Form>, "children">>
  signInHref?: string
  className?: string
}

export function SignupForm({
  className,
  formProps,
  signInHref,
}: SignupFormProps) {
  const formClassName = cn("flex flex-col gap-2", className)

  return (
    <Form className={formClassName} {...formProps}>
      {({ processing, errors }) => (
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-2">
            <a href="/" className="w-10 absolute top-10 left-15">
                <img src="/system/logo.png" className="min-h-20 min-w-20" alt="St. luiz Logo" />
            </a>
          <div className="col-span-full flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Fill in the form below to create your account
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
            <InputError message={errors.name} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            <InputError message={errors.email} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" required />
            <InputError message={errors.password} />
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
            />
            <InputError message={errors.password_confirmation} />
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>

          <Field className="col-span-full">
            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Creating…" : "Create Account"}
            </Button>
          </Field>
          <Field className="md:col-span-2">
            <FieldDescription className="px-6 text-center">
              Already have an account?{' '}
              {signInHref ? (
                <Link href={signInHref}>Sign in</Link>
              ) : (
                <a href="/login">Sign in</a>
              )}
            </FieldDescription>
             <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
          </Field>
        </FieldGroup>
      )}
    </Form>

  )
}
