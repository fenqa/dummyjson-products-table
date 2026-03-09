import { useState } from 'react';
import Products from './products/page';
import LoginPage from './auth/page';
import { useAuth } from './auth/AuthContext';
import { useDebounce } from '@/lib/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

function App() {
    const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    return (
        <div className="min-h-screen bg-muted">
            {authLoading ? (
                <div className="flex items-center justify-center">
                    <p className="text-muted-foreground">Загрузка...</p>
                </div>
            ) : isAuthenticated && user ? (
                <div className="h-screen flex flex-col">
                    <nav className="bg-white shrink-0 mt-4">
                        <div className="px-8 h-18.25 flex items-center gap-6">
                            <h1 className="font-bold text-base shrink-0">Товары</h1>
                            <div className="flex-1 max-w-2xl mx-auto relative bg-muted rounded-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Найти"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9 box-shadow-none focus:ring-0 focus-visible:ring-0"
                                />
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm text-muted-foreground">
                                    {user.firstName} {user.lastName}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}>
                                    Выход
                                </Button>
                            </div>
                        </div>
                    </nav>
                    <div className="flex-1 min-h-0 bg-white mt-4">
                        <Products search={debouncedSearch} />
                    </div>
                </div>
            ) : (
                <LoginPage />
            )}
        </div>
    );
}

export default App;
