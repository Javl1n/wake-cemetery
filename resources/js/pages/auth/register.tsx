import { Head } from '@inertiajs/react';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { SignupForm } from '@/components/signup-form';
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useState, useEffect, useCallback } from "react";
import RotatingText from '@/components/RotatingText';
import AuthCarouselLayout from '@/layouts/auth/auth-carousel-layout';

export default function Register() {

    return (
        <AuthCarouselLayout>
            <Head title="Register" />
            <SignupForm
                formProps={{
                    ...store.form(),
                    resetOnSuccess: ['password', 'password_confirmation'],
                    disableWhileProcessing: true,
                }}
                signInHref={login().url}
            />
        </AuthCarouselLayout>
    );
}
