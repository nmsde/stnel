import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="overflow-hidden rounded-lg border border-border">
            <div className="border-b border-border bg-muted/50 px-4 py-3">
                <div className="grid grid-cols-12 items-center gap-3">
                    <Skeleton className="col-span-2 h-4" />
                    <Skeleton className="col-span-2 h-4" />
                    <Skeleton className="col-span-2 h-4" />
                    <Skeleton className="col-span-2 h-4" />
                    <Skeleton className="col-span-2 h-4" />
                    <Skeleton className="col-span-2 h-4" />
                </div>
            </div>
            <div className="divide-y divide-border">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="px-4 py-3">
                        <div className="grid grid-cols-12 items-center gap-3">
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="mt-1 h-3 w-12" />
                            </div>
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="mt-1 h-3 w-16" />
                            </div>
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="mt-1 h-3 w-20" />
                            </div>
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <div className="col-span-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="mt-1 h-3 w-16" />
                            </div>
                            <div className="col-span-2">
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function MobileCardSkeleton({ cards = 3 }: { cards?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: cards }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-6 w-16" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function StatCardsSkeleton({ cards = 5 }: { cards?: number }) {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {Array.from({ length: cards }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="mt-2 h-4 w-20" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function AccessLogSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
                <TableSkeleton rows={rows} />
            </div>
            
            {/* Mobile Cards */}
            <div className="space-y-4 lg:hidden">
                {Array.from({ length: rows }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-12" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-14" />
                                        <Skeleton className="h-3 w-18" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}