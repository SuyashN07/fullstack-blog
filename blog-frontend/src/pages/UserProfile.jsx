import { useState,useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";

function UserProfile () {
    const { userId } = useParams();
    const [user,setUser] = useState(null);
    const [posts,setPosts] = useState([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setUser(userRes.data);

                const postRes = await axios.get(`http://localhost:5000/api/posts?author=${userId}`);
                setPosts(postRes.data.posts || []);
            } catch(err) {
                console.error('Error fetching profile: ',err);
            }
        };

        fetchUserProfile();
    },[userId]);

    if(!user) return <p className="text-center text-gray-500 mt-10">Loading User Profile...</p>

    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.username}'s Profile</h2>
                <p className="text-gray-600"><strong>Email: </strong>{user.email}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Posts by {user.username}</h3>

                {posts.length === 0 ? (
                    <p>No Posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id}
                            className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-200"
                        >
                            <h4 className="text-lg font-semibold text-blue-600">
                                <Link to= {`/posts/${post._id}`}>{post.title}</Link>
                            </h4>
                            <p className="text-gray-700">{post.content.substring(0,100)}...</p>
                            <p className="text-sm text-gray-500 mt-1">
                                <strong>Date: </strong>{new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))  
                )}
            </div>
        </div>
    );
}

export default UserProfile;