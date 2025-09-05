export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <img 
                src="/stnel-logo.svg" 
                alt="Stnel" 
                className="h-8 w-auto"
            />
            <span className="font-semibold text-sidebar-primary-foreground text-lg">
                Stnel
            </span>
        </div>
    );
}
