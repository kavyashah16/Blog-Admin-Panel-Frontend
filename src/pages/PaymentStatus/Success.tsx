import { useEffect } from "react";
import { useNavigate } from "react-router";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("cart");

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "80px" }}>
      <span>✅ Payment Successful</span>
      <p>Thank you for your purchase!</p>
      <p>You will be redirected shortly...</p>
    </div>
  );
};

export default PaymentSuccess;
