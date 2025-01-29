import React, { useContext } from "react";
import "./style.css";
import { Button } from "@mui/material";
import {
  BlackCircleTick,
  FastEfficientIcon,
  PaymentIcon,
  SendIcon,
  VerifiedIcon,
} from "../../assets/icons";
import mainContext from "../../context/mainContext";
const counterData = [
  {
    count: "10K",
    description:
      " Vehicles Serviced: Over 10 thousand vehicles serviced and back on the road through our platform. ",
  },
  {
    count: "50%",
    description:
      "Our users experience 50% faster response times than traditional roadside services.",
  },
  {
    count: "100+",
    description:
      "Join our network of 100 experienced mechanics ready to assist you across various locations.",
  },
];

const whyChooseCardData = [
  {
    icon: <SendIcon />,
    title: "Real-Time Assistance",
    description:
      "Get instant help by locating nearby mechanics available to assist you immediately",
  },
  {
    icon: <FastEfficientIcon />,
    title: "Fast and Efficient",
    description:
      "With just a few clicks, you can find a trusted mechanic, request service, and make secure payments.",
  },

  {
    icon: <VerifiedIcon />,
    title: "Verified Mechanics",
    description:
      "All mechanics on FixMyRider are verified professionals, ensuring you receive top-quality service.",
  },
  {
    icon: <PaymentIcon />,
    title: "Easy Payment",
    description:
      "Pay easily and securely through our payment gateway, making the entire process hassle-free.",
  },
];

const HomePage = () => {
  const { navigate } = useContext(mainContext);
  return (
    <div className="homepage-container">
      <div className="hero">
        <div className="hero-content">
          Find a Mechanic Near You Anytime, Anywhere
          <div className="sub-heading">
            FixMyRider connects you with trusted mechanics to solve your vehicle
            problems quickly. Whether you're stuck on the road or need a routine
            check, we're here to help.
          </div>
          <div>
            <Button
              sx={{ mx: 1 }}
              size="small"
              onClick={() => navigate("/find-mechanic")}
              style={{
                background: "none",
                fontSize: "1rem",
                textTransform: "none",
                color: "#fff",
                padding: "12px 22px",
                borderRadius: "12px",
                border: "1px solid #ffffff",
              }}
            >
              Get Started
            </Button>
            <Button
              sx={{ mx: 1 }}
              size="small"
              onClick={() => navigate("/find-mechanic")}
              style={{
                background: "#ffffff",
                fontSize: "1rem",
                textTransform: "none",
                color: "#111111",
                padding: "12px 22px",
                borderRadius: "12px",
                border: "1px solid #ffffff",
              }}
            >
              Find a Mechanic
            </Button>
          </div>
        </div>
      </div>
      <div className="counter">
        <div>Delivering Fast and Reliable Service Every Day</div>
        <div className="separater">///////////////////////</div>
        <div className="counter-content">
          {counterData.map((single) => (
            <div className="counter-card">
              <div className="count">{single.count}</div>
              <div className="description">{single.description}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="why-choose-us">
        <div className="left">
          <img src="images/why-choose-us.png" width="80px" className="image" />
          Why Choose Us?
          <p>
            FixMyRider is a web-based platform designed to make finding reliable
            mechanics fast and easy. Our focus is on efficiency, trust, and
            convenience, offering benefits for both vehicle owners and
            mechanics. With features like real-time mechanic tracking, secure
            payments, and service transparency, we ensure a seamless experience.
          </p>
        </div>
        <div className="cards">
          {whyChooseCardData.map((single) => (
            <div className="card">
              {single.icon}
              <div className="title">{single.title}</div>
              <div className="description">{single.description}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="cta">
        Ready to Get Started?
        <div className="sub-heading">
          Join FixMyRider and find trusted mechanics near you instantly!
        </div>
        <div>
          <Button
            sx={{ mx: 1 }}
            size="small"
            onClick={() => navigate("/about us")}
            style={{
              background: "#ffffff",
              fontSize: "1rem",
              textTransform: "none",
              color: "#111111",
              padding: "12px 22px",
              borderRadius: "12px",
              border: "1px solid #ffffff",
            }}
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="features">
        <div className="features-content">
          Features of FixMyRider
          <div className="sub-heading">
            FixMyRider offers a wide range of features designed to make vehicle
            maintenance more accessible and convenient for drivers, while
            providing mechanics with an efficient platform to manage their
            business.
          </div>
          <div className="features-list">
            <div className="feature-item">
              <BlackCircleTick />
              Real-Time Mechanic Locator
            </div>
            <div className="feature-item">
              <BlackCircleTick />
              Verified and Trusted Mechanics
            </div>
            <div className="feature-item">
              <BlackCircleTick />
              Seamless Booking System
            </div>
            <div className="feature-item">
              <BlackCircleTick />
              Integrated Payment Gateway
            </div>
            <div className="feature-item">
              <BlackCircleTick />
              Ratings and Reviews
            </div>
            <div className="feature-item">
              <BlackCircleTick />
              Admin Portal for Mechanics
            </div>
            <div className="feature-item">
              <BlackCircleTick />
              Emergency Assistance 24/7
            </div>
            <div className="feature-item">
              <BlackCircleTick />
              Business Expansion for Mechanics
            </div>
          </div>
          <img className="feature-image" src="/images/features-image.png" />
        </div>
      </div>
      <div className="cta">
        Experience quick and reliable vehicle repairs with just a few clicks.
        <div className="sub-heading">
          Join FixMyRider and find trusted mechanics near you instantly!
        </div>
        <div>
          <Button
            sx={{ mx: 1 }}
            size="small"
            onClick={() => navigate("/signup")}
            style={{
              background: "#ffffff",
              fontSize: "1rem",
              textTransform: "none",
              color: "#111111",
              padding: "12px 22px",
              borderRadius: "12px",
              border: "1px solid #ffffff",
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
