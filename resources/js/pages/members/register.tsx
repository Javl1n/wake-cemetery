import { Head } from '@inertiajs/react';
import { MembershipRegisterForm } from '@/components/membership-registerform';
import AuthCarouselLayout from '@/layouts/auth/auth-carousel-layout';

export default function MembershipRegistration() {
    return (
        <AuthCarouselLayout>
            <Head title="Membership Registration" />
            <MembershipRegisterForm />
        </AuthCarouselLayout>
    );
}

