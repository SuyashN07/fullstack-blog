import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData,setFormData] = useState ({
        email:'',
        password:''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData(prev => ({...prev,[name]:value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/login',formData);
            alert('Login successful')
            console.log(formData);

            localStorage.setItem('token',res.data.token);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login Failed');
            console.error(err);
        }
    }

    
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            <div className='w-full max-w-sm bg-white rounded-lg shadow-lg p-8'>
                <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>Login</h2>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'     
                    />

                    <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required 
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <button type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors
                        duration-200'
                    >
                        Login
                    </button>

                </form>

            </div>
        </div>
    )
}

export default Login;