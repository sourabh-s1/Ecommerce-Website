import React from 'react'
import playstore from '../../../assets/images/GooglePlay.png'
import './Footer.css'

function Footer() {
  return (
    <footer id="footer" data-aos="fade-up">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download our app for Android and IOS phone</p>
        <img src={playstore} alt="playstore"/>
      </div>

      <div className="midFooter">
        <h1>ShoppersSpot</h1>
        <p>Happiness starts here </p>
        <p>Ss logo and all respective assets are Copyrighted by their respective owners. Copyrights 2022 &copy; <a href="http">Sourabh-S1</a></p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us </h4>
        <a href="http://">Instagram</a>
        <a href="http://">Youtube</a>
        <a href="http://">Facebook</a>
      </div>

    </footer>
  )
}

export default Footer