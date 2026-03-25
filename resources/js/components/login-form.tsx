import { cn } from "@/lib/utils"
import { Form, Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { register } from '@/routes'
import { request } from '@/routes/password'
import { store } from '@/routes/login'

type LoginFormProps = {
  status?: string
  canResetPassword?: boolean
  canRegister?: boolean
  formProps?: Partial<Omit<React.ComponentProps<typeof Form>, 'children'>>
}

export default function LoginForm({
  status,
  canResetPassword,
  canRegister,
  formProps,
  className,
  ...props
}: LoginFormProps & React.ComponentProps<'div'>) {
  const formClassName = cn('flex flex-col gap-6', className)
  const mergedFormProps = {
    ...store.form(),
    ...formProps,
  }

  return (
    <div className={formClassName} {...props}>
          <Form {...mergedFormProps} className="p-6 md:p-8">
            {({ processing, errors }) => (
              <>
                <FieldGroup>
                    <a href="/" className="w-10 relative">
                    </a>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your Membership account
                    </p>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@example.com"
                      required
                      autoFocus
                    />
                    <InputError message={errors.email} />
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      {canResetPassword && (
                        <TextLink
                          href={request().url}
                          className="ml-auto text-sm"
                        >
                          Forgot your password?
                        </TextLink>
                      )}
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                    <InputError message={errors.password} />
                  </Field>

                  <Field>
                    <Button type="submit" disabled={processing}>
                      {processing ? 'Logging in…' : 'Login'}
                    </Button>
                  </Field>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{' '}
                    {canRegister ? (
                      <TextLink href={register().url}>Sign up</TextLink>
                    ) : (
                      <a href="/register">Sign up</a>
                    )}
                  </FieldDescription>
                </FieldGroup>
                {status && (
                  <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                  </div>
                )}
              </>
            )}
          </Form>
      <FieldDescription className="px-2 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
