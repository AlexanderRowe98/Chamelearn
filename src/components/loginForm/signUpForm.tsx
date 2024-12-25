import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import MainLanguageSelector from '../toggles';
import { createUser, retrieveUser } from '@/utils/dynamoDb/users';

interface Props {
    updateDisplay: (value: 'login' | 'signUp' | 'forgottenPassword') => void;
}

const SignUpForm = ({
    updateDisplay
}: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [mainLanguage, setMainLanguage] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await createUser(username, password, email, mainLanguage, new Date());
            if (result) {
                updateDisplay('login');
            }
        } catch (error) {
            setError("Error creating user. Please try again.");
            console.error(error); // Log the error for debugging
        }

        setIsLoading(false);
    }

    return (
        <div className='container--fixed'>            
            <form onSubmit={handleSignUp} className='form'>
            <h2 className='title'>Sign Up</h2>
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
                <div className='formGroup'>
                    <label htmlFor="email" className='label'>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='input'
                        required
                    />
                </div>
                <div className='formGroup'>
                    <label htmlFor="confirm-email" className='label'>Confirm Email</label>
                    <input
                        type="email"
                        id="confirm-email"
                        value={emailConfirm}
                        onChange={(e) => setEmailConfirm(e.target.value)}
                        className='input'
                        required
                    />
                </div>
                <MainLanguageSelector 
                    title='Main language' 
                    id='language-selector' 
                    selectedValue={mainLanguage}
                    updateSelectedValue={(value: string) => setMainLanguage(value)} 
                    options={['English', 'Dutch']}
                />
                {error && <div className='error'>{error}</div>}
                <button type="submit" className='button'>Login</button>
            </form>
        </div>
    );
};

export default SignUpForm;
