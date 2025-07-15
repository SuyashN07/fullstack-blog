import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [formData,setFormData] = useState({
        title:'',
        content:''
    });

    const [image,setImage] = useState(null);
    const [imagePreview,setImagePreview] = useState(null);

    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({...formData,[e.target.name]:e.target.value});
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const postData = new FormData();
        postData.append('title', formData.title);
        postData.append('content',formData.content);
        if(image) {
            postData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');

            const res = await axios.post('http://localhost:5000/api/posts',formData,
                {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Post created successfully');
            navigate('/profile');

        } catch (err) {
            console.error (err);
            alert('Error creating post');
            
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            <div className='w-full max-w-lg bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Create New Post</h2>

                <form on onSubmit={handleSubmit} className='flex flex-col gap-4'>

                    <input type='text' name='title' placeholder='Title' value={formData.title} onChange={handleChange} required
                        className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <textarea name='content' placeholder='Write your post here...' value={formData.content} onChange={handleChange}
                        rows='6'  required
                        className='px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'    
                    />

                    <input type='file' accept='image/*' onChange={handleImageChange} 
                        className='text-sm text-gray-600'
                    />

                    {imagePreview && (
                        <div className='mt-2'>
                            <p className='text-sm text-gray-500'>Image Preview:</p>
                            <img src={imagePreview} alt='Preview' style={{maxWidth: '200px'}} 
                                className='max-w-full h-auto mt-1 rounded-md shadow'
                            />
                        </div>
                    )}

                    <button type='submit'
                        className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200'
                    >
                        Create Post
                    </button>

                </form>

            </div>
        </div>
    )

};

export default CreatePost;