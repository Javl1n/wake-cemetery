import { store } from '@/routes/login';
import LoginForm from '@/components/login-form';
import { Head } from '@inertiajs/react';
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useState, useEffect, useCallback } from "react";
import RotatingText from '@/components/RotatingText';
import AuthCarouselLayout from '@/layouts/auth/auth-carousel-layout';

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
        <AuthCarouselLayout>
            <Head title="Login" />
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
        </AuthCarouselLayout>
    );
}
