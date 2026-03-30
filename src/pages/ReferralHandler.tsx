import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReferralHandler() {
  const { refId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (refId) {
      // Save the referral ID to localStorage so we can use it when they register
      localStorage.setItem("referredBy", refId);
    }
    // Redirect them to the pricing page to choose a plan
    navigate("/pricing");
  }, [refId, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-4 text-green-500 font-bold">Applying referral code...</p>
    </div>
  );
}
