import api from "@/api/axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();
  
  // الحارس: هيبدأ بـ false
  const isCalled = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // لو الحارس قيمته true، اخرج وماتكملش
      if (isCalled.current) return;
      
      // غير قيمة الحارس لـ true فوراً
      isCalled.current = true;

      try {
        const res = await api.post(`user/verify/${token}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setStatus("✅ Email Verified Successfully");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        setStatus("❌ Verification Failed. Please try again!");
      }
    };

    if (token) verifyEmail();
  }, [token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen  ">
            <div className="rounded-md shadow-md p-6 max-w-md w-full bg-white">
                <h2 className={`text-center text-2xl font-medium mb-4 ${status.includes('✅') ? 'text-green-500' : 'text-red-500'
                    }`}>
                    {status}
                </h2>
                <p className="text-center text-gray-700">
                    Your email has been successfully verified. You can now log in to your
                    account.
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
