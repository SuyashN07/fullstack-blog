import React, { useEffect,useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ShowPost () {
    const { id } = useParams();
    const [post,setPost] = useState(null);
    const [commentText,setCommentText] = useState('');
    const [comments, setComments] = useState([]);


    let userId = null;
    let token = null;

    try{
        token = localStorage.getItem('token');

        if(token) {
            const base64Url = token.split('.')[1];
            const base64 = decodeURIComponent(
                atob(base64Url).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')
            )
            const decoded = JSON.parse(base64);
            userId = decoded.userId;
        }
    } catch (err) {
        console.log("Error: ",err);
        console.error("Error decoding token: ",err);
    }

    useEffect(() => {
        const fetchPost = async () => {
            try{
                await axios.patch(`http://localhost:5000/api/posts/${id}/view`);

                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                console.error("Error fetching posts.",err);
            }
        };

        const fetchComments = async() => {
            try {
                const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
                setComments(res.data);
            } catch (err) {
                console.error("Error loading comments.",err);
            }
        }

        fetchPost();
        fetchComments();
    },[id]);


    const handleLike = async () => {
        try {
            await axios.patch(`http://localhost:5000/api/posts/${id}/like`, {},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updated = await axios.get(`http://localhost:5000/api/posts/${id}`);
            setPost(updated.data);
        } catch (err) {
            console.error("Error toggling like.",err);
        }
    };

    const handleComment = async () => {
        try{
            const token = localStorage.getItem('token');
            if(!token) {
                alert("You must login to comment.");
                return;
            }

            await axios.post(`http://localhost:5000/api/comments/${id}`, {
                text: commentText
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCommentText('');

            const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
            setComments(res.data);
        } catch(err) {
            if(err.response && err.response.status === 401) {
                alert('Your session has expired. Please login again to continue.');
                localStorage.removeItem('token');
            }
            console.error("error posting comments", err);
        }
    }

    if(!post) return <p className='text-center mt-10 text-gray-500'>Loading...</p>

    return (
        <div className='max-w-3xl mx-auto p-4 bg-white shadow-md rounded-md mt-6'>
            <h2 className='text-2xl font-bold mb-2'>{post.title}</h2>
            <p className='text-gray-700 mb-4'>{post.content}</p>
                
            <div className='text-sm text-gray-600 mb-2'>
                <strong>Author:</strong>{' '}
                {post.author?.username ? (
                    <>
                        {post.author.username} {' '}
                        <Link to={`/users/${post.author._id}`}
                            className='text-blue-600 hover:underline'
                        >
                            (View Profile)
                        </Link>
                    </>
                ) : (
                    'Unknown'
                )}
            </div>

            <p className='text-sm text-gray-500 mb-4'>
                <strong>Date:</strong>{new Date(post.createdAt).toLocaleString()}
            </p>
            {post.image && ( 
                <img src={`http://localhost:5000/uploads/${post.image}`} alt="Post visual"
                    className='w-full max-h-[400px] object-cover rounded-md mb-4'
                />
            )}

            <div className='flex items-center justify-between text-sm text-gray-700 mb-6'>
                <p>👁️ Views: {post.views || 0}</p>
                <button onClick={handleLike}
                    className='bg-pink-100 hover: bg-pink-200 text-pink-600 px-4 py-1 rounded transition'
                >
                    {Array.isArray(post.likes) && post.likes.includes(userId)
                    ? '💔 Unlike'
                    :'🩷 Like'} ({post.likes?.length || 0}) 
                </button>
            </div>    

            <div className='mt-6'>
                <h3 className='text-lg font-semibold mb-2'>Comments</h3>
                {comments.length === 0 && ( 
                    <p className='text-gray-500'>No Comments Yet.</p>
                )}
                <div className='space-y-3'>
                    {comments.map(comment => (
                        <div key={comment._id} className='border border-gray-200 p-2 rounded'>
                            <strong className='text-gray-700'>
                                {Comment.user?.username || 'Anonymous'}
                            </strong>: {comment.text}
                            <span>{comment.text}</span>
                        </div>
                    ))}
                </div>

                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} 
                    placeholder='Write a Comment...' rows={3}
                    className='w-full mt-4 p-2 border border-gray-300 rounded'
                />
                <button onClick={handleComment} 
                    className='mt-2 bg-blue-500 text-white px-4 py-2 rounded hover: bg-blue-600 transition'
                >
                    Post Comment
                </button>
            </div>

        </div> 
    );
}

export default ShowPost;