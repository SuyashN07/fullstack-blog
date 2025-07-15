import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';  
import ShowPost from './pages/ShowPost';
import UserProfile from './pages/UserProfile';

function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element = {<Home />} />
          <Route path='/login' element = {<Login />} />
          <Route path='/register' element = {<Register />} />
          <Route path='/profile' element = {<Profile />} />
          <Route path='/create' element = {<CreatePost />} />
          <Route path='/edit/:id' element = {<EditPost />} />
          <Route path='/posts/:id' element = {<ShowPost />} />
          <Route path='/users/:userId' element = {<UserProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
