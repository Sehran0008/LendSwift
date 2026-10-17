import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import "./App.css";

const STORAGE_KEY = "lendswift-application";

const steps = [
  "Loan Details",
  "Personal Information",
  "KYC Verification",
  "Address",
  "Employment & Income",
  "Co-Applicant",
  "Documents & Signature",
  "Review & Submit",
];

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [loanType, setLoanType] = useState("Personal");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("36");
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [houseAddress, setHouseAddress] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [hasCoApplicant, setHasCoApplicant] = useState("No");
  const [coApplicantName, setCoApplicantName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [coApplicantEmail, setCoApplicantEmail] = useState("");
  const [coApplicantPhone, setCoApplicantPhone] = useState("");
  const [signature, setSignature] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [interestRate, setInterestRate] = useState(10);
  const [isLoaded, setIsLoaded] = useState(false);  
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Load the last saved demo application once when the app opens.
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        setCurrentStep(data.currentStep ?? 0);
        setLoanType(data.loanType ?? "Personal");
        setAmount(data.amount ?? "");
        setTenure(data.tenure ?? "36");
        setApplicantName(data.applicantName ?? "");
        setEmail(data.email ?? "");
        setAadhaar(data.aadhaar ?? "");
        setPan(data.pan ?? "");
        setHouseAddress(data.houseAddress ?? "");
        setCity(data.city ?? "");
        setAddressState(data.addressState ?? "");
        setPinCode(data.pinCode ?? "");
        setEmploymentType(data.employmentType ?? "");
        setCompanyName(data.companyName ?? "");
        setMonthlyIncome(data.monthlyIncome ?? "");
        setWorkExperience(data.workExperience ?? "");
        setHasCoApplicant(data.hasCoApplicant ?? "No");
        setCoApplicantName(data.coApplicantName ?? "");
        setRelationship(data.relationship ?? "");
        setCoApplicantEmail(data.coApplicantEmail ?? "");
        setCoApplicantPhone(data.coApplicantPhone ?? "");
        setSignature(data.signature ?? "");
        setConfirmed(data.confirmed ?? false);
        setInterestRate(data.interestRate ?? 10);
        setSubmitted(data.submitted ?? false);
        setApplicationId(data.applicationId ?? "");
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save every relevant form field whenever it changes.
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStep,
        loanType,
        amount,
        tenure,
        applicantName,
        email,
        aadhaar,
        pan,
        houseAddress,
        city,
        addressState,
        pinCode,
        employmentType,
        companyName,
        monthlyIncome,
        workExperience,
        hasCoApplicant,
        coApplicantName,
        relationship,
        coApplicantEmail,
        coApplicantPhone,
        signature,
        confirmed,
        interestRate,
        submitted,
        applicationId,
      })
    );
  }, [
    isLoaded,
    currentStep,
    loanType,
    amount,
    tenure,
    applicantName,
    email,
    aadhaar,
    pan,
    houseAddress,
    city,
    addressState,
    pinCode,
    employmentType,
    companyName,
    monthlyIncome,
    workExperience,
    hasCoApplicant,
    coApplicantName,
    relationship,
    coApplicantEmail,
    coApplicantPhone,
    signature,
    confirmed,
    interestRate,
    submitted,
    applicationId,
  ]);

  const nextStep = () => {
    if (currentStep === 0) {
      const maxAmount = {
        Personal: 1000000,
        Home: 10000000,
        Business: 5000000,
      };

      if (
        !amount ||
        Number(amount) < 50000 ||
        Number(amount) > maxAmount[loanType]
      ) {
        alert("Please enter a valid loan amount.");
        return;
      }
    }

    if (currentStep === 1) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!applicantName.trim() || !emailPattern.test(email.trim())) {
        alert("Please enter your name and a valid email.");
        return;
      }
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const monthlyRate = interestRate / 12 / 100;
  const emi =
    Number(amount) > 0 && Number(tenure) > 0
      ? monthlyRate === 0
        ? Number(amount) / Number(tenure)
        : (Number(amount) *
            monthlyRate *
            Math.pow(1 + monthlyRate, Number(tenure))) /
          (Math.pow(1 + monthlyRate, Number(tenure)) - 1)
      : 0;

  // Reset all fields when starting a fresh demo application.
  const startNewApplication = () => {
    setCurrentStep(0);
    setLoanType("Personal");
    setAmount("");
    setTenure("36");
    setApplicantName("");
    setEmail("");
    setAadhaar("");
    setPan("");
    setHouseAddress("");
    setCity("");
    setAddressState("");
    setPinCode("");
    setEmploymentType("");
    setCompanyName("");
    setMonthlyIncome("");
    setWorkExperience("");
    setHasCoApplicant("No");
    setCoApplicantName("");
    setRelationship("");
    setCoApplicantEmail("");
    setCoApplicantPhone("");
    setSignature("");
    setConfirmed(false);
    setInterestRate(10);
    setApplicationId("");
    setSubmitted(false);
  };
  

if (showAdminLogin) {
  return (
    <AdminLogin
      onLogin={(token) => {
        setAdminToken(token);
        setIsAdminLoggedIn(true);
        setShowAdminLogin(false);
        setShowDashboard(true);
      }}
    />
  );
}

if (showDashboard) {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setShowDashboard(false);
          setIsAdminLoggedIn(false);
          setAdminToken("");
          setShowAdminLogin(false);
        }}
        style={{
          margin: "15px",
          padding: "10px 16px",
          cursor: "pointer",
          background: "#3156d9",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Logout & Back to Loan Form
      </button>

      <AdminDashboard token={adminToken} />
    </div>
  );
}


if (submitted) {
  return (
    <main className="page">
      <header className="header">
        <div className="brand">LendSwift</div>
        <span>Application Status</span>

        <button
          type="button"
          onClick={() => {
            if (isAdminLoggedIn) {
              setShowDashboard(true);
            } else {
              setShowAdminLogin(true);
            }
          }}
        >
          Admin Dashboard
        </button>
      </header>

      <section className="form-card">
        <div className="placeholder">
          <h1>Application Submitted Successfully!</h1>
          <p>Your demo loan application has been submitted.</p>

          <p>
            Reference Number: <strong>{applicationId}</strong>
          </p>

          <p>Demo only — no real bank application was submitted.</p>

          <button
            className="primary"
            onClick={startNewApplication}
          >
            Start New Application
          </button>
        </div>
      </section>
    </main>
  );
}

  return (
    <main className="page">
 
<header className="header">
  <div className="brand">LendSwift</div>

  <span>Secure Loan Application</span>

  <button
    type="button"
    onClick={() => setShowAdminLogin(true)}
    style={{
      padding: "10px 16px",
      background: "#3156d9",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Admin Login
  </button>
</header>

      <section className="form-card">
        <h1>Apply for a Loan</h1>
        <p className="subtitle">
          Complete the steps below to submit your application.
        </p>

        <div className="progress-info">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>
            {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="step-heading">
          <span className="step-number">{currentStep + 1}</span>
          <h2>{steps[currentStep]}</h2>
        </div>

        {currentStep === 0 && (
          <div className="fields">
            <label>
              Loan Type
              <select
                value={loanType}
                onChange={(e) => {
                  setLoanType(e.target.value);
                  setAmount("");
                  setTenure(e.target.value === "Home" ? "120" : "36");
                }}
              >
                <option>Personal</option>
                <option>Home</option>
                <option>Business</option>
              </select>
            </label>

            <label>
              Loan Amount (₹)
              <input
                type="number"
                min="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter loan amount"
              />
            </label>

            <label>
              Loan Tenure
              <select value={tenure} onChange={(e) => setTenure(e.target.value)}>
                {(loanType === "Personal"
                  ? [12, 24, 36, 48, 60]
                  : loanType === "Home"
                    ? [60, 120, 180, 240, 300, 360]
                    : [12, 24, 36, 60, 84, 120]
                ).map((months) => (
                  <option key={months} value={months}>
                    {months} months
                  </option>
                ))}
              </select>
            </label>

            <div className="summary">
              <span>Selected loan</span>
              <strong>{loanType} Loan</strong>
              <span>Requested amount</span>
              <strong>{formatINR(amount)}</strong>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="fields">
            <label>
              Full Name
              <input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Enter your full name"
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div className="fields">
            <label>
              Aadhaar Number (Demo)
              <input
                type="text"
                maxLength={12}
                value={aadhaar}
                onChange={(e) =>
                  setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))
                }
                placeholder="Enter dummy number"
              />
            </label>
            <label>
              PAN Number (Demo)
              <input
                type="text"
                maxLength={10}
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
              />
            </label>
            <div className="placeholder">
              <strong>KYC Verification</strong>
              <p>Demo only — real verification is not connected.</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="fields">
            <label>
              House / Street Address
              <input
                type="text"
                value={houseAddress}
                onChange={(e) => setHouseAddress(e.target.value)}
                placeholder="Enter your address"
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
            </label>
            <label>
              State
              <select
                value={addressState}
                onChange={(e) => setAddressState(e.target.value)}
              >
                <option value="">Select State</option>
                <option>Uttar Pradesh</option>
                <option>Delhi</option>
                <option>Haryana</option>
                <option>Uttarakhand</option>
                <option>Rajasthan</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              PIN Code
              <input
                type="text"
                maxLength={6}
                value={pinCode}
                onChange={(e) =>
                  setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit PIN code"
              />
            </label>
          </div>
        )}

        {currentStep === 4 && (
          <div className="fields">
            <label>
              Employment Type
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="">Select employment type</option>
                <option>Salaried</option>
                <option>Self-Employed</option>
                <option>Student</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Company / Business Name
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company or business name"
              />
            </label>
            <label>
              Monthly Income (₹)
              <input
                type="number"
                min="0"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="Enter monthly income"
              />
            </label>
            <label>
              Work Experience
              <select
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
              >
                <option value="">Select experience</option>
                <option>Less than 1 year</option>
                <option>1–3 years</option>
                <option>3–5 years</option>
                <option>More than 5 years</option>
                <option>Not applicable</option>
              </select>
            </label>
          </div>
        )}

        {currentStep === 5 && (
          <div className="fields">
            <label>
              Do you have a Co-Applicant?
              <select
                value={hasCoApplicant}
                onChange={(e) => setHasCoApplicant(e.target.value)}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </label>

            {hasCoApplicant === "Yes" && (
              <>
                <label>
                  Co-Applicant Full Name
                  <input
                    type="text"
                    value={coApplicantName}
                    onChange={(e) => setCoApplicantName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </label>
                <label>
                  Relationship with Applicant
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                  >
                    <option value="">Select relationship</option>
                    <option>Parent</option>
                    <option>Spouse</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  Co-Applicant Email
                  <input
                    type="email"
                    value={coApplicantEmail}
                    onChange={(e) => setCoApplicantEmail(e.target.value)}
                    placeholder="example@email.com"
                  />
                </label>
                <label>
                  Co-Applicant Phone Number
                  <input
                    type="tel"
                    maxLength={10}
                    value={coApplicantPhone}
                    onChange={(e) =>
                      setCoApplicantPhone(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="Enter dummy phone number"
                  />
                </label>
              </>
            )}
          </div>
        )}

        {currentStep === 6 && (
          <div className="fields">
            <label>
              Upload Identity Document (Demo)
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </label>
            <label>
              Upload Address Proof (Demo)
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </label>
            <label>
              Type Your Name as Signature
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Enter your name"
              />
            </label>
            <label>
              <span>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                I confirm that the information entered is correct.
              </span>
            </label>
            <div className="placeholder">
              <p>Demo only — files are not uploaded to a server.</p>
              <p>No legally verified e-signature is being created.</p>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="fields">
            <div className="summary">
              <span>Loan Type</span>
              <strong>{loanType} Loan</strong>
              <span>Loan Amount</span>
              <strong>{formatINR(amount)}</strong>
              <span>Loan Tenure</span>
              <strong>{tenure} months</strong>
              <span>Applicant Name</span>
              <strong>{applicantName || "Not entered"}</strong>
              <span>Email Address</span>
              <strong>{email || "Not entered"}</strong>
            </div>

            <div className="edit-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setCurrentStep(0)}
              >
                Edit Loan Details
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setCurrentStep(1)}
              >
                Edit Personal Information
              </button>
            </div>

            <div className="placeholder">
              <strong>Review Before Submission</strong>
              <p>Please check your information before submitting.</p>
              <p>
                This is a demo project. No real loan application will be
                submitted.
              </p>
            </div>
          </div>
        )}

        {currentStep === 0 && (
          <div className="placeholder">
            <h3>EMI Calculator</h3>
            <label>
              Annual Interest Rate (%)
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={interestRate}
                onChange={(e) =>
                  setInterestRate(
                    Math.min(50, Math.max(0, Number(e.target.value)))
                  )
                }
              />
            </label>
            <p>
              Monthly EMI: <strong>{formatINR(emi)}</strong>
            </p>
            <p>
              Total Repayment: <strong>{formatINR(emi * Number(tenure))}</strong>
            </p>
            <p>
              Total Interest: <strong>{formatINR(emi * Number(tenure) - Number(amount))}</strong>
            </p>
            <p className="footer-note">
              Estimate only. Actual lender rates and charges may differ.
            </p>
          </div>
        )}
   
<div className="navigation">
  <button
    type="button"
    className="secondary"
    onClick={previousStep}
    disabled={currentStep === 0}
  >
    Previous
  </button>

  {currentStep < steps.length - 1 ? (
    <button
      type="button"
      className="primary"
      onClick={nextStep}
    >
      Next Step →
    </button>
  ) : (
    <button
      type="button"
      className="primary"
      disabled={isSubmitting}
      onClick={async () => {
        if (!confirmed) {
          alert("Please confirm that the information entered is correct.");
          return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
          const response = await fetch(
            "http://localhost:5000/api/applications",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: applicantName.trim(),
                email: email.trim(),
                type: loanType + " Loan",
                amount: Number(amount),
                tenure: Number(tenure),
              }),
            }
          );

          const result = JSON.parse(await response.text());
          console.log("Server response:", result);

          if (!response.ok) {
            throw new Error(
              result.message || "Application could not be saved."
            );
          }

          if (!result.application || !result.application.id) {
            throw new Error(
              result.message || "Application ID nahi mila."
            );
          }
          const newApplicationId =
                "LS-" + String(result.application.id).slice(-6);

          const newApplication = {
            id: newApplicationId,
            name: applicantName.trim(),
            type: loanType + " Loan",
            amount: Number(amount),
            tenure: Number(tenure),
            status: "Pending",
            email: email.trim(),
            submittedAt: new Date().toLocaleString(),
          };

          const savedApplications = JSON.parse(
            localStorage.getItem("lendswift-applications") || "[]"
          );

          savedApplications.push(newApplication);

          localStorage.setItem(
            "lendswift-applications",
            JSON.stringify(savedApplications)
          );

          setApplicationId(newApplicationId);
          setSubmitted(true);
        } catch (error) {
          console.error("Application submission failed:", error);
          setSubmitError(
            error.message || "Could not connect to the server."
          );
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      {isSubmitting ? "Submitting..." : "Submit Application"}
    </button>
  )}
</div>

{submitError && (
  <div className="placeholder" role="alert">
    <strong>Submission Failed</strong>
    <p>{submitError}</p>
  </div>
)}

        <p className="footer-note">
          Demo application · No real loan is being submitted
        </p>
      </section>
    </main>
  );
}

export default App;
