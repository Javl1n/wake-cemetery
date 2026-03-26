import { Head, usePage } from '@inertiajs/react';
import { Navbar5 } from '@/components/navbar5';
import { Footer7 } from '@/components/footer7';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BadgeCheck, Heart, Shield, Zap } from 'lucide-react';

export default function MemberDashboard() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Member Dashboard" />

            <div className='min-h-screen flex flex-col'>
                <header className="sticky bg-background top-0 z-50 w-full shadow-lg">
                    <div className="mx-auto max-w-7xl px-6">
                        <Navbar5 />
                    </div>
                </header>

                <main className='flex-1'>
                    <div className="mx-auto max-w-7xl px-6 py-12">
                        {/* Welcome Section */}
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold mb-2">
                                Welcome back, {auth.user?.name}! 👋
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Manage your membership and insurance plans
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-500" />
                                        Active Subscriptions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">1</p>
                                    <p className="text-xs text-muted-foreground mt-1">You have 1 active plan</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        Beneficiaries
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">3</p>
                                    <p className="text-xs text-muted-foreground mt-1">Protected members</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-yellow-500" />
                                        Next Payment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold">₱1,500</p>
                                    <p className="text-xs text-muted-foreground mt-1">Due on April 15, 2026</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Current Plan */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Insurance Plan</CardTitle>
                                        <CardDescription>Family Protection - Monthly Plan</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium mb-1">Plan Details</p>
                                                <ul className="space-y-2 text-sm text-muted-foreground">
                                                    <li className="flex items-center gap-2">
                                                        <BadgeCheck className="h-4 w-4 text-green-500" />
                                                        Premium: ₱1,500/month
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <BadgeCheck className="h-4 w-4 text-green-500" />
                                                        Status: Active
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <BadgeCheck className="h-4 w-4 text-green-500" />
                                                        Beneficiaries: 3
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold">₱1,500</p>
                                                <p className="text-xs text-muted-foreground">Monthly Premium</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                            <Button variant="outline" className="flex-1">View Details</Button>
                                            <Button className="flex-1">Manage Plan</Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="w-full">Update Profile</Button>
                                        <Button variant="outline" className="w-full">View Claims</Button>
                                        <Button variant="outline" className="w-full">Add Beneficiary</Button>
                                        <Button variant="outline" className="w-full">Payment History</Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="space-y-6">
                                {/* Member Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Member Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Member ID</p>
                                            <p className="font-medium">2026-000001</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Member Since</p>
                                            <p className="font-medium">March 26, 2026</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Email</p>
                                            <p className="font-medium">{auth.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Phone</p>
                                            <p className="font-medium">+63 9XX XXX XXXX</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Need Help */}
                                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                    <CardHeader>
                                        <CardTitle className="text-base">Need Help?</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            Have questions about your plan or need assistance?
                                        </p>
                                        <Button className="w-full" variant="default">
                                            Contact Support
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="bg-background shadow-lg mt-12">
                    <div className="mx-auto max-w-7xl px-6 py-10">
                        <Footer7 />
                    </div>
                </footer>
            </div>
        </>
    );
}
