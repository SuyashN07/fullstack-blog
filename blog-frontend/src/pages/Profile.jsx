import { useEffect,useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function Profile () {
    const [profile,setProfile] = useState({user:null,posts:[]});
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token =  localStorage.getItem('token');

                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                const data = res.data;
                setProfile({user:data.user, posts:data.posts});
            } catch (err) {
                console.error(err);
                alert('Failed to fetch profile');
                navigate('/login');
            }
            finally {
                setLoading(false);
            }
        };

        fetchProfile();
    },[]);

    const handleDelete = async (postId) =>{
        const confirmed = window.confirm("Are you sure you want to delete this post?")
        if(!confirmed) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/posts/${postId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Post deleted');
            setProfile((prev) =>  ({
                ...prev,
                posts: prev.posts.filter(post => post._id !== postId)
            }));
        } catch (err) {
            console.error(err);
            alert('Failed to delete post');
        }
    };

    if(loading) return <p className="text-center text-gray-500 mt-8">Loading...</p>

    return(
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {profile.user?.username}</h2>
                <p className="text-gray-600">Email: {profile.user.email}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Posts</h3>
                {profile.posts.length === 0 ? (
                    <p className="text-gray-500">No posts yet.</p>      
                ): (
                    profile.posts.map((post) => (
                        <div key={post._id} 
                            className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-200"
                        >
                            <h4 className="text-lg font-semibold text-blue-600">
                                <Link to = {`/posts/${post._id}`}>{post.title}</Link>
                            </h4>
                            <p className="text-gray-700">{post.content.substring(0,100)}...</p>

                            <div className="mt-2 flex gap-4 text-sm text-gray-500">
                                <Link to = {`/posts/${post._id}`} 
                                    className="text-blue-500 hover: underline font-medium"
                                >
                                    Read more
                                </Link>
                            </div>

                            { post.author=== profile.user._id && (

                                <>
                                    <button onClick={() => navigate(`/edit/${post._id}`)} 
                                        className="text-yellow-600 hover:underline font:medium"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDelete(post._id)}
                                        className="text-red-600 hover:underline font:medium"    
                                    >
                                        🗑️ Delete
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Profile;