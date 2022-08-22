import React from 'react'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import TimeLine from '../../components/timeline/TimeLine'
import Topbar from '../../components/topbar/Topbar'
import "./Home.css"

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <TimeLine />
        <Rightbar />
      </div>
    </>
  )
}