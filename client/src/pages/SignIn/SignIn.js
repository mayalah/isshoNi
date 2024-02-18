import "./SignIn.css";
const SignIn = ({ setLoginSignup }) => {
  return (
    <div className="SignIn">
      <button
        onClick={() => {
          setLoginSignup("");
        }}
      >
        X
      </button>
      <div>SIGN IN</div>
    </div>
  );
};

export default SignIn;
