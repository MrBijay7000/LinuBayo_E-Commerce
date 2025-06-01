import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import slider1 from "/slider/s1.png";
import slider2 from "/slider/s2.png";
import slider3 from "/slider/s3.png";
import slider4 from "/slider/s4.png";

export default function ImageSlider() {
  const images = [
    {
      url: slider2,
      alt: "Image 1",
    },
    {
      url: slider4,
      alt: "Image 2",
    },
    {
      url: slider3,
      alt: "Image 3",
    },
    {
      url: slider1,
      alt: "Image 4",
    },
  ];

  return (
    <Carousel
      showArrows={true}
      showThumbs={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={2000}
      showStatus={false}
    >
      {images.map((image, index) => (
        <div key={index}>
          <img src={image.url} alt={image.alt} />
        </div>
      ))}
    </Carousel>
  );
}
