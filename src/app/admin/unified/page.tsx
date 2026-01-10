import UnifiedAdminView from '@/components/UnifiedAdminView';
import AdminDock from '@/components/AdminDock';

export default function UnifiedAdminPage() {
    return (
        <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 md:pr-24 relative overflow-hidden bg-[#0a0a0a]">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Admin Navigation */}
            <AdminDock currentPage="unified" />

            <div className="max-w-7xl mx-auto relative z-10">
                <UnifiedAdminView />
            </div>
        </main>
    );
}
