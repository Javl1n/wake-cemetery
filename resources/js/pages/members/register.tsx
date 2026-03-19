import { Head } from '@inertiajs/react';
import { login } from '@/routes';
import { store } from '@/routes/members/index';
import { MembershipRegisterForm } from '@/components/membership-registerform';

export default function MembershipRegistration() {
    return (
        <>
            <Head title="Membership Registration" />
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-lg">
                            <MembershipRegisterForm/>
                        </div>
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                    <img
                        src="/placeholder.svg"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </>
    );
}
