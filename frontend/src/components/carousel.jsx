import Carousel from 'react-bootstrap/Carousel';

export default function CareerlinkCarousel() {
  return (
    <div style={{height: "auto", width:"70vw", margin: "4rem", marginLeft:"auto", marginRight:"auto", color:"white"}}>
      <Carousel>
        <Carousel.Item interval={4000}>
          <img
            className="d-block w-100"
            src="https://i.postimg.cc/zXfvGJjS/Career-Link.png"
            alt="CareerLink platform dashboard preview"
            style={{borderRadius:"2rem"}}
          />
        </Carousel.Item>
        <Carousel.Item interval={4000}>
          <img
            className="d-block w-100"
            src="https://i.postimg.cc/CLK5xFNs/Carousal2.png"
            alt="Professional networking connections visualization"
            style={{borderRadius:"2rem"}}
          />
        </Carousel.Item>
        <Carousel.Item interval={4000}>
          <img
            className="d-block w-100"
            src="https://i.postimg.cc/bNvrwzTQ/Carousal3.png"
            alt="Interactive talent search tools preview"
            style={{borderRadius:"2rem"}}
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

