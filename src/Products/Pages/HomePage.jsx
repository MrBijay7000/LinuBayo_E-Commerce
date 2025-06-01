import ImageSlider from "../../shared/FormElements/ImageSlider";
import SharedCategoryPage from "./SharedCategoryPage";

export default function HomePage() {
  return (
    <>
      <ImageSlider />
      <SharedCategoryPage category="home" placeholder="Search dresses..." />
    </>
  );
}
