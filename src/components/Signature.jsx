import { useRef, useEffect, useState } from "react";
import SignaturePad from "react-signature-canvas";

const SignatureComponent = ({ onSave }) => {
  const sigPad = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(500); // Default width

  useEffect(() => {
    // Adjust canvas size based on screen width
    const updateCanvasSize = () => {
      const containerWidth =
        document.getElementById("signature-container")?.offsetWidth || 500;
      setCanvasWidth(containerWidth - 20); // Add some padding
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const handleSave = () => {
    if (sigPad.current.isEmpty()) {
      alert("Please sign before saving!");
      return;
    }
    const signatureData = sigPad.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    onSave(signatureData);
  };

  const handleClear = () => {
    sigPad.current.clear();
  };

  return (
    <div id="signature-container" className="signature-wrapper">
      <SignaturePad
        ref={sigPad}
        penColor="black"
        canvasProps={{
          width: canvasWidth,
          height: 200,
          className: "signature-canvas",
        }}
      />
      <div className="button-group">
        <button onClick={handleSave}>Save Signature</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
};

export default SignatureComponent;
