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
    </div>
  );
};

export default SignUp;
