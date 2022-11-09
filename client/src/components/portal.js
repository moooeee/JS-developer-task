import { createPortal } from "react-dom";

// we use portals to facilitate styling modals
// and avoid going into trouble regarding z-index and stacking

function Portal({ children }) {
  return createPortal(children, document.body);
}

export default Portal;
