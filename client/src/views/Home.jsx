import React from 'react'
import Logout from '../components/Logout';
import { useState, useEffect } from 'react';
import Table from "react-bootstrap/Table";
import Modal from 'react-modal'
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Home = () => {
  // const [bio, setBio] = useState('');
  const user = JSON.parse(localStorage.getItem('user'))
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken')
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [isHovered, setIsHovered] = useState(false);
  const reload = () => window.location.reload();

  const uploadProfilePic = (e) => {
    e.preventDefault()
    const profileData = new FormData();
    profileData.append("file", profilePic);
    
    axios.patch(`http://localhost:8000/user/profile/${user._id}/image`, profileData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
          console.log(res.data.updatedUser.profilePic)
          setProfilePic(res.data.updatedUser.profilePic)
          reload()
        }).catch((err) => {
          console.log(err)
          setErrors(err.response.data)
        })
      }


  useEffect (() => {
    if (user && token) {
      axios
        .get(`http://localhost:8000/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setProfilePic(res.data.user.profilePic);
          setCurrentUser(res.data.user);
          console.log(res.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  },[loading]); //adding the user & token dependencies creates an infinite loop for some reason, will fix later

  if (!token) {
    return <h1 className='text-center pt-5 display-0'>Please login to view this page.</h1>; // or Nav
  }
  
  if (loading && token) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className='container-fluid d-flex justify-content-between border border-black bg-white shadow' style={{ height: '100vh', width:"70%" }}>
        <div className='d-flex flex-column mt-5 text-center align-content-center ms-4' style={{ width: '50%' }}>
          <span className='ms-5 border rounded-circle border-black shadow' style={{height:"28vh", width:"15vw"}}>{ profilePic ? (<img className='d-flex justify-content-center border rounded-circle' alt='' src={`http://localhost:8000/public/images/${profilePic}`} style={{height:"100%", width:"100%", object:"fill"}} />) : (<img className='d-flex justify-content-center border rounded-circle' alt='' src={`http://localhost:8000/public/images/file-1725092290248.jpeg`} style={{height:"100%", width:"100%", objectFit:"cover"}} />)}
            <button className='border-0 shadow fw-bold rounded-circle border-black text-center text-white mask' style={{position: "relative", top:"-13%", height:"50px", width:"50px", background: "linear-gradient(45deg, hsla(168, 85%, 52%, 0.5), hsla(263, 88%, 45%, 0.5))", transition: "background 0.3s ease, transform 0.3s ease", transform: isHovered ? "scale(1.1)" : "scale(1)"}} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => setVisible(true)} name='profilePic'>+</button>
            <Modal
            ariaHideApp={false}
            isOpen={visible}
            onRequestClose={() => setVisible(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(2px)",
                WebkitBackdropfilter: "blur(2px)",},
              content: {
                border: "2px solid #ccc",
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                borderRadius: "16px",}
            }}>
            <button
              className="pb-1 text-sm fw-semibold border border-2 rounded bg-danger px-2 text-white me-3 position-absolute end-0" onClick={() => setVisible(false)}>
              x
            </button>
            <label className="fw-bold text-secondary">Upload profile picture </label>
            <div className="display:flex justify-center flex-col my-2">
              <form onSubmit={uploadProfilePic} enctype="multipart/form-data">
                <input 
                  className="py-2 px-4 border-0 text-sm fw-semibold"
                  type='file'
                  name='profilePic'
                  onChange={(e) => setProfilePic(e.target.files[0])}/>
                {errors.error && <p className="px-4 text-danger position-absolute">{errors.error}</p>}
                <button className="btn btn-success shadow-sm text-white text-sm fw-bold py-2 px-4 rounded-full d-flex" style={{marginLeft: "auto"}}>
                  Done
                </button>
              </form>
            </div>
          </Modal>
            </span>
          <p className='mt-5  display-6 fw-semibold border-bottom'>{currentUser.firstName} {currentUser.lastName}</p>
          
         
         <div className='w-100 h-25'>
          <img src='https://img.freepik.com/free-photo/view-tennis-player-with-digital-art-style-effect_23-2151737691.jpg?t=st=1725096340~exp=1725099940~hmac=59666b81c890e4171cfb6ac9efc81d162ad4edc2f775d055370a536f718236a1&w=740' className='img-fluid w-50 h-100 d-block mx-auto rounded-3'></img>
          </div> 
        
          
          <div >
         
         
          <Link to="/new-activities">Add a Goal</Link> <br/>
          <Link to="/users">All Users</Link>
        
          <Logout />
          </div>
        </div>
        <div className='border m-5 container border-black shadow  d-flex align-items-center justify-content-center  flex-column'>
          <div className='display-6 bg-primary text-white border-bottom fw-semibold rounded-5 rounded-top-0  d-flex align-items-center justify-content-center w-75 h-25'><p>My Stats</p></div>
          <div  className='d-flex flex-column align-items-center justify-content-center'>
            <div className='text-center fw-semibold mt-5 pb-2 bg-warning w-50 rounded '>Activities: <span className='fw-bold text-success'>{currentUser.activities.length}</span></div>
            <div className='text-center fw-semibold mt-5 pb-5'>Streak: <span className='fw-bold text-danger'>{currentUser.caloriesSum.toFixed(0)}</span> Kilocalories Burned</div>
          </div>
          <div className='mt-2' style={{height: "38%" , overflowY: "auto", overflowX: "hidden"}}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th fw-semibold>Date</th>
                  <th fw-semibold>Duration</th>
                  <th fw-semibold>Distance</th>
                  <th fw-semibold>Calories Burned</th>
                </tr>
              </thead>
              <tbody>
                {currentUser.activities && currentUser.activities.length > 0 ? currentUser.activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.ActivityChecked}</td>
                  <td>{activity.createdAt.split("T")[0].split("-").reverse().join("/")}</td>
                  <td>{activity.Duration} Min</td>
                  <td>{activity.Distance} m</td>
                  <td>{activity.CaloriesBurned.toFixed(3)} Cal</td>
                </tr>)) : (<tr className='col-4 lead'>No Activities</tr>)}
              </tbody>
            </Table>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Home;
