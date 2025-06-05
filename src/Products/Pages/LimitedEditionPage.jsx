import LimitedEdition3DEffect from "../../shared/FormElements/LimitedEdition3DEffect";
import SharedCategoryPage from "./SharedCategoryPage";

export default function LimitedEditionPage() {
  return (
    <div>
      <LimitedEdition3DEffect />
      <SharedCategoryPage category="limited" placeholder="Search dresses..." />
    </div>
  );
}
