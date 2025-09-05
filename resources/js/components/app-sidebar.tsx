import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Building2, Shield, Settings, Activity, ChevronRight } from 'lucide-react';
import AppLogo from './app-logo';
import React, { useState } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Organizations',
        href: '/organisations',
        icon: Building2,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const page = usePage();
    const currentUrl = page.url;
    const organisations = (page.props as any).organisations || [];
    
    // State for tracking which organization is expanded
    const [expandedOrgId, setExpandedOrgId] = useState<number | null>(null);
    
    // Check if we're viewing a specific organization and auto-expand it
    const orgMatch = currentUrl.match(/\/organisations\/(\d+)/);
    const currentOrgId = orgMatch ? parseInt(orgMatch[1]) : null;
    
    // Auto-expand current organization on mount/navigation change
    React.useEffect(() => {
        if (currentOrgId && expandedOrgId !== currentOrgId) {
            setExpandedOrgId(currentOrgId);
        }
    }, [currentOrgId]);
    
    // Organization-specific navigation
    const getOrgNavItems = (orgId: number): NavItem[] => [
        {
            title: 'Protected Apps',
            href: `/organisations/${orgId}`,
            icon: Shield,
        },
        {
            title: 'Access Logs',
            href: `/organisations/${orgId}/access-logs`,
            icon: Activity,
        },
        {
            title: 'Settings',
            href: `/organisations/${orgId}/edit`,
            icon: Settings,
        },
    ];

    const handleOrgToggle = (orgId: number) => {
        setExpandedOrgId(expandedOrgId === orgId ? null : orgId);
    };

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
                
                {/* Organizations Section */}
                {organisations.length > 0 && (
                    <SidebarGroup className="px-2 py-0 mt-4">
                        <SidebarGroupLabel>Organizations</SidebarGroupLabel>
                        <SidebarMenu>
                            {organisations.map((org: any) => (
                                <SidebarMenuItem key={org.id}>
                                    <Collapsible 
                                        open={expandedOrgId === org.id}
                                        onOpenChange={() => handleOrgToggle(org.id)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                className="w-full"
                                                tooltip={{ children: org.name }}
                                            >
                                                <Building2 className="h-4 w-4" />
                                                <span className="flex-1 text-left truncate">{org.name}</span>
                                                <ChevronRight 
                                                    className={`h-4 w-4 transition-transform ${
                                                        expandedOrgId === org.id ? 'rotate-90' : ''
                                                    }`} 
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {getOrgNavItems(org.id).map((item) => (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={page.url === (typeof item.href === 'string' ? item.href : item.href.url)}
                                                        >
                                                            <Link href={item.href} prefetch>
                                                                {item.icon && <item.icon />}
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
