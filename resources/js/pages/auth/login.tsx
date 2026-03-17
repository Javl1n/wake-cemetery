import { store } from '@/routes/login';
import LoginForm from '@/components/login-form';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
         <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm
                    status={status}
                    canResetPassword={canResetPassword}
                    canRegister={canRegister}
                    formProps={{
                        ...store.form(),
                        resetOnSuccess: ['password'],
                        disableWhileProcessing: true,
                    }}
                />
            </div>
        </div>
    );
}
