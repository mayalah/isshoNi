import "./Description.css";
import saturn from "./../assets/saturn.svg";
import pause from "./../assets/pause.svg";
import global from "./../assets/global.svg";
import sun from "./../assets/sun.svg";
import question from "./../assets/question.svg";
import community from "./../assets/community.svg";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Description({ scrollStyle }) {
  return (
    <div className={`description-container ${scrollStyle}`}>
      <div className="description-top">
        <p className="description-para">
          <span className="colored-element">Isshoni</span> is proudly a{" "}
          <span className="colored-element">collaborative platform</span> for
          the future of virtual connections
        </p>
        <div className="saturn-svg">
          <img src={saturn} />
        </div>
      </div>
      <p className="description">
        A visionary web app, embracing its Japanese namesake 'together’, unites
        people <br />
        worldwide in a seamless online experience.
      </p>

      <div className="bridges-cnt">
        <div className="bridges-text-cnt">
          <h1>
            Building <br />
            Bridges
          </h1>
          <p>
            Breaking down the
            <br /> barriers to create
            <br /> meaningful connections
            <br /> and collaborations.
          </p>
        </div>
        <div className="bridges-img-cnt">
          <img src={pause} />
        </div>
      </div>

      <section className="feature-cnt">
        <div className="feature-element">
          <div className="feature-header">
            <img className="feature-img" src={global} />
            <h2>GLOBAL COLLABORATION</h2>
          </div>
          <div className="feature-para-cnt">
            <p>
              A unified platform that brings together individuals and teams from
              across the world.
            </p>
          </div>
        </div>
        <div className="feature-element">
          <div className="feature-header">
            <img className="feature-img" src={sun} />
            <h2>TIMEZONE MANAGEMENT</h2>
          </div>
          <div className="feature-para-cnt">
            <p>
              Offers centralized features that allow users to easily coordinate
              activites across different timezones.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-element">
          <img src={question} />
          <h2 className="footer-header1">QUESTIONS?</h2>
          <h2 className="footer-header2">FAQs</h2>
        </div>
        <div className="footer-element">
          <img src={community} />
          <h2 className="footer-header1">JOIN US</h2>
          <h2 className="footer-header2">COMMUNITY PAGE</h2>
        </div>
      </footer>
    </div>
  );
}
