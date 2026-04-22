import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Map, MapPinHouseIcon, CalendarCheck, Package, Wrench, UserCog, ShieldCheck, TriangleAlert } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import * as staffRoutes from '@/routes/staff';
import * as subscriptionReviewRoutes from '@/routes/subscriptions/review/index';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const cemeteryNavItems: NavItem[] = [
    {
        title: 'Sections',
        icon: MapPinHouseIcon,
        href: '/cemetery-sections',
    },
    {
        title: 'Plots',
        icon: Map,
        href: '/cemetery-plots',
    },
    {
        title: 'Maintenance',
        icon: TriangleAlert,
        href: '/cemetery-maintenance',
    },
];

const wakeNavItems: NavItem[] = [
    {
        title: 'Wake Schedules',
        icon: CalendarCheck,
        href: '/wake-schedules',
    },
    {
        title: 'Inventory',
        icon: Package,
        href: '/inventory-items',
    },
    {
        title: 'Services',
        icon: Wrench,
        href: '/wake-services',
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Staff',
        icon: UserCog,
        href: staffRoutes.index().url,
    },
    {
        title: 'Insurance Subscriptions',
        icon: ShieldCheck,
        href: subscriptionReviewRoutes.index().url,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdmin = (auth.user as { role: string }).role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={cemeteryNavItems} title="Cemetery" />
                <NavMain items={wakeNavItems} title="Wake Services" />
                {isAdmin && <NavMain items={adminNavItems} title="Admin" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
