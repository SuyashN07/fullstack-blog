import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

function EditPost () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post,setPost] = useState(null);
    const [title,setTitle] = useState('');

    const [content,setContent] = useState('');


    useEffect(() => {
        const fetchPost = async () => {
            const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
            setPost(res.data);
            setTitle(res.data.title);
            setContent(res.data.content);
        };

        fetchPost();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log(id);

        try {
            await axios.put(`http://localhost:5000/api/posts/${id}`,
            { title, content },
            {headers:
                {Authorization : `Bearer ${token}`}
            });

            navigate('/profile');
        } catch(err) {
            console.error('Error updating post',err);
        }
    };

    if(!post) return <p className="text-center text-gray-500">Loading...</p>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Post</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows='6' required
                        className="px-4 py-2 border border-gray-300 rounded-md  resize: none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <button type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Update Post
                    </button>

                </form>

            </div>
        </div>
    );  
}

export default EditPost;