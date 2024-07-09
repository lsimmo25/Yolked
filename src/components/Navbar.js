import React from "react";
import { Link } from "react-router-dom"

function NavBar() {



    return(
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/workouts">Workouts</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/login">Login/Signup</Link></li>
            </ul>
        </nav>
    )

}

export default NavBar