import { useState } from 'react';
import LoginForm from './loginForm';
import SignUpForm from './signUpForm';

const LoginFormController = () => {
    const [form, setForm] = useState<'login' | 'signUp' | 'forgottenPassword'>('login');

    const renderForm = () => {
        switch (form) {
            default:
            case 'login':
                return <LoginForm updateDisplay={(value: 'login' | 'signUp' | 'forgottenPassword') => setForm(value)}/>
            case 'signUp':
                return <SignUpForm  updateDisplay={(value: 'login' | 'signUp' | 'forgottenPassword') => setForm(value)}/>
            case 'forgottenPassword':
        }
    }

    return (
        renderForm()
    );
};

export default LoginFormController;
