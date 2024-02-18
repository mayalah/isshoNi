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
    </div>
  );
};

export default SignIn;
