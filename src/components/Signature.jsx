import { useRef } from "react";
import SignaturePad from "react-signature-canvas";

const SignatureComponent = ({ onSave }) => {
  const sigPad = useRef(null);

  const handleSave = () => {
    if (sigPad.current.isEmpty()) {
      alert("Please sign before saving!");
      return;
    }
    const signatureData = sigPad.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    onSave(signatureData); // Send to backend
  };

  const handleClear = () => {
    sigPad.current.clear();
  };

  return (
    <div>
      <SignaturePad
        ref={sigPad}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: "signature-canvas" }}
      />
      <button onClick={handleSave}>Save Signature</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};
export default SignatureComponent;
