import "./ForgetPassword.css";

const ForgetPassword = ({ setLoginSignup }) => {
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

export default ForgetPassword;