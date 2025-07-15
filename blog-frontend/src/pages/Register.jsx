import { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData,setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const {name,value} = e.target; 
        setFormData( prev => ({
            ...prev,[name]:value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/users/register', formData);
            alert('Registration successful');
            console.log(res.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
            console.error(err);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'> 
            <div className='w-full max-w-sm bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Register</h2>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                    <input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleChange} required 
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required 
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required 
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <button type='submit'
                        className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200'
                    >
                        Register
                    </button>
                    
                </form>

            </div>
        </div>
    )
}

export default Register; 