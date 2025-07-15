import { Link } from 'react-router-dom';

function Layout({ children }) {
    return(
        <div className='min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800'>
            {/*Navbar*/}
            <header className='bg-white shadow-md p-4 sticky top-0 z-50'>
                <nav className='container mx-auto flex justify-between items-center'>
                    <Link to='/' className='text-xl font-bold text-blue-600'>MyBlog</Link>
                    <div className='space-x-4'>
                        <Link to='/' className='hover:underline'>Home</Link>
                        <Link to='/create' className='hover:underline'>New Post</Link>
                        <Link to='/profile' className='hover:underline'>Profile</Link>
                        <Link to='/login' className='hover:underline'>Login</Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className='container mx-auto px-4 py-6 flex-1'>
                {children}
            </main>

            {/* Footer */}
            <footer className='bg-gray-200 text-center p-4 text-sm text-gray-600'>
                &copy; {new Date().getFullYear()} MyBlog. All Rights Reserved.
            </footer>

        </div>
    )
}