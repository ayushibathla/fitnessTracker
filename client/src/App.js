import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom'
import Home from'./views/Home'
import Register from './views/Register'
import Login from './views/Login'
import {Create} from './views/Create'
import { Dashboard } from './views/Dashboard';
import Show from './views/Show';
function App() {
  return (<div className='bg-dark bg-gradient min-vh-100'>

<Routes>

<Route path="/" element={<Register/>} default />

<Route path="/login" element={<Login/>} />

<Route path="/home" element={<Home/>} />

<Route path="/new-activities" element={<Create/>} />

<Route path="/users" element={<Dashboard/>} />

<Route path="/user/:userId" element={<Show/>} />
</Routes>
</div>
  );
}

export default App;
