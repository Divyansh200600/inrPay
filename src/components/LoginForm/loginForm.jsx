import React, { useState } from 'react';
import { auth } from '../../utils/FireBaseConfig/fireBaseConfig'; // Import auth from firebaseConfig
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword and createUserWithEmailAndPassword functions
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [userType, setUserType] = useState('buyer'); // Default user type is 'buyer'
  const [isLogin, setIsLogin] = useState(true); // State to manage whether to show login or signup form
console.log(userType);
console.log(setUserType);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword); // Use signInWithEmailAndPassword function
      toast.success('Login successful'); // Display success toast
      // Redirect user or perform other actions upon successful login
    } catch (error) {
      toast.error(`Login error: ${error.message}`); // Display error toast
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword); // Use createUserWithEmailAndPassword function
      toast.success('Signup successful'); // Display success toast
      setIsLogin(true); // After successful signup, switch back to login form
    } catch (error) {
      toast.error(`Signup error: ${error.message}`); // Display error toast
    }
  };

  return (
    <div style={containerStyle}>
      <ToastContainer /> {/* Add ToastContainer component */}
      <div style={formContainerStyle}>
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>
        {isLogin ? (
          <>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} />
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter your password" style={inputStyle} />
            <button onClick={handleLogin} style={buttonStyle}>Login</button>
            <p>Don't have an account? <span style={linkStyle} onClick={() => setIsLogin(false)}>Signup</span></p>
          </>
        ) : (
          <>
            <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} />
            <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Enter your password" style={inputStyle} />
            <button onClick={handleSignup} style={buttonStyle}>Signup</button>
            <p>Already have an account? <span style={linkStyle} onClick={() => setIsLogin(true)}>Login</span></p>
          </>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: `linear-gradient(135deg, #ff9933 25%, #fff 25%, #fff 50%, #128807 50%, #128807 75%, #fff 75%, #fff)`,
  backgroundSize: '30px 30px',
};

const formContainerStyle = {
  width: '300px',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.5s ease-in-out',
  transformStyle: 'preserve-3d',
};

const inputStyle = {
  width: '100%',
  marginBottom: '10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer',
};

const linkStyle = {
  color: '#007bff',
  cursor: 'pointer',
};

export default LoginForm;
