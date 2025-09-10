import { Badge } from '@/components/ui/badge';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const auth = (page.props as any).auth;
    const user = auth?.user;

    const isProFeature = (title: string) => {
        return title === 'API Tokens';
    };

    const shouldShowProBadge = (title: string) => {
        return isProFeature(title) && !user?.has_pro_access;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span className="flex items-center justify-between w-full">
                                    <span>{item.title}</span>
                                    {shouldShowProBadge(item.title) && (
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                            PRO
                                        </Badge>
                                    )}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
