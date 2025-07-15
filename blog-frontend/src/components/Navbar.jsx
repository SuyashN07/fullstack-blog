import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
    return (
        <nav className='navbar'>    
            <Link to='/' style={{marginRight: '10px'}}>Home</Link>
            <Link to='/login' style={{marginRight: '10px'}}>Login</Link>
            <Link to='/register' style={{marginRight: '10px'}}>Register</Link>
            <Link to='/profile' style={{marginRight: '10px'}}>Profile</Link>
            <Link to='/create' style={{marginRight: '10px'}}>Create Post</Link>
        </nav>

    );
}

export default Navbar;