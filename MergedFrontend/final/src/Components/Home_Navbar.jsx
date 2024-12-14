import React,{useState,useEffect} from "react";
import "../CSS/Home_Navbar.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from "react-router-dom";


function Home_Navbar({page}) {
  const navigate = useNavigate();
  const [dimen,setDimen]=useState({
    height:"7vh",
    width:"7vw"
  })
  useEffect(()=>{
      if(page=="Home"){
        setDimen({height:"5vh",width:"4vw"})
      }
  },[]);
  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };


  return (
    <nav className="navbar fixed-top bg-transparent">
      <div className="container-fluid">
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
          style={{height:dimen.height,width:dimen.width}}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Navbar
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <button
                  className="btn btn-danger w-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Home_Navbar;