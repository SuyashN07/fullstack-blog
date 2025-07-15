import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function Home() {
    const [sort,setSort] = useState("new");
    const [posts, setPosts] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const [author,setAuthor] = useState('');
    const [authors,setAuthors] = useState([]);
    const [search,setSearch] = useState('')

    const fetchPosts = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/posts?page=${currentPage}&sort=${sort}`,{
                params:{
                    search,
                    author,
                }
            });
            setPosts(res.data.posts);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching posts",err);
        }
    };

    const fetchAuthors = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/`);
            setAuthors(res.data);
        } catch (err) {
            console.error("Error fetching authors",err);
        }
    }

    useEffect(() => {
        fetchAuthors();
    },[]); 

    useEffect(() => {

        fetchPosts();
    },[sort,currentPage,search,author]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2l font-bold mb-4">All Blog Posts</h2>

            {/*Controls*/}
            <div className="flex flex-wrap gap-4 mb-6">
                <input type="text" placeholder="Search posts" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md flex-grow" 
                />

                <select value={author} onChange={(e) => setAuthor(e.target.value)} 
                    className="border border-gray-300 p-2 rounded-md"
                >
                    <option value="">All Authors</option>
                    {authors.map((a) => (
                        <option key={a._id} value={a._id}>
                            {a.username}
                        </option>
                    ))}
                </select>

                <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                >
                    <option value="new">Newest</option>
                    <option value="popular">Popular</option>
                    <option value="trending">Trending</option>
                </select>
            </div>
            
            {/*Posts*/}
            {posts.length === 0 ? (
                <p className="text-gray-500">No posts yet</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post._id}
                            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                                <Link to={`/posts/${post._id}`}>{post.title}</Link>
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Author:</strong>{' '}
                                {post.author?.username ? (
                                    <>
                                    {post.author.username} {' '}
                                    <Link to={`/users/${post.author._id}`}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        (View Profile)
                                    </Link>
                                    </>
                                ) : (
                                    'Unknown'
                                )}
                            </p>
                            <p className="text-gray-700 mb-2">{post.content.substring(0,100)}...</p>
                            <Link to={`/posts/${post._id}`}
                            className="text-sm text-blue-500 hover:underline"
                            >
                                Read more ➡️
                            </Link>
                        </div>
                    ))}
                </div>
            )}


            {/*Paginnation*/}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p-1,1))}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-gray-700"
                >
                    Page {currentPage} of {totalPages} 
                </span>
                <button disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>  
    );
}

export default Home;