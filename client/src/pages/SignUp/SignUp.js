import "./SignUp.css";
const SignUp = ({ setLoginSignup }) => {
  return (
    <div className="SignUp">
      <button
        onClick={() => {
          setLoginSignup("");
        }}
      >
        X
      </button>
      <div>SIGN UP</div>
    </div>
  );
};

export default SignUp;
