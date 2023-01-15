import React from 'react'
import HomeIcon from '@material-ui/icons/Home';
import "./NavHome.css"
import {Link} from 'react-router-dom'

export default function NavHome() {
  return (
    
      <Link className='btn' to="/"><HomeIcon/></Link>  
   
    
    
  )
}
