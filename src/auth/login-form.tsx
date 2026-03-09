import { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { User, Lock, Eye, EyeOff, AudioWaveform } from 'lucide-react';

export const LoginForm = () => {
    const { login, isLoading, error: authError } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!formData.username.trim()) newErrors.username = 'Обязательное поле';
        if (!formData.password.trim()) {
            newErrors.password = 'Обязательное поле';
        } else if (formData.password.length < 3) {
            newErrors.password = 'Минимум 3 символа';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const result = await login(formData.username, formData.password, rememberMe);
        if (result.success) {
            setFormData({ username: '', password: '' });
            setErrors({});
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <Card className="w-full max-w-md rounded-2xl shadow-sm">
            <CardContent className="pt-8 pb-8 px-10">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                        <AudioWaveform className="h-6 w-6 text-background" />
                    </div>
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Добро пожаловать!</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Пожалуйста, авторизируйтесь</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="username">Логин</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Введите логин"
                                disabled={isLoading}
                                className="pl-10"
                            />
                        </div>
                        {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password">Пароль</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                disabled={isLoading}
                                className="pl-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}>
                                {showPassword
                                    ? <Eye className="h-4 w-4" />
                                    : <EyeOff className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked === true)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="rememberMe" className="cursor-pointer font-normal text-sm">
                            Запомнить данные
                        </Label>
                    </div>
                    {authError && (
                        <p className="text-sm text-destructive">
                            {authError === 'Invalid credentials' ? 'Неверный логин или пароль' : authError}
                        </p>
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full mt-2">
                        {isLoading ? 'Загрузка...' : 'Войти'}
                    </Button>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        <div className="flex-1 h-px bg-border" />
                        или
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        Нет аккаунта?{' '}
                        <span className="text-primary font-medium cursor-pointer hover:underline">
                            Создать
                        </span>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
};
