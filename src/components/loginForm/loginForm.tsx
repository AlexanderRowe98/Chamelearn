import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { retrieveUser } from '@/utils/dynamoDb/users';

interface Props {
    updateDisplay: (value: 'login' | 'signUp' | 'forgottenPassword') => void;
}

const LoginForm = ({
    updateDisplay
}: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await retrieveUser(username, password);
            if (!result.validUser) {
                setError("Invalid username or password.");
            } else {
                localStorage.setItem('user', JSON.stringify(result));
                Cookies.set('auth-token', 'bloop', { expires: 7, path: '' });
                router.push('/');
            }
        } catch (error) {
            setError("Error logging in. Please try again.");
            console.error(error); // Log the error for debugging
        }

        setIsLoading(false);
    }

    return (
        <div className='container--fixed'>            
            <form onSubmit={handleLogin} className='form'>
            <h2 className='title'>Login</h2>
                <div className='formGroup'>
                    <label htmlFor="username" className='label'>Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='input'
                        required
                    />
                </div>
                <div className='formGroup'>
                    <label htmlFor="password" className='label'>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='input'
                        required
                    />
                </div>
                {error && <div className='error'>{error}</div>}
                <button type="submit" className='button'>Login</button>
                <div className="formLinks">
                    <p>Forgot your password?</p>
                    <p>Don't have an account? <span onClick={() => updateDisplay('signUp')}>Sign up!</span></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
